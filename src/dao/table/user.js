const { QUERY_TYPE } = global.$CONSTANT;

module.exports = {
  name: 'user',
  mainKey: 'id',
  isLogicDelete: true,
  columns: [
    { id: 'id', queryType: QUERY_TYPE.exact },
    { id: 'username', queryType: QUERY_TYPE.head },
    { id: 'update_time', unInsert: true }
  ],
  orderKey: 'update_time'
};
