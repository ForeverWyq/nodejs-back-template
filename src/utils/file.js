const path = require('path');
const fs = require('fs');

/**
 * 遍历文件夹
 * @param {string} pathStr 要遍历的路径
 * @param {Function} callback 回调函数，每次取到文件/目录就回调
 * @param {string} type 获取类型 f 文件 d 目录, 默认文件
 */
function readDirSync(pathStr, callback, type = 'f') {
  const dir = fs.readdirSync(pathStr);
  dir.forEach((name) => {
    const realPath = pathStr + '/' + name;
    const info = fs.statSync(realPath);
    if (info.isDirectory()) {
      readDirSync(realPath, callback, type);
      type === 'd' && callback && callback(name, pathStr + '/');
    } else {
      type === 'f' && callback && callback(name, pathStr + '/');
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

/**
 * 遍历查找路径的存在性，不存在则创建
 * @param {string} pathStr 路径
 * @returns {string} 全路径
 */
function mkdirPath(pathStr) {
  let projectPath = path.join(process.cwd());
  const tempDirArray = pathStr.split('\\');
  for (let i = 0; i < tempDirArray.length; i++) {
    projectPath = projectPath + '/' + tempDirArray[i];
    if (fs.existsSync(projectPath)) {
      const tempStat = fs.statSync(projectPath);
      if (!tempStat.isDirectory()) {
        fs.unlinkSync(projectPath);
        fs.mkdirSync(projectPath);
      }
    } else {
      fs.mkdirSync(projectPath);
    }
  }
  return projectPath;
}

module.exports = {
  readDirSync,
  importAll,
  mkdirPath
};
