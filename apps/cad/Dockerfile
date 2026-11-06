# OpenSketch server image (used by Fly.io; any Docker host works).
#
#   docker build -t opensketch .
#   docker run -p 8080:8080 -e OPENSKETCH_PASSWORD=... -v opensketch-data:/data opensketch
#
# Accounts, AI app connections and upload links live in /data (a volume).
#
# Reproducible: the base images are pinned by digest and the Python packages come from requirements.txt (exact
# versions with hashes, the ones CI tests). Layer order, slowest-changing first, so a code change rebuilds only the
# last few small layers: system libraries, Python packages, then the app.

ARG BASE=python:3.12-slim@sha256:a6e34c598f2467ed0e9a8d349809fcd8b5c603269512df273a0bb1784edc11b1

# The SOLIDWORKS add-in (solidworks/): built here so the home page can offer it for download. Best effort:
# if the .NET build fails, the image still builds and the page says the download is not on this server.
FROM mcr.microsoft.com/dotnet/sdk:8.0@sha256:f7e28a0a3f6f9235929ec19274fd0ddf8534e9159f99fac602ac73304f1ce99f AS swaddin
WORKDIR /src
COPY solidworks ./solidworks
RUN mkdir -p /out && (bash solidworks/build.sh && cp -r solidworks/dist/OpenSketch-SOLIDWORKS /out/) \
    || echo "SOLIDWORKS add-in not built: no download on this server"

FROM ${BASE}

ENV PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1 OPENSKETCH_DATA=/data

# OpenCascade (build123d) needs these X/GL libraries even without a screen; node runs the sketch solver
# (opensketch/solver) that solves every sketch before it is sent to SOLIDWORKS
RUN apt-get update -qq \
 && apt-get install -y -qq --no-install-recommends libgl1 libglu1-mesa libxrender1 libxext6 libx11-6 nodejs \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# Python packages: only requirements.txt decides this layer (the app runs from source in /app, so it is not
# installed as a package). Change versions there, through a pull request that runs the tests.
COPY requirements.txt ./
RUN pip install -q --require-hashes -r requirements.txt

COPY opensketch ./opensketch
COPY --from=swaddin /out /tmp/swaddin
RUN mkdir -p opensketch/static/downloads && if [ -d /tmp/swaddin/OpenSketch-SOLIDWORKS ]; then \
      cd /tmp/swaddin && python -m zipfile -c /app/opensketch/static/downloads/OpenSketch-SOLIDWORKS.zip OpenSketch-SOLIDWORKS; \
    fi; rm -rf /tmp/swaddin
# run from the source folder (python -m opensketch in /app)
RUN python -c "import build123d, opensketch.server; print('OpenSketch ready')"

# the version last, so it does not invalidate the layers above (every deploy passes a new one)
ARG OPENSKETCH_VERSION=dev
ENV OPENSKETCH_VERSION=${OPENSKETCH_VERSION}

# runs as root inside the container: Fly mounts the /data volume owned by root
RUN mkdir -p /data
EXPOSE 8080
# --supervise: a small parent process asks the server for /healthz every 5 s and restarts it when it stops answering
# for 2 minutes (OPENSKETCH_HANG_SECONDS) or exits; the hung server's thread stacks go to the log first
# --host :: : IPv4 and IPv6, so the BIZOMAT router reaches it over Fly's private network (cados.internal, IPv6)
CMD ["python", "-m", "opensketch", "--host", "::", "--port", "8080", "--no-browser", "--supervise"]
