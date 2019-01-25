import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as _ from 'lodash';
import * as log from './log';

function wait(timeout: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

class Config {
  cssOutputPath = 'src/styles/oneicon.scss';
  jsOutputPath = 'src/styles/oneicon.js';
  projectIdList = [];
  classNameList = [];
  iconCode = '<Icon type="one-icon icon-{fontName} {extraClasses}" />';

  constructor(config: Config) {
    config.cssOutputPath && (this.cssOutputPath = config.cssOutputPath);
    config.jsOutputPath && (this.jsOutputPath = config.jsOutputPath);
    config.projectIdList && (this.projectIdList = config.projectIdList);
    config.classNameList && (this.classNameList = config.classNameList);
    config.iconCode && (this.iconCode = config.iconCode);
  }

  getJsOutputPath() {
    return path.join(process.cwd(), this.jsOutputPath);
  }

  getCssOutputPath() {
    return path.join(process.cwd(), this.cssOutputPath);
  }
}

const DEFAULT_CONFIG_FILE_PATH = path.join(
  process.cwd(),
  'oneicon-config.json'
);

export function getConfig(configFilePath = DEFAULT_CONFIG_FILE_PATH): Config {
  /** 没有配置文件，使用默认配置 */
  if (!fs.existsSync(configFilePath)) {
    log.warn('Config file not exist, use the default config!');
    return new Config({} as Config);
  }

  const content = fs.readFileSync(configFilePath, 'utf8');
  try {
    const json = JSON.parse(content);
    return new Config(json);
  } catch (e) {
    /** 配置文件出错，直接退出 */
    log.error(`Config file ${configFilePath} have the following mistake: `);
    throw Error(e);
  }
}

export function generateAssets(outputPath, files) {
  return Promise.all(
    Object.keys(files).map(key => {
      return fileDownlaod(
        'http:' + files[key].slice(6),
        path.join(outputPath, '../', 'font.' + key)
      );
    })
  );
}

/** 生成CSS文件 */
export async function generateCssFile(outputPath, options) {
  const cssTemplate = fs.readFileSync(
    path.join(__dirname, '../template.scss'),
    'utf8'
  );
  const cssFileContent = _.template(cssTemplate)(options);

  try {
    fs.writeFileSync(outputPath, cssFileContent);
  } catch (e) {
    log.error('Failed in generating CSS file: ');
    throw Error(e);
  }
}

/** 下载JS文件 */
export async function generateJsFile(outputPath, options) {
  const { jsFile } = options;
  /** 确保配置了正确的路径 */
  try {
    fs.writeFileSync(outputPath, ' ');
  } catch (e) {
    log.error('Failed in generating JS file: ');
    throw Error(e);
  }

  download(jsFile, (err?) => {
    const tmpDir = 'src/styles/tmp';

    combineFiles(tmpDir, outputPath);
  });

  await wait(3000);
}

function fileDownlaod(url: string, outputPath: string) {
  const file = fs.createWriteStream(outputPath, {
    encoding: 'utf8'
  });

  return new Promise(resolve => {
    http.get(url, function(response) {
      response.pipe(file);

      response.on('end', () => {
        file.end();
        resolve();
      });
    });
  });
}

async function download(urls, cb) {
  const tmpDir = 'src/styles/tmp/';

  urls.map((url, i) => {
    if (!fs.existsSync(tmpDir)) {
      createFolder(`${tmpDir}${i}.js`);
    }
    const fileWriteStream = fs.createWriteStream(`${tmpDir}${i}.js`);
    http
      .get('http' + url.slice(5), function(response) {
        response.pipe(fileWriteStream);
        fileWriteStream.on('finish', function() {
          if (!i) {
            cb();
          }
        });
      })
      .on('error', function(err) {
        console.log(err);
      });
  });
}

/** 合并文件夹下的所有文件 */
function combineFiles(filePath, des) {
  fs.readdir(filePath, function(err, files) {
    if (err) {
      throw err;
    }

    let fileReadStream;
    let fileNum = files.length - 1;
    const fileWriteStream = fs.createWriteStream(des);

    createStramFile();

    function createStramFile() {
      const currentfile = filePath + '/' + files.shift();
      fileReadStream = fs.createReadStream(currentfile);
      fileReadStream.pipe(
        fileWriteStream,
        { end: false }
      );
      fileReadStream.on('end', function() {
        if (files.length) {
          fileWriteStream.write(';');
        } else {
          fileWriteStream.end(';');
          removeDir('src/styles/tmp');
          return;
        }
        createStramFile();
      });
      fileWriteStream.on('close', function() {
        if (!fileNum) {
          return;
        }
        fileNum--;
      });
    }
  });
}

/** 生成文件 */
function createFolder(to) {
  const sep = path.sep;
  const folders = path.dirname(to).split(sep);
  let p = '';

  while (folders.length) {
    p += folders.shift() + sep;
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
  }
}

function removeDir(dir) {
  let files = fs.readdirSync(dir);

  for (var i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i]);
    let stat = fs.statSync(newPath);

    if (stat.isDirectory()) {
      //如果是文件夹就递归下去
      removeDir(newPath);
    } else {
      //删除文件
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir);
}

const crypto = require('crypto');

// 加密，第三方使用，data是原始uuid，第三方自己随机生成，返回的crypted 是加密后的uuid，用来到iconfont授权
function aesEncrypt(data, key) {
  const cipher = crypto.createCipher('aes192', key);
  var crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

export function getUUID(data) {
  // key 目前统一约定为  iconfont
  const key = 'iconfont';
  return aesEncrypt(data, key);
}
