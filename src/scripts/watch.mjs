import * as esbuild from 'esbuild';
import fsextra from 'fs-extra';
import gradient from 'gradient-string';

const watch = async () => {
  const c = await esbuild.context({
    bundle: true,
    entryPoints: ['src/index.ts'],
    outfile: 'build/cli.cjs',
    format: 'cjs',
    platform: 'node',
    target: 'node14',
  });

  fsextra.copySync('src/template', 'build/template');

  c.watch();
};

try {
  await fsextra.removeSync('build');
  await watch();
  console.log(process.stdout.isTTY && process.stdout.getColorDepth() > 8 ? gradient('cyan', 'pink')('on watching ~') : 'on watching ~');
} catch (e) {
  console.error(e);
  process.exit(1);
}
