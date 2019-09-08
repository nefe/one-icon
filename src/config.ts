/**
 * @description  配置项获取
 * @lastModified 20190201
 */

import * as log from "./log";
import * as path from "path";
import * as fs from "fs";

const DEFAULT_CONFIG_FILE_PATH = path.join(
  process.cwd(),
  "oneicon-config.json"
);

interface Project {
  /** 项目id */
  id: string;
  /** css文件生成路径 */
  cssOutputPath?: string;
  /** js文件生成路径 */
  jsOutputPath?: string;
  /** icon代码模板的样式类 */
  classNameList?: string[];
  /** icon代码模板配置项 */
  iconCode?: string;
}

/** 配置项 */
class Config {
  projectList = [] as Project[];

  constructor(config: Config) {
    if (config.projectList) {
      this.projectList = config.projectList;
    }
  }

  getConfigById(id): Project {
    return this.projectList.filter(project => id === project.id)[0];
  }

  getProjectIdList(): string[] {
    return this.projectList.map(project => project.id);
  }
}

export function getConfig(configFilePath = DEFAULT_CONFIG_FILE_PATH): Config {
  /** 没有配置文件，使用默认配置 */
  if (!fs.existsSync(configFilePath)) {
    log.warn("Config file not exist, use the default config!");
    return new Config({} as Config);
  }

  const content = fs.readFileSync(configFilePath, "utf8");
  try {
    const json = JSON.parse(content);
    return new Config(json);
  } catch (e) {
    /** 配置文件出错，直接退出 */
    log.error(`Config file ${configFilePath} have the following mistake: `);
    throw Error(e);
  }
}
