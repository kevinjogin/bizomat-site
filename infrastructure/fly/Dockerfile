# BIZOMAT platform image: one image, four roles, chosen by the Fly process group's command (fly.toml [processes]):
#   proxy  the edge proxy (infrastructure/proxy, Node 22, port 8080)
#   web    the website (Astro static site + its Node server, port 8003)
#   work   Project Management (apps/work, Hono on Node, port 8002, volume /data/work)
#   cad    CAD Automation (apps/cad, Python 3.12 FastAPI + OpenCascade, port 8001, volume /data/cad)
#
# Build context: the repository root (the root .dockerignore applies).
#   docker build -f infrastructure/fly/Dockerfile -t bizomat .
#   docker build -f infrastructure/fly/Dockerfile --target runtime-base -t bizomat:base .   # proxy and cad only
#   docker run --rm bizomat bizomat-entrypoint help
#
# Reproducible: the base images are pinned by digest (the same Python and .NET pins as apps/cad/Dockerfile),
# the npm trees come from the lock files (npm ci) and the Python packages from apps/cad/requirements.txt (exact
# versions with hashes). Each app builds in its own stage, so a change to one app rebuilds only its stage and
# its layer in the final image.

ARG PYTHON_IMAGE=python:3.12-slim@sha256:a6e34c598f2467ed0e9a8d349809fcd8b5c603269512df273a0bb1784edc11b1
# node 22.23.4 (bookworm-slim); only the node binary is copied into the runtime image
ARG NODE_IMAGE=node:22-bookworm-slim@sha256:5ec23b7c622b00547753bc6ffd78085dd868a68aeb41c8e0a1418f033e13d96d
ARG DOTNET_SDK_IMAGE=mcr.microsoft.com/dotnet/sdk:8.0@sha256:f7e28a0a3f6f9235929ec19274fd0ddf8534e9159f99fac602ac73304f1ce99f

# ----------------------------------------------------------------------------------------------- Node runtime
FROM ${NODE_IMAGE} AS node

# ----------------------------------------------------------------------------------------------- website
# The website's sources: the repository without the apps and the platform files, so a change to apps/ or
# infrastructure/ leaves the website build cached (COPY --from is cached by content).
FROM ${NODE_IMAGE} AS web-src
COPY . /src
RUN rm -rf /src/apps /src/infrastructure /src/.github

FROM ${NODE_IMAGE} AS web-static
WORKDIR /src
ENV ASTRO_TELEMETRY_DISABLED=1 NPM_CONFIG_UPDATE_NOTIFIER=false NPM_CONFIG_FUND=false NPM_CONFIG_AUDIT=false
COPY --from=web-src /src/package.json /src/package-lock.json ./
RUN npm ci
COPY --from=web-src /src/ ./
# about 3 minutes: ~4,400 pages, the Pagefind index and the postbuild checks
RUN npm run build

FROM web-static AS web-build
# the website's Node server: dist-server/server.mjs serves dist/ and the site's API routes
RUN npm run build:server && test -f dist-server/server.mjs

# ----------------------------------------------------------------------------------------------- work
FROM ${NODE_IMAGE} AS work-client
WORKDIR /src/apps/work
ENV NPM_CONFIG_UPDATE_NOTIFIER=false NPM_CONFIG_FUND=false NPM_CONFIG_AUDIT=false
COPY apps/work/package.json apps/work/package-lock.json ./
RUN npm ci
COPY apps/work/ ./
RUN npm run build:client

FROM work-client AS work-build
# dist/node/server.mjs (the Node server) next to dist/client; then only the production packages are kept
RUN npm run build:node && test -f dist/node/server.mjs && npm prune --omit=dev

# The ERP design prototype (owner's decision, 14 Nov 2026: published at bizomat.ai/erp-design-preview/). Static files
# with demonstration data only, built from the work app's sources by its own Vite config (relative addresses), and
# served by the web Machine from dist/erp-design-preview under the website's headers. Its own stage, so neither the
# work app's build nor its image folder changes. docs/erp/ux/08-prototype-guide.md
FROM work-client AS erp-preview
RUN npm run build:erp-preview && test -f dist/erp-design-preview/index.html

# ----------------------------------------------------------------------------------------------- cad
# The SOLIDWORKS add-in, for the CAD server's download page. Best effort, as in apps/cad/Dockerfile: when the
# .NET build fails, the image still builds and the page says the download is not on this server.
FROM ${DOTNET_SDK_IMAGE} AS swaddin
WORKDIR /src
COPY apps/cad/solidworks ./solidworks
RUN mkdir -p /out && (bash solidworks/build.sh && cp -r solidworks/dist/OpenSketch-SOLIDWORKS /out/) \
    || echo "SOLIDWORKS add-in not built: no download on this server"

