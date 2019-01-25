/**
 * @file 入口文件
 * @lastModified 20180524
 */
import {
  getConfig,
  generateCssFile,
  generateJsFile,
  getUUID,
  generateAssets
} from './utils';
import { getProjectDetail } from './API';
import * as log from './log';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
const express = require('express');

const config = getConfig();
const { projectIdList, classNameList, iconCode } = config;

const envType = process.argv[2];

async function generateFiles() {
  try {
    const detail = await getProjectDetail(projectIdList);
    const { eot, ttf, svg, woff, icons, jsFile } = detail;

    if (envType === 'private') {
      /** 生成CSS文件 */
      const cssOutputPath = config.getCssOutputPath();
      await generateCssFile(cssOutputPath, {
        icons,
        eot: ['./font.eot'],
        ttf: ['./font.ttf'],
        svg: ['./font.svg'],
        woff: ['./font.woff'],
        classNameList
      });
      try {
        await generateAssets(cssOutputPath, {
          eot: eot[0],
          ttf: ttf[0],
          svg: svg[0],
          woff: woff[0]
        });
      } catch (e) {
        log.error("Failed in generating files: ");
        throw Error(e);
      }
      // 生成资源文件
      log.info(cssOutputPath + '文件生成成功！');

      /** 生成JS文件 */
      const jsOutputPath = config.getJsOutputPath();
      await generateJsFile(jsOutputPath, { jsFile });
      log.info(jsOutputPath + '文件生成成功！');
    } else {
      /** 生成CSS文件 */
      const cssOutputPath = config.getCssOutputPath();

      await generateCssFile(cssOutputPath, {
        icons,
        eot,
        ttf,
        svg,
        woff,
        classNameList
      });
      log.info(cssOutputPath + '文件生成成功！');
      /** 生成JS文件 */
      const jsOutputPath = config.getJsOutputPath();
      await generateJsFile(jsOutputPath, { jsFile });
      log.info(jsOutputPath + '文件生成成功！');
    }
  } catch (e) {
    log.error(e);
    throw Error(e);
  }
}

async function createServer() {
  var app = express();
  const template = fs.readFileSync(
    path.join(__dirname, '../template.html'),
    'utf8'
  );

  const randomString = 'OneIcon' + Math.random();
  const uuid = getUUID(randomString);
  const content = _.template(template)({
    projectIdList,
    classNameList,
    uuid,
    iconCode
  });

  app.get('/', (req, res) => res.send(content));
  app.listen(3000, () =>
    log.info('icon文档启动成功！请前往http://127.0.0.1:3000查看')
  );
  app.use('/regenerateFile', function(req, res, next) {
    log.warn('---------正在加载最新数据--------------');
    generateFiles();
  });
}

async function main() {
  if (envType === 'private') {
    try {
      await generateFiles();
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
    return;
  } else {
    await generateFiles();
    await createServer();
  }
}

main();
