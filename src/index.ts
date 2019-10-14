/**
 * @description 入口文件
 * @lastModified 20190201
 */
import { generateCssFile, generateJsFile } from './generateFile';
import * as log from './log';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import { getUUID } from './uuid';
import { getProjectList } from './data';
import { getConfig } from './config';
const express = require('express');

/** 是否是私有云发布，是的话把cdn的资源下载到本地 */
const envType = process.argv[2];
const isPrivateEnv = envType === 'private';
const projectList = getProjectList();

async function generateFiles() {
  try {
    log.info('开始生成CSS文件...');
    await generateCssFile(projectList, isPrivateEnv);
    console.log('-------------------');
    log.info('开始生成JS文件...');
    await generateJsFile(projectList);
  } catch (e) {
    log.error(e);
    throw Error(e);
  }
}

/** 生成本地的页面，用于显示、复制代码、自动更新等 */
async function createServer() {
  var app = express();
  const template = fs.readFileSync(
    path.join(__dirname, '../template.html'),
    'utf8'
  );

  const randomString = 'OneIcon' + Math.random();
  const uuid = getUUID(randomString);
  const content = _.template(template)({
    uuid,
    projectList: JSON.stringify(getConfig().projectList)
  });

  app.get('/', (req, res) => res.send(content));
  app.listen(3000, () =>
    log.warn('icon文档启动成功！请前往http://127.0.0.1:3000查看')
  );
  /** 自动更新文件 */
  app.use('/regenerateFile', function (req, res, next) {
    log.warn('---------正在加载最新数据--------------');
    generateFiles();
  });
}

async function main() {
  // 打包专有云的特殊处理
  if (isPrivateEnv) {
    try {
      await generateFiles();
      process.exit(0);
    } catch (e) {
      log.error(e);
      process.exit(1);
    }
    return;
  } else {
    await generateFiles();
    await createServer();
  }
}

main();
