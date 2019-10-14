/**
 * @description  核心业务逻辑
 * @lastModified 20190201
 */

import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as _ from 'lodash';
import * as log from './log';

/** 下载文件到本地资源，为了私有化部署 */
function fileDownload(url: string, outputPath: string) {
  const file = fs.createWriteStream(outputPath, {
    encoding: 'utf8'
  });

  return new Promise(resolve => {
    http.get(url, function (response) {
      response.pipe(file);

      response.on('end', () => {
        file.end();
        resolve();
      });
    });
  });
}

/** 私有化打包的考虑，将cdn资源下载到本地 */
export function generateAssets(outputPath, files, name: string) {
  return Promise.all(
    Object.keys(files).map(key => {
      return fileDownlaod(
        'http:' + files[key].slice(6),
        path.join(outputPath, name + '-font.' + key)
      );
    })
  );
}

function fileDownlaod(url: string, outputPath: string) {
  const file = fs.createWriteStream(outputPath, {
    encoding: 'utf8'
  });

  return new Promise(resolve => {
    http.get(url, function (response) {
      response.pipe(file);

      response.on('end', () => {
        file.end();
        resolve();
      });
    });
  });
}

/** 生成CSS文件 */
export async function generateCssFile(projectList, isPrivateEnv: boolean) {
  const cssTemplate = fs.readFileSync(
    path.join(__dirname, '../template.scss'),
    'utf8'
  );

  const promises = projectList.map((project) => {
    return project.then(async item => {
      if (!item.cssOutputPath) {
        return;
      }
      processFolderPath(item.cssOutputPath);

      if (isPrivateEnv) {
        console.log('private env');
        try {
          const assetsMap = {
            eot: item.eot,
            ttf: item.ttf,
            svg: item.svg,
            woff: item.woff
          };
          // todo，路径要做适配性。
          const cssFileContent = _.template(cssTemplate)({
            classNameList: [],
            ...item,
            eot: `../../assets/fonts/${item.name}-font.eot`,
            ttf: `../../assets/fonts/${item.name}-font.ttf`,
            svg: `../../assets/fonts/${item.name}-font.svg`,
            woff: `../../assets/fonts/${item.name}-font.woff`
          });

          try {
            fs.writeFileSync(item.cssOutputPath, cssFileContent);
          } catch (e) {
            log.error('Failed in generating CSS file: ');
            throw Error(e);
          }

          const dirname = path.join(process.cwd(), 'src/assets/fonts');
          if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
          }
          await generateAssets(dirname, assetsMap, item.name);
          log.info(`${item.name}项目CSS生成成功！`);
          return;
        } catch (e) {
          log.error('Failed in generating files: ');
          throw Error(e);
        }
      }

      const cssFileContent = _.template(cssTemplate)({ classNameList: [], ...item });

      try {
        fs.writeFileSync(item.cssOutputPath, cssFileContent);
        log.info(`${item.name}项目CSS生成成功！`);
      } catch (e) {
        log.error('Failed in generating CSS file: ');
        throw Error(e);
      }
    });
  });

  return Promise.all(promises);
}

/** 下载JS文件 */
export async function generateJsFile(projectList) {
  projectList.forEach((project, i) => {
    project.then(async item => {
      // 配置项提供了jsOutputPath，才支持下载JS文件
      if (!item.jsOutputPath) {
        return;
      }
      /** 确保配置了正确的路径 */
      processFolderPath(item.jsOutputPath);

      const jsTemplate = fs.readFileSync(
        path.join(__dirname, '../template.js'),
        'utf8'
      );
      const jsFileContent = _.template(jsTemplate)({ uniqueId: '', ...item });

      try {
        fs.writeFileSync(item.jsOutputPath, jsFileContent);
      } catch (e) {
        log.error('Failed in generating JS file: ');
        throw Error(e);
      }
      // await fileDownload('http:' + item.jsFile.slice(6), item.jsOutputPath);
      log.info(`${item.name}项目JS生成成功！`);
    });
  });
}


/** 从文件完整路径中获取文件夹路径，比如a/b.ts -> a */
function getFolderPath(filePath: string) {
  const list = filePath.split('/');
  list.pop();
  return list.join('/');
}

/** 提前判断，确保路径存在，能成功写入 */
function processFolderPath(filePath: string) {
  try {
    fs.writeFileSync(filePath, ' ');
  } catch (e) {
    fs.mkdirSync(getFolderPath(filePath), { recursive: true });
  }
}