"""Run OpenSketch: python -m opensketch [--port 8000] [--no-browser] [--supervise]"""

import argparse
import faulthandler
import signal
import sys
import threading
import webbrowser

import uvicorn


def main():
    ap = argparse.ArgumentParser(prog="opensketch")
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8000)
    ap.add_argument("--no-browser", action="store_true")
    ap.add_argument("--supervise", action="store_true",
                    help="run the server as a child process and restart it when it hangs or exits (hosting)")
    args = ap.parse_args()
    if args.supervise:
        from . import supervisor
        sys.exit(supervisor.main(args.host, args.port))
    if hasattr(signal, "SIGUSR1"):  # kill -USR1 <pid> prints every thread's stack (the supervisor does it before a restart)
        faulthandler.register(signal.SIGUSR1, all_threads=True)
    url = f"http://{args.host}:{args.port}/"
    if not args.no_browser:
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    print(f"OpenSketch running at {url}")
    uvicorn.run("opensketch.server:app", host=args.host, port=args.port, log_level="warning")


if __name__ == "__main__":
    main()
