/**
 * @description 获取iconfont项目信息，包括接口返回和配置项
 * @lastModified 20190201
 */

import fetch from "node-fetch";
import * as _ from "lodash";
import { getConfig } from "./config";

class Options {
  url: string;
  params = {} as any;
}

const host = "http://www.iconfont.cn";

async function request(options = new Options()) {
  const { params, url } = options;
  const paramStr = _.map(params, (value, key) => `${key}=${value}`).join("&");
  const result = await fetch(host + url + "?" + paramStr);
  const json = await result.json();
  return json.data;
}

/** 获取iconfont项目具体信息的接口 */
export async function getProjectById(projectId: string) {
  const data = await request({
    url: "/open/project/detail.json",
    params: {
      pid: projectId
    }
  });

  if (!data) {
    throw Error("Please make sure you have the right project id");
  }

  if (!data.font) {
    throw Error(
      "Please make sure you have the access to the project " + projectId
    );
  }

  return data;
}

export function getProjectList() {
  const config = getConfig();
  const { projectList } = config;
  const resultList = projectList.map(async project => {
    const projectId = project.id;
    const item = await getProjectById(projectId);
    const currentConfig = config.getConfigById(projectId);

    // 直接修改icon对象数据
    item.icons.forEach(icon => {
      icon.code = Number(icon.unicode).toString(16);
      icon.fontName = icon.font_class;
      icon.svgName = `${currentConfig.uniqueId ? currentConfig.uniqueId + '_' : ''}icon_${icon.fontName.replace(/-/g, '_')}`;
    });
    return {
      eot: "https:" + item.font.eot_file,
      ttf: "https:" + item.font.ttf_file,
      svg: "https:" + item.font.svg_file,
      woff: "https:" + item.font.woff_file,
      jsFile: "https:" + item.font.js_file,
      familyName: item.project.font_family,
      name: item.project.name,
      icons: item.icons,
      ...currentConfig
    };
  });

  return resultList;
}
