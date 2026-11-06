"""Run the CAD Automation server: python -m opensketch [--port 8000] [--no-browser] [--supervise]

Recovery, run on the server itself (on Fly: fly ssh console -a cados -C "python -m opensketch --reset-password EMAIL"):
--reset-password EMAIL gives that account a new strong password, prints it once and signs the account out everywhere.
Whoever can run commands on the server can already read its data, so this needs no other password. It writes the
account files from a second process: run it while nobody is signing up or being changed on the Admin page.

--host :: listens on every address, IPv6 and IPv4 (one dual-stack socket; where the system cannot make one, an IPv6
socket and an IPv4 one; with no IPv6 at all, IPv4 only). On Fly the BIZOMAT router reaches this app over the private
network, which is IPv6 (cados.internal), while Fly's own proxy and the supervisor's check come in over IPv4."""

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
    IPv6-only socket for ::, which nothing on 127.0.0.1 (Fly's proxy, the supervisor's health check) could reach."""
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
    ap.add_argument("--reset-password", metavar="EMAIL", help="give this account a new password and print it (recovery)")
    args = ap.parse_args()
    if args.reset_password:
        sys.exit(reset_password(args.reset_password))
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
    print(f"CAD Automation running at {url}" + (" (every address)" if sockets else ""), flush=True)
    # on a stop, open connections (the add-in's long polls) get 3 s to finish instead of holding the restart up
    config = uvicorn.Config("opensketch.server:app", host=_bare(args.host) or "127.0.0.1", port=args.port,
                            log_level="warning", timeout_graceful_shutdown=3)
    server = uvicorn.Server(config)
    try:
        server.run(sockets=sockets)
    except KeyboardInterrupt:
        pass
    if not server.started:
        sys.exit(3)  # uvicorn's own exit code when the server could not start


def reset_password(email: str) -> int:
    from . import accounts, auth
    u = accounts.find_by_email(email)
    if u is None:
        print(f"No account has the email {email.strip().lower()}.", file=sys.stderr)
        return 1
    new = auth.suggest_password()
    accounts.set_password(u["id"], new, by="owner")
    print(f"New password for {u['email']}: {new}")
    print("Sign in with it, then choose your own in Settings. Every earlier sign-in of this account has ended.")
    return 0


if __name__ == "__main__":
    main()
