import * as esbuild from 'esbuild';

await esbuild.build({
  bundle: true,
  entryPoints: ['src/index.ts'],
  outfile: 'build/cli.cjs',
  format: 'cjs',
  platform: 'node',
  target: 'node14',
});
