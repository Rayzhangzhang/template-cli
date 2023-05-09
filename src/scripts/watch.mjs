import * as esbuild from 'esbuild';

const c = await esbuild.context({
  bundle: true,
  entryPoints: ['src/index.ts'],
  outfile: 'build/cli-local.cjs',
  format: 'cjs',
  platform: 'node',
  target: 'node14',
});

c.watch();
