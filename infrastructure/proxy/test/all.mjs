// `node --test infrastructure/proxy` runs this file (package.json "main"): every test file in one process.
// CI runs the files in parallel instead: node --test 'infrastructure/proxy/test/*.test.mjs'.
await import('./routes.test.mjs');
await import('./headers.test.mjs');
await import('./upstreams.test.mjs');
await import('./proxy.test.mjs');
await import('./longpoll.test.mjs'); // its 25 s poll starts on load and overlaps the tests above
