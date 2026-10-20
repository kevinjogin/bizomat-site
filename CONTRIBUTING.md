# Contributing

Thanks for helping. Issues and pull requests are welcome.

## Reporting a problem

Open an issue with:

- what you asked the AI to do, and what happened instead;
- the `sw_selftest` report if the problem is with the add-in;
- the add-in log (`%LOCALAPPDATA%\OpenSketch\SolidWorks\log.txt`) and your SOLIDWORKS version.

Remove anything confidential from logs and screenshots first (file names, part names, customer details).

## Sending a change

1. Fork the repository and make a branch.
2. Set up: `pip install -r requirements-dev.txt && pip install --no-deps -e .` (Python 3.12, Node.js 20 or newer).
3. Make the change. Add or update tests for it.
4. Run `pytest -q` and `npm test`. For changes to the add-in, `bash solidworks/build.sh test` (.NET 8 SDK).
5. Open a pull request that says what changed and why.

## Guidelines

- The feature format ([docs/DOCUMENT.md](docs/DOCUMENT.md) and the registry in `opensketch/features/`) is the
  contract between the AI, the kernel and the add-in. Change it there first, then the kernel, then the add-in.
- Heavy CAD work runs in worker processes (`opensketch/cadworker.py`), never on the web server's event loop.
- Messages people see are plain English, short sentences, no emojis.
- Python dependencies are pinned with hashes in `requirements.txt` and `requirements-dev.txt`; change ranges in
  `pyproject.toml` and regenerate both (the command is in `pyproject.toml`).

By contributing, you agree that your contributions are licensed under the AGPL-3.0, like the rest of the project.
