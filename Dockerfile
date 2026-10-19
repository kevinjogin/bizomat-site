# OpenSketch server image (used by Fly.io; any Docker host works).
#
#   docker build -t opensketch .
#   docker run -p 8080:8080 -e OPENSKETCH_PASSWORD=... -v opensketch-data:/data opensketch
#
# Documents live in /data (a volume). WITH_MACRO=1 also installs the SOLIDWORKS macro toolchain
# (LibreOffice, Java, sketch solver); it is best effort: if it fails, the image still works and the macro
# export sends every part as a STEP file.

ARG BASE=python:3.12-slim

# The SOLIDWORKS add-in (solidworks/): built here so the Connect AI dialog can offer it for download. Best effort:
# if the .NET build fails, the image still builds and the dialog says the download is not on this server.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS swaddin
WORKDIR /src
COPY solidworks ./solidworks
RUN mkdir -p /out && (bash solidworks/build.sh && cp -r solidworks/dist/OpenSketch-SOLIDWORKS /out/) \
    || echo "SOLIDWORKS add-in not built: no download on this server"

FROM ${BASE}

ARG WITH_MACRO=1
ARG OPENSKETCH_VERSION=dev
ENV PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1 \
    OPENSKETCH_DATA=/data OPENSKETCH_VERSION=${OPENSKETCH_VERSION}

# OpenCascade (build123d) needs these X/GL libraries even without a screen; node runs the browser's sketch
# solver for MCP inspect_design (sketch degrees of freedom)
RUN apt-get update -qq \
 && apt-get install -y -qq --no-install-recommends libgl1 libglu1-mesa libxrender1 libxext6 libx11-6 nodejs \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# dependencies first, so code changes rebuild fast
COPY pyproject.toml README.md ./
RUN mkdir -p opensketch/features && touch opensketch/__init__.py opensketch/features/__init__.py && pip install -q ".[ai]" && pip uninstall -y -q opensketch
COPY opensketch ./opensketch
COPY skills ./skills
COPY --from=swaddin /out /tmp/swaddin
RUN mkdir -p opensketch/static/downloads && if [ -d /tmp/swaddin/OpenSketch-SOLIDWORKS ]; then \
      cd /tmp/swaddin && python -m zipfile -c /app/opensketch/static/downloads/OpenSketch-SOLIDWORKS.zip OpenSketch-SOLIDWORKS; \
    fi; rm -rf /tmp/swaddin
# run from the source folder (python -m opensketch in /app), so the web page files are used as they are
RUN python -c "import build123d, opensketch.server; print('OpenSketch ready')"

RUN if [ "$WITH_MACRO" = "1" ]; then \
      ( apt-get update -qq \
        && apt-get install -y -qq --no-install-recommends libreoffice-calc python3-uno default-jdk-headless gcc g++ \
        && bash opensketch/vendor/sldmacro/scripts/setup_env.sh \
        && rm -rf /var/lib/apt/lists/* ) \
      || echo "SOLIDWORKS macro toolchain not installed: the macro export will send parts as STEP files"; \
    fi

# runs as root inside the container: Fly mounts the /data volume owned by root
RUN mkdir -p /data
EXPOSE 8080
CMD ["python", "-m", "opensketch", "--host", "0.0.0.0", "--port", "8080", "--no-browser"]
