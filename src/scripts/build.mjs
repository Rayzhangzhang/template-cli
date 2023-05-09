import * as esbuild from 'esbuild';
import fsextra from 'fs-extra';

const build = async () => {
  await esbuild.build({
    bundle: true,
    entryPoints: ['src/index.ts'],
    outfile: 'build/cli.cjs',
    format: 'cjs',
    platform: 'node',
    target: 'node14',
  });

  fsextra.copySync('src/template', 'build/template');
};

try {
  await build();
} catch (e) {
  console.error(e);
  process.exit(1);
}
