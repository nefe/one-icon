/**
 * @author 聆一
 * @description 生成用来免登陆的uuid，用在template.html中
 */
const crypto = require("crypto");

// 加密，第三方使用，data是原始uuid，第三方自己随机生成，返回的crypted 是加密后的uuid，用来到iconfont授权
function aesEncrypt(data, key) {
  const cipher = crypto.createCipher("aes192", key);
  var crypted = cipher.update(data, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

export function getUUID(data) {
  // key 目前统一约定为  iconfont
  const key = "iconfont";
  return aesEncrypt(data, key);
}