# Python packages in a virtual environment of their own (copied whole into the runtime: same base image).
FROM ${PYTHON_IMAGE} AS cad-deps
ENV PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1
COPY apps/cad/requirements.txt /tmp/requirements.txt
RUN python -m venv /opt/cad/venv \
 && /opt/cad/venv/bin/pip install -q --require-hashes -r /tmp/requirements.txt

# ----------------------------------------------------------------------------------------------- runtime
# Everything but the website and work builds: enough to run the proxy and cad roles (local checks, CI smoke
# runs before the web and work servers exist).
FROM ${PYTHON_IMAGE} AS runtime-base

ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1 PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1 \
    NODE_ENV=production

# OpenCascade (build123d) needs these X/GL libraries even without a screen (its OCP module also links libexpat
# directly); libstdc++ is also node's.
RUN apt-get update -qq \
 && apt-get install -y -qq --no-install-recommends \
      libgl1 libglu1-mesa libxrender1 libxext6 libx11-6 libexpat1 libstdc++6 ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Node 22 from the official image (the sketch solver of cad, the proxy, web and work)
COPY --from=node /usr/local/bin/node /usr/local/bin/node
RUN node --version

# One unprivileged user per role; the entrypoint drops to it (setpriv, util-linux).
RUN set -eu; \
    for spec in bzproxy:10001 bzweb:10002 bzwork:10003 bzcad:10004; do \
      name="${spec%%:*}"; id="${spec##*:}"; \
      groupadd --system --gid "$id" "$name"; \
      useradd --system --uid "$id" --gid "$id" --home-dir "/home/$name" --create-home --shell /usr/sbin/nologin "$name"; \
      chmod 0700 "/home/$name"; \
    done; \
    mkdir -p /data /app

# cad: packages, the add-in download, then the code (owned by root, read-only to the service)
COPY --from=cad-deps /opt/cad/venv /opt/cad/venv
COPY --from=swaddin /out /tmp/swaddin
RUN mkdir -p /app/cad/opensketch/static/downloads \
 && if [ -d /tmp/swaddin/OpenSketch-SOLIDWORKS ]; then \
      cd /tmp/swaddin \
      && /opt/cad/venv/bin/python -m zipfile -c /app/cad/opensketch/static/downloads/OpenSketch-SOLIDWORKS.zip OpenSketch-SOLIDWORKS; \
    fi; rm -rf /tmp/swaddin
COPY apps/cad/opensketch /app/cad/opensketch
RUN cd /app/cad \
 && OPENSKETCH_DATA=/tmp/cad-import-check /opt/cad/venv/bin/python -c "import build123d, opensketch.server; print('CAD ready')" \
 && rm -rf /tmp/cad-import-check \
 && /opt/cad/venv/bin/python -m compileall -q /app/cad/opensketch
# which CADOS commit apps/cad is (scripts/sync-cad.mjs): the cad role reports it as its version (/healthz)
COPY apps/cad-source.json /app/cad/cad-source.json

# proxy, entrypoint, cad's holding page and the restore scripts (infrastructure/migrate, run with fly ssh console)
COPY infrastructure/proxy/package.json infrastructure/proxy/*.mjs /app/proxy/
COPY infrastructure/migrate /usr/local/lib/bizomat/migrate
COPY infrastructure/fly/cad-holding.py /usr/local/lib/bizomat/cad-holding.py
COPY infrastructure/fly/entrypoint.sh /usr/local/bin/bizomat-entrypoint
RUN chmod -R a+rX /app /usr/local/lib/bizomat \
 && chmod 0755 /usr/local/bin/bizomat-entrypoint \
 && find /usr/local/lib/bizomat -name '*.sh' -exec chmod 0755 {} +

EXPOSE 8080 8003 8002 8001
# Each Fly process group (and each compose service) runs `bizomat-entrypoint <role>`.
CMD ["/usr/local/bin/bizomat-entrypoint", "help"]

# ----------------------------------------------------------------------------------------------- final image
FROM runtime-base AS runtime
COPY --from=web-build /src/package.json /app/web/package.json
COPY --from=web-build /src/dist-server /app/web/dist-server
COPY --from=web-build /src/dist /app/web/dist
COPY --from=erp-preview /src/apps/work/dist/erp-design-preview /app/web/dist/erp-design-preview
COPY --from=work-build /src/apps/work/package.json /app/work/package.json
COPY --from=work-build /src/apps/work/migrations /app/work/migrations
COPY --from=work-build /src/apps/work/node_modules /app/work/node_modules
COPY --from=work-build /src/apps/work/dist /app/work/dist
RUN chmod -R a+rX /app/web /app/work
# the version last, so a new one (every deploy) changes no layer above
ARG BIZOMAT_VERSION=dev
ENV BIZOMAT_VERSION=${BIZOMAT_VERSION}
