import * as fs from 'node:fs';
import * as path from 'node:path';

export function preOrderDirectoryTraverse(dir, dirCallback, fileCallback) {
  // readdirSync 读取文件夹内容
  for (const filename of fs.readdirSync(dir)) {
    if (filename === '.git') {
      continue;
    }
    const fullpath = path.resolve(dir, filename);
    if (fs.lstatSync(fullpath).isDirectory()) {
      dirCallback(fullpath);
      // in case the dirCallback removes the directory entirely
      if (fs.existsSync(fullpath)) {
        preOrderDirectoryTraverse(fullpath, dirCallback, fileCallback);
      }
      continue;
    }
    fileCallback(fullpath);
  }
}

export function postOrderDirectoryTraverse(dir, dirCallback, fileCallback) {
  for (const filename of fs.readdirSync(dir)) {
    if (filename === '.git') {
      continue;
    }
    const fullpath = path.resolve(dir, filename);
    // lstatSync 获取文件信息 不解析符号链接（statSync 解析）， 判断是否是文件夹
    if (fs.lstatSync(fullpath).isDirectory()) {
      postOrderDirectoryTraverse(fullpath, dirCallback, fileCallback);
      dirCallback(fullpath);
      continue;
    }
    fileCallback(fullpath);
  }
}
