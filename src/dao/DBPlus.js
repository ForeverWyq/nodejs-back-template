const _ = require('lodash');
const sqlCreate = require('@/utils/sql');
const dbPlusConfig = global.$config.dbPlusConfig || {};

class DBPlus {
  constructor(db, table) {
    const { name, columns, mainKey, isLogicDelete } = table;
    this.db = db;
    this.tableName = name;
    this.tableColumns = columns;
    this.mainKey = mainKey;
    const hasDelField = !!dbPlusConfig.logicDeleteField;
    this.isLogicDelete = _.isNil(isLogicDelete) ? hasDelField : (isLogicDelete && hasDelField);
    this.logicField = { id: dbPlusConfig.logicDeleteField, logicDeleteValue: dbPlusConfig.logicDeleteValue };
  }
  async page(obj = {}) {
    const { pageNum = 1, pageSize = 10, ...selectData } = obj;
    const list = await this.select(obj);
    const total = await this.count(selectData);
    return { list, total, pageSize, pageNum };
  }
  async select(obj) {
    const { sql, arr } = sqlCreate.select(obj, this.tableName, this.tableColumns);
    return await this.db.executeSql(sql, arr);
  }
  async count(obj) {
    const { sql, arr } = sqlCreate.selectCount(obj, this.tableName, this.tableColumns);
    const [{ total }] = await this.db.executeSql(sql, arr);
    return total;
  }
  async insert(obj) {
    const { sql, arr } = sqlCreate[Array.isArray(obj) ? 'batchInsert' : 'insert'](obj, this.tableName, this.tableColumns);
    return await this.db.executeSql(sql, arr);
  }
  async updateById(obj) {
    const { sql, arr } = sqlCreate.updateById(obj, this.tableName, this.tableColumns, this.mainKey);
    return await this.db.executeSql(sql, arr);
  }
  async removeById(id) {
    const removeFunc = sqlCreate[this.isLogicDelete ? 'logicRemoveByIds' : 'removeByIds'];
    const { sql, arr } = removeFunc([id], this.tableName, this.mainKey, this.logicField);
    return await this.db.executeSql(sql, arr);
  }
  async removeByIds(ids) {
    const removeFunc = sqlCreate[this.isLogicDelete ? 'logicRemoveByIds' : 'removeByIds'];
    const { sql, arr } = removeFunc(ids, this.tableName, this.mainKey, this.logicField);
    return await this.db.executeSql(sql, arr);
  }
}

module.exports = DBPlus;
