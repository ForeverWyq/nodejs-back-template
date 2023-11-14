const file = require('../service/file');

const fileRoot = '/file';

module.exports = (router) => {
  router.setRoute('POST', `${fileRoot}/upload`, ({ baseResponse, files }) => {
    return baseResponse.success(file.fileSave(files));
  }, 'form');
};
