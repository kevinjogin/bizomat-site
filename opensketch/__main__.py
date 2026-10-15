"""Run OpenSketch: python -m opensketch [--port 8000] [--no-browser]"""

import argparse
import threading
import webbrowser

import uvicorn


def main():
    ap = argparse.ArgumentParser(prog="opensketch")
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8000)
    ap.add_argument("--no-browser", action="store_true")
    args = ap.parse_args()
    url = f"http://{args.host}:{args.port}/"
    if not args.no_browser:
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    print(f"OpenSketch running at {url}")
    uvicorn.run("opensketch.server:app", host=args.host, port=args.port, log_level="warning")


if __name__ == "__main__":
    main()
