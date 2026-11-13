// configFromEnv(): the settings the Node runtime copies from its environment into the Worker's env. A setting the Worker
// reads but configFromEnv() leaves out never reaches the app on Fly, whatever secret is set (13 Nov 2026: ABR_GUID and
// BIZOMAT_ID_CLIENTS were declared in src/worker/env.ts but never set on Node).
import { describe, expect, it } from 'vitest';
import { configFromEnv } from '../src/node/config.ts';
import { silentLogger } from '../src/node/log.ts';
import { createRuntime } from '../src/node/runtime.ts';
import { readMigrationsDir } from '../src/node/store/migrations.ts';
import { abrConfigured } from '../src/worker/company/verify.ts';
import { idClients } from '../src/worker/company/id-provider.ts';
import { tempDir } from './helpers.ts';

// Throwaway values: what the entrypoint hands the work role (infrastructure/fly/entrypoint.sh).
const BASE = { ENVIRONMENT: 'test', APP_URL: 'https://example.test/tasks' };
const CLIENTS = JSON.stringify([{ id: 'cad', name: 'CAD Automation', secretSha256: '0'.repeat(64), redirectUris: ['https://example.test/cad/auth/bizomat/callback'] }]);
// A data folder (also the static folder: no pages are served here) for each runtime; removed after the file.
const folders = () => {
  const dir = tempDir('work-config-');
  return { WORK_DATA_DIR: dir, WORK_STATIC_DIR: dir };
};
const FOLDERS_ON = folders();
const FOLDERS_OFF = folders();

describe('configFromEnv: company account settings', () => {
  it('passes ABR_GUID and BIZOMAT_ID_CLIENTS through to the Worker, trimmed', () => {
    const { vars } = configFromEnv({ ...BASE, ABR_GUID: '  throwaway-abr-guid\n', BIZOMAT_ID_CLIENTS: `${CLIENTS}\n` }, '/');
    expect(vars.ABR_GUID).toBe('throwaway-abr-guid');
    expect(vars.BIZOMAT_ID_CLIENTS).toBe(CLIENTS);
  });

  it('leaves them out when unset or blank', () => {
    const unset = configFromEnv({ ...BASE }, '/').vars;
    expect('ABR_GUID' in unset).toBe(false);
    expect('BIZOMAT_ID_CLIENTS' in unset).toBe(false);
    const blank = configFromEnv({ ...BASE, ABR_GUID: ' ', BIZOMAT_ID_CLIENTS: '' }, '/').vars;
    expect('ABR_GUID' in blank).toBe(false);
    expect('BIZOMAT_ID_CLIENTS' in blank).toBe(false);
  });

  it('reads only the app names: the Fly secrets WORK_ABR_GUID and WORK_BIZOMAT_ID_CLIENTS are renamed by the entrypoint', () => {
    const { vars } = configFromEnv({ ...BASE, WORK_ABR_GUID: 'throwaway-abr-guid', WORK_BIZOMAT_ID_CLIENTS: CLIENTS }, '/');
    expect(vars.ABR_GUID).toBeUndefined();
    expect(vars.BIZOMAT_ID_CLIENTS).toBeUndefined();
  });

  it('reaches the Worker env on Node: the register lookup is on and the sign-in client is known', () => {
    const options = { migrations: readMigrationsDir('migrations'), log: silentLogger };
    const on = configFromEnv({ ...BASE, ABR_GUID: 'throwaway-abr-guid', BIZOMAT_ID_CLIENTS: CLIENTS, ...FOLDERS_ON }, '/');
    let rt = createRuntime(on, options);
    try {
      expect(rt.env.ABR_GUID).toBe('throwaway-abr-guid');
      expect(abrConfigured(rt.env)).toBe(true);
      expect(idClients(rt.env).map((c) => c.id)).toEqual(['cad']);
    } finally {
      rt.close();
    }
    const off = configFromEnv({ ...BASE, ...FOLDERS_OFF }, '/');
    rt = createRuntime(off, options);
    try {
      expect(abrConfigured(rt.env)).toBe(false);
      expect(idClients(rt.env)).toEqual([]);
    } finally {
      rt.close();
    }
  });
});
