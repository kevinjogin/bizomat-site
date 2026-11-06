# Security

OpenSketch signs people in, holds keys that let an AI app and the add-in act on someone's SOLIDWORKS, and accepts
file uploads, so security reports matter.

## Reporting

Please do not open a public issue for a security problem. Use GitHub's private reporting instead: the
repository's **Security** tab > **Report a vulnerability**. Include what you found, how to reproduce it, and what
it lets someone do. You will get an answer as soon as possible.

## Scope

In scope: the server (sign-in, OAuth for AI apps, the MCP endpoint, the add-in link, upload and download links),
the home page and the add-in.

If you run your own server, create the owner account as soon as it is reachable (until then only the setup page
answers, and the first person to use it becomes the owner), serve it over https, and keep the data folder private:
it holds account data and the secrets that sign keys and links. A forgotten owner password is reset on the server
itself: `python -m opensketch --reset-password EMAIL`.
