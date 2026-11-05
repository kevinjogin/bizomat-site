// A fake service for entrypoint.test.sh: reports who it runs as and the environment it was given, then exits.
// Only ever run with throwaway test values.
process.stdout.write(`${JSON.stringify({ uid: process.getuid(), gid: process.getgid(), groups: process.getgroups(), cwd: process.cwd(), env: process.env })}\n`);
