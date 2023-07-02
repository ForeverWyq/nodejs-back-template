const _ = require('lodash');
const { QUERY_TYPE } = global.$CONSTANT;

/**
 * 查询条件
 * @param {string | number} value 数据
 * @param {string} queryType 查询方式
 * @returns {string | number}
 */
function selectDataCreated(value, queryType) {
  if (_.isNil(value)) {
    return value;
  }
  const map = new Map([
    [QUERY_TYPE.head, `${value}%`],
    [QUERY_TYPE.last, `%${value}`],
    [QUERY_TYPE.includes, value !== '' ? `%${value}%` : '%'],
    [QUERY_TYPE.exact, value]
  ]);
  return map.get(queryType) || value;
}

/**
 *
 * @param {Object} data 数据
 * @param {WhereTableColumn[]} tableColumns 要生成的列表
 * @returns {SqlCreateResult}
 */
function whereCreated(data, tableColumns) {
  let sql = 'where 1=1';
  const arr = [];
  tableColumns.forEach(({ id, dataKey, table, queryType }) => {
    const value = data[_.isNil(dataKey) ? id : dataKey];
    if (_.isNil(value)) {
      return;
    }
    if (queryType === QUERY_TYPE.exact) {
      sql = `${sql} and ${table}.${id}=?`;
    } else {
      sql = `${sql} and ${table}.${id} like ?`;
    }
    arr.push(selectDataCreated(value, queryType));
  });
  return { sql, arr };
}

/**
 * 查询
 * @param {Object} data 数据
 * @param {string} table 表名称
 * @param {TableColumn[]} tableColumns 表字段数组
 * @returns {SqlCreateResult}
 */
function select(data, table, tableColumns) {
  const { pageNum, pageSize, ...selectData } = data;
  const where = whereCreated(selectData, tableColumns.map(item => ({ ...item, table })));
  const arr = where.arr;
  let sql = `select * from ${table} ${where.sql}`;
  if (pageNum && pageSize) {
    const start = ((Number(pageNum) - 1) * Number(pageSize));
    sql = `${sql} limit ?,?`;
    arr.push(start, pageSize);
  }
  return { sql, arr };
};

/**
 * 查询总数
 * @param {Object} data 数据
 * @param {string} table 表名称
 * @param {TableColumn[]} tableColumns 表字段数组
 * @returns {SqlCreateResult}
 */
function selectCount(data, table, tableColumns) {
  const { sql, arr } = whereCreated(data, tableColumns.map(item => ({ ...item, table })));
  return { sql: `select count(*) as total from ${table} ${sql}`, arr };
};

/**
 * 获取插入的行数据
 * @param {Object | Array} data 数据
 * @param {TableColumn[]} tableColumns 表字段数组
 * @returns {{column: string[]; arr: Array<string | number>}}
 */
function getInsertColumnWithVal(data, tableColumns) {
  const column = tableColumns.filter(({ unInsert }) => !unInsert).map(({ id }) => id);
  const arr = [];
  if (Array.isArray(data)) {
    data.forEach(item => {
      column.forEach(id => {
        arr.push(item[id]);
      });
    });
    return { column, arr };
  }
  const keys = [];
  column.forEach(({ id }) => {
    const value = data[id];
    if (!_.isNil(value)) {
      keys.push(id);
      arr.push(value);
    }
  });
  return { column: keys, arr };
}

/**
 * 插入
 * @param {Object} data 数据
 * @param {string} table 表名称
 * @param {TableColumn[]} tableColumns 表字段数组
 * @returns {SqlCreateResult}
 */
function insert(data, table, tableColumns) {
  const { column, arr } = getInsertColumnWithVal(data, tableColumns);
  return {
    sql: `insert into ${table} (${column.join(',')}) value (${new Array(arr.length).fill('?').join(',')})`,
    arr
  };
};

/**
 * 批量插入
 * @param {Object[]} data 数据
 * @param {string} table 表名称
 * @param {TableColumn[]} tableColumns 表字段数组
 * @returns {SqlCreateResult}
 */
function batchInsert(data, table, tableColumns) {
  const { column, arr } = getInsertColumnWithVal(data, tableColumns);
  const col = `(${new Array(column.length).fill('?').join(',')})`;
  const values = new Array(data.length).fill(col).join(',');
  return {
    sql: `insert into ${table} (${column.join(',')}) values ${values}`,
    arr
  };
}

/**
 * 更新
 * @param {Object} data 数据
 * @param {string} table 表名称
 * @param {TableColumn[]} tableColumns 表字段数组
 * @param {string} tableMainKey 主键名称
 * @returns {SqlCreateResult}
 */
function updateById(data, table, tableColumns, tableMainKey) {
  const sets = [];
  const arr = [];
  tableColumns.forEach(({ id }) => {
    const value = data[id];
    if (_.isNil(value) && id !== tableMainKey) {
      sets.push(`${id}=?`);
      arr.push(value);
    }
  });
  arr.push(data[tableMainKey]);
  return {
    sql: `update ${table} set ${sets.join(',')} where ${tableMainKey}=?`,
    arr
  };
};

/**
 * 批量删除
 * @param {Array<string | number>} ids 数据
 * @param {string} table 表名称
 * @param {string} tableMainKey 主键名称
 * @returns {SqlCreateResult}
 */
function removeByIds(ids, table, tableMainKey) {
  const arr = ids.filter(_.isNil);
  return {
    sql: `delete from ${table} where ${tableMainKey} in (${new Array(arr.length).fill('?').join(',')})`,
    arr
  };
};

/**
 * 批量逻辑删除
 * @param {Array<string | number>} ids 数据
 * @param {string} table 表名称
 * @param {string} tableMainKey 主键名称
 * @param {LogicField} logicField 逻辑删除字段对象
 * @returns {SqlCreateResult}
 */
function logicRemoveByIds(ids, table, tableMainKey, logicField) {
  const arr = ids.filter(_.isNil);
  return {
    sql: `update ${table} set ${logicField.id}=${logicField.logicDeleteValue} where ${tableMainKey} in (${new Array(arr.length).fill('?').join(',')})`,
    arr
  };
}

module.exports = {
  select,
  selectCount,
  insert,
  batchInsert,
  updateById,
  removeByIds,
  logicRemoveByIds
};
