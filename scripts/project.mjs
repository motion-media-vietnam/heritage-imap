/** Agent tooling: use bundled Node without requiring system-wide npm. */
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const command = process.argv[2] ?? 'setup';
const commands = {
  check: ['astro', 'check'], test: ['node', '--experimental-strip-types', '--test', 'tests/*.test.ts'],
  build: ['astro', 'build'], dev: ['astro', 'dev', '--background'],
  'dev:status': ['astro', 'dev', 'status'], 'dev:logs': ['astro', 'dev', 'logs'], 'dev:stop': ['astro', 'dev', 'stop'],
};
if (command !== 'setup' && !Object.hasOwn(commands, command)) throw new Error(`Choose setup, ${Object.keys(commands).join(', ')}.`);
if (process.argv.length > 3) throw new Error('Pass only the command name.');
const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 22 || (major === 22 && minor < 12)) throw new Error('Node >=22.12 is required; the agent must install a supported runtime.');

function run(executable, args) {
  return new Promise((done, reject) => {
    const child = spawn(executable, args, { cwd: root, stdio: 'inherit', windowsHide: true,
      env: { ...process.env, PATH: `${dirname(process.execPath)}${process.platform === 'win32' ? ';' : ':'}${process.env.PATH ?? ''}` } });
    child.once('error', reject);
    child.once('exit', (code, signal) => code === 0 ? done() : reject(new Error(`Command failed (${signal ?? code}).`)));
  });
}

async function npmCli() {
  const local = join(root, '.tools', 'npm', 'bin', 'npm-cli.js');
  let cli = [local, join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    join(dirname(process.execPath), '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js')].find(existsSync);
  if (!cli) {
    // npm 11 also supports this project's minimum Node 22.12 runtime.
    const response = await fetch('https://registry.npmjs.org/npm/11.6.2');
    if (!response.ok) throw new Error(`npm metadata download failed (${response.status}).`);
    const metadata = await response.json();
    const url = new URL(metadata.dist.tarball);
    if (url.protocol !== 'https:' || url.hostname !== 'registry.npmjs.org') throw new Error('Unexpected npm download source.');
    const archiveResponse = await fetch(url);
    if (!archiveResponse.ok) throw new Error(`npm download failed (${archiveResponse.status}).`);
    const bytes = Buffer.from(await archiveResponse.arrayBuffer());
    const integrity = `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
    if (integrity !== metadata.dist.integrity) throw new Error('npm archive integrity verification failed.');
    mkdirSync(join(root, '.tools', 'npm'), { recursive: true });
    const archive = join(root, '.tools', 'npm.tgz');
    writeFileSync(archive, bytes);
    await run('tar', ['-xzf', archive, '-C', join(root, '.tools', 'npm'), '--strip-components=1']);
    cli = local;
  }
  // The native Sites helpers invoke npm by name; expose a checkout-local launcher.
  const bin = join(root, '.tools', 'bin');
  mkdirSync(bin, { recursive: true });
  if (process.platform === 'win32') writeFileSync(join(bin, 'npm.cmd'), `@echo off\r\n"${process.execPath}" "${cli}" %*\r\n`);
  else writeFileSync(join(bin, 'npm'), `#!/bin/sh\nexec '${process.execPath.replaceAll("'", "'\\''")}' '${cli.replaceAll("'", "'\\''")}' "$@"\n`, { mode: 0o755 });
  return cli;
}

const fingerprint = createHash('sha256')
  .update(readFileSync('package.json', 'utf8').replaceAll('\r\n', '\n'))
  .update(readFileSync('package-lock.json', 'utf8').replaceAll('\r\n', '\n')).digest('hex');
const stamp = join(root, '.tools', 'dependency-inputs.sha256');
const ready = existsSync('node_modules/astro/package.json') && existsSync(stamp) && readFileSync(stamp, 'utf8') === fingerprint;
if (command === 'setup') {
  const cli = await npmCli();
  await run(process.execPath, [cli, 'ci', '--no-fund', '--no-audit']);
  writeFileSync(stamp, fingerprint);
}
else if (!ready) throw new Error('Dependencies need setup. The agent must run: node scripts/project.mjs setup');
if (command !== 'setup') {
  const [tool, ...args] = commands[command];
  const astroPackage = JSON.parse(readFileSync(join(root, 'node_modules', 'astro', 'package.json'), 'utf8'));
  const astroBin = typeof astroPackage.bin === 'string' ? astroPackage.bin : astroPackage.bin.astro;
  await run(process.execPath, tool === 'astro' ? [join(root, 'node_modules', 'astro', astroBin), ...args] : args);
}
