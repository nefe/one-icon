/**
 * @description 生成svg icon入口文件
 * @lastModified 2020-01-16
 * @author linfeng
 */
import { generateSvgFile } from "./generateFile";
import * as log from "./log";
import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";
import { getUUID } from "./uuid";
import { getProjectList } from "./data";
import { getConfig } from "./config";
const express = require("express");

const projectList = getProjectList();

async function generateFiles() {
  try {
    await generateSvgFile(projectList);
  } catch (e) {
    log.error(e);
    throw Error(e);
  }
}

/** 生成本地的页面，用于显示、复制代码、自动更新等 */
async function createServer() {
  var app = express();
  const template = fs.readFileSync(
    path.join(__dirname, "../template.html"),
    "utf8"
  );

  const randomString = "OneIcon" + Math.random();
  const uuid = getUUID(randomString);
  const content = _.template(template)({
    uuid,
    projectList: JSON.stringify(getConfig().projectList)
  });

  app.get("/", (req, res) => res.send(content));
  app.listen(3000, () =>
    log.warn("icon文档启动成功！请前往http://127.0.0.1:3000查看")
  );
  /** 自动更新文件 */
  app.use("/regenerateFile", function (req, res, next) {
    log.warn("---------正在加载最新数据--------------");
    generateFiles();
  });
}

async function main() {
  await generateFiles();
  await createServer();
}

main();
