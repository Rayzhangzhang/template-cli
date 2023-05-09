#!/usr/bin/env node

import { input, select, confirm } from '@inquirer/prompts';
import fs from 'node:fs';
import path from 'node:path';
import gradient from 'gradient-string';
import minimist from 'minimist';
import { red } from 'picocolors';
import { postOrderDirectoryTraverse } from './utils/directoryTraverse';
import renderTemplate from './utils/renderTemplate';

type Formatter = 'rome' | 'prettier' | 'null';
type GenerationTools = 'vite' | 'webpack5';
type Framework = 'react16' | 'react18' | 'vue2' | 'vue3';

function canSkipEmptying(dir: string) {
  if (!fs.existsSync(dir)) {
    return true;
  }
  // TODO readdirSync ？
  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    return true;
  }
  if (files.length === 1 && files[0] === '.git') {
    return true;
  }

  return false;
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  postOrderDirectoryTraverse(
    dir,
    (dir) => fs.rmdirSync(dir),
    // TODO unlinkSync ?
    (file) => fs.unlinkSync(file),
  );
}

const banner = '创建 template ～ ～ ～';

const init = async () => {
  console.log();
  console.log(process.stdout.isTTY && process.stdout.getColorDepth() > 8 ? gradient('cyan', 'pink')(banner) : banner);
  console.log();

  const argv = minimist(process.argv.slice(2), {
    // all arguments are treated as booleans
    boolean: true,
  });

  // 目标文件夹 默认为当前文件夹的 my-project, 可通过命令行输入, default 时默认是当前文件夹下的my-project
  let targetDir = argv.default ? argv._[0] || 'my-project' : argv._[0];

  // 强制覆盖 --force
  const forceOverwrite = argv.force;

  let result: Partial<{
    projectName: string;
    isRewrite: boolean;
    framework: Framework;
    generationTools: GenerationTools;
    codeFormatter: Formatter;
    needsEslint: boolean;
  }> = {};
  try {
    const projectName = !targetDir
      ? await input({
          message: 'Project name:',
          default: 'my-project',
        }).then((name) => (targetDir = name))
      : targetDir;

    if (!(forceOverwrite || canSkipEmptying(targetDir))) {
      const dirForPrompt = targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`;
      const isRewrite = await confirm({
        message: `${dirForPrompt} is not empty. Remove existing files and continue?`,
        default: false,
      });
      // 文件夹存在，冲突退出
      if (!isRewrite) {
        throw new Error(red('✖') + ' Operation cancelled');
      }
    }

    // 默认模板 --default
    if (argv.default) {
      console.log('走默认模板～');
      result = {
        projectName: targetDir,
        isRewrite: true,
        framework: 'react18',
        generationTools: 'vite',
        codeFormatter: 'rome',
        needsEslint: true,
      };
    } else {
      result = {
        projectName,
        isRewrite: true,
        framework: (await select({
          message: 'framework:',
          choices: [
            { name: 'react18', value: 'react18' },
            { name: 'react16', value: 'react16' },
            {
              name: 'vue3',
              value: 'vue3',
            },
            {
              name: 'vue2',
              value: 'vue2',
            },
          ],
        })) as Framework,
        generationTools: (await select({
          message: 'generation tools:',
          choices: [
            { name: 'vite', value: 'vite' },
            { name: 'webpack5', value: 'webpack5' },
          ],
        })) as GenerationTools,
        codeFormatter: (await select({
          message: 'code formatter:',
          choices: [
            { name: 'rome', value: 'rome' },
            { name: 'prettier', value: 'prettier' },
            { name: 'no need', value: 'null' },
          ],
        })) as Formatter,
        needsEslint: await confirm({
          message: 'needs eslint ?',
        }),
      };
    }
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }

  console.log(result);

  const { isRewrite, projectName, framework, generationTools, codeFormatter, needsEslint } = result;

  const cwd = process.cwd();
  const root = path.join(cwd, targetDir);
  console.log(root);

  if (fs.existsSync(root) && isRewrite) {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  console.log(`\nScaffolding project in ${root}...`);

  const pkg = { name: projectName, version: '0.0.0' };
  fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2));

  const templateRoot = path.resolve(__dirname, 'template');
  const render = function render(templateName) {
    const templateDir = path.resolve(templateRoot, templateName);
    renderTemplate(templateDir, root);
  };
  // Render base template
  render('base');

  if (codeFormatter === 'rome') {
    render('codeFormatter/rome');
  } else if (codeFormatter === 'prettier') {
    render('codeFormatter/prettier');
  }
};

init().catch((e) => {
  console.error(e);
});
