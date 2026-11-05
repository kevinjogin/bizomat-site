"""Run the BIZOMAT CAD Automation server: python -m opensketch [--host 127.0.0.1] [--port 8000] [--no-browser] [--supervise]

--host :: listens on every address, IPv6 and IPv4 (one dual-stack socket; where the system cannot make one, an IPv6
socket and an IPv4 one; with no IPv6 at all, IPv4 only), so a proxy or the supervisor reaching 127.0.0.1 and a client
on ::1 or the network all get through. uvicorn's own X-Forwarded-* handling is off: proxy.py decides what to believe.
"""

import argparse
import faulthandler
import signal
import socket
import sys
import threading
import webbrowser

import uvicorn


def _bare(host: str) -> str:
    return (host or "").strip().strip("[]")


def listen_sockets(host: str, port: int) -> list[socket.socket] | None:
    """The sockets for --host :: (every address), or None to let uvicorn bind `host` itself. asyncio would make an
    IPv6-only socket for ::, which nothing on 127.0.0.1 (a proxy, the supervisor's health check) could reach."""
    if _bare(host) != "::":
        return None
    if socket.has_dualstack_ipv6():
        return [socket.create_server(("::", port), family=socket.AF_INET6, dualstack_ipv6=True, backlog=2048)]
    out = []
    try:
        s6 = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
    except OSError:  # no IPv6 on this system
        s6 = None
    if s6 is not None:
        try:
            if hasattr(socket, "IPPROTO_IPV6") and hasattr(socket, "IPV6_V6ONLY"):
                s6.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 1)
            if sys.platform != "win32":
                s6.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            s6.bind(("::", port))
            s6.listen(2048)
            port = s6.getsockname()[1]  # port 0: the IPv4 socket takes the same one
            out.append(s6)
        except OSError:
            s6.close()
    out.append(socket.create_server(("0.0.0.0", port), backlog=2048))
    return out


def display_url(host: str, port: int) -> str:
    """The address to print and open: this computer for a wildcard host, IPv6 literals in brackets."""
    h = _bare(host)
    if h in ("", "0.0.0.0", "::"):
        h = "127.0.0.1"
    return f"http://[{h}]:{port}/" if ":" in h else f"http://{h}:{port}/"


def main():
    ap = argparse.ArgumentParser(prog="opensketch")
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8000)
    ap.add_argument("--no-browser", action="store_true", help="do not open the home page in a web browser")
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
    url = display_url(args.host, args.port)
    sockets = listen_sockets(args.host, args.port)
    if not args.no_browser:
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    print(f"BIZOMAT CAD Automation running at {url}" + (" (every address)" if sockets else ""), flush=True)
    # on a stop, open connections (the add-in's long polls) get 3 s to finish instead of holding the restart up
    config = uvicorn.Config("opensketch.server:app", host=_bare(args.host) or "127.0.0.1", port=args.port, log_level="warning",
                            timeout_graceful_shutdown=3, proxy_headers=False)
    server = uvicorn.Server(config)
    try:
        server.run(sockets=sockets)
    except KeyboardInterrupt:
        pass
    if not server.started:
        sys.exit(3)  # uvicorn's own exit code when the server could not start


if __name__ == "__main__":
    main()
