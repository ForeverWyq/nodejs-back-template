const fs = require('fs');

/**
 * 遍历文件夹
 * @param {string} path 要遍历的路径
 * @param {Function} callback 回调函数，每次取到文件/目录就回调
 * @param {string} type 获取类型 f 文件 d 目录, 默认文件
 */
function readDirSync(path, callback, type = 'f') {
  const dir = fs.readdirSync(path);
  dir.forEach(name => {
    const realPath = path + '/' + name;
    const info = fs.statSync(realPath);
    if (info.isDirectory()) {
      readDirSync(realPath);
      type === 'd' && callback && callback(name, path + '/');
    } else {
      type === 'f' && callback && callback(name, path + '/');
    }
  });
}

const recursionAdd = (item, fileList, value) => {
  const fileArr = JSON.parse(JSON.stringify(fileList));
  if (fileArr.length > 1) {
    if (!item[fileArr[0]]) {
      item[fileArr[0]] = {};
    }
    const map = item[fileArr[0]];
    fileArr.shift();
    recursionAdd(map, fileArr, value);
  } else {
    item[fileArr[0]] = value;
  }
};
const importAll = (context) => {
  const map = {};
  context.keys().forEach((key) => {
    const keyFile = key.replace(/\.js$/g, '').replace(/\.\//g, '');
    const fileArr = keyFile.split('/');
    recursionAdd(map, fileArr, context(key));
  });
  return map;
};

module.exports = {
  readDirSync,
  importAll
};
