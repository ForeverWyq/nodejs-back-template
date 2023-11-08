const { QUERY_TYPE } = global.$CONSTANT;

module.exports = {
  name: 'user',
  mainKey: 'id',
  isLogicDelete: true,
  columns: [
    { id: 'id', queryType: QUERY_TYPE.exact },
    { id: 'username', queryType: QUERY_TYPE.head },
    { id: 'userAccount', queryType: QUERY_TYPE.exact },
    { id: 'userPassword', queryType: QUERY_TYPE.exact },
    { id: 'updateTime', unInsert: true }
  ],
  orderKey: {
    field: 'updateTime',
    type: 'desc'
  }
};
