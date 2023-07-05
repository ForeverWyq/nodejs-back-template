const BaseResponse = require('../common/BaseResponse');
const file = require('../service/file');

const fileRoot = '/file';

module.exports = (router) => {
  router.setRoute('POST', `${fileRoot}/upload`, ({ res, files }) => {
    return BaseResponse.success(res, file.fileSave(files));
  }, 'form');
};
