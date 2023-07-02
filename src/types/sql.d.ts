declare interface TableColumn {
  id: string;
  queryType: string;
  unInsert?: boolean;
}

declare interface WhereTableColumn extends TableColumn {
  table: string;
  dataKey?: string;
}

declare interface LogicField {
  id: string;
  logicDeleteValue: string | number;
}

declare interface SqlCreateResult {
  sql: string;
  arr: Array<string | number>;
}
