#!/usr/bin/env bash
# Builds the add-in (OpenSketch.Sw.dll, the KEVOS add-in), KEVOS.Companion.exe and OpenSketchSW.exe (.NET Framework 4.8,
# against the SOLIDWORKS 2022 API with its types embedded) and puts them with the README and the launcher macro (the
# fallback) in dist/OpenSketch-SOLIDWORKS/, which the MSI (installer/) and the zip are made from.
# Runs on Linux or Windows with the .NET 8 SDK. Zipping is left to the caller (CI, the Dockerfile).
#
#   bash solidworks/build.sh            # build
#   bash solidworks/build.sh test       # also run the .NET tests
set -euo pipefail
cd "$(dirname "$0")"
export DOTNET_CLI_TELEMETRY_OPTOUT=1 DOTNET_NOLOGO=1
dotnet build src/App/OpenSketch.Sw.App.csproj -c Release -nologo -v quiet
dotnet build src/Companion/KEVOS.Companion.csproj -c Release -nologo -v quiet
out=src/App/bin/Release/net48
pkg=dist/OpenSketch-SOLIDWORKS
rm -rf dist
mkdir -p "$pkg"
cp "$out/OpenSketch.Sw.dll" "$out/OpenSketchSW.exe" "$out/OpenSketchSW.exe.config" "$pkg/"
cp src/Companion/bin/Release/net48/KEVOS.Companion.exe src/Companion/bin/Release/net48/KEVOS.Companion.exe.config "$pkg/"
cp package/README.txt package/OpenSketch.swb "$pkg/"
if [ "${1:-}" = "test" ]; then
  dotnet test tests/OpenSketch.Sw.Tests.csproj -nologo -v quiet
fi
echo "built $pkg"
