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
    from .cadworker import oom_score
    oom_score(-500)  # out of memory: the kernel takes a CAD worker or job first, not the server everyone uses
    url = f"http://{args.host}:{args.port}/"
    if not args.no_browser:
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    print(f"OpenSketch running at {url}")
    # on a stop, open connections (long polls, AI streams) get 3 s to finish instead of holding the restart up
    uvicorn.run("opensketch.server:app", host=args.host, port=args.port, log_level="warning", timeout_graceful_shutdown=3)


if __name__ == "__main__":
    main()
