import fetch from "node-fetch";
import _ = require("lodash");
import * as fs from "fs";
import * as path from "path";
import * as log from "./log";

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

export async function getProjectDetail(pids: string[]) {
  const result = [];
  const icons = [];

  for (let i = 0; i < pids.length; i++) {
    const data = await request({
      url: "/open/project/detail.json",
      params: {
        pid: pids[i]
      }
    });

    if (!data) {
      throw Error("Please make sure you have the right project id");
    }

    if (!data.font) {
      throw Error(
        "Please make sure you have the access to the project " + pids[i]
      );
    }

    const icon: Array<{ name: string; fontName: string }> = data.icons.map(
      icon => {
        return {
          name: icon.name,
          code: Number(icon.unicode).toString(16),
          fontName: icon.font_class
        };
      }
    );

    icons.push(icon);
    result.push(data);
  }

  const eot = result.map(item => 'https:' + item.font.eot_file);
  const svg = result.map(item => 'https:' + item.font.svg_file);
  const woff = result.map(item => 'https:' + item.font.woff_file);
  const ttf = result.map(item => 'https:' + item.font.ttf_file);
  const cssFile = result.map(item => 'https:' + item.font.css_file);
  const jsFile = result.map(item => 'https:' + item.font.js_file);

  return {
    icons: _.flatten(icons),
    eot,
    ttf,
    svg,
    woff,
    cssFile,
    jsFile
  };
}
