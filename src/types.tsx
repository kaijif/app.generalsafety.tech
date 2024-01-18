export class Row {
    date: string;
    date_sort: Date;
    time: string;
    bus_number: string;
    saw_motion: boolean;
    link: string;
    public constructor(init?:Partial<Row>) {
      Object.assign(this, init);
    }
  }

  export class ColumnObject {
    key: string;
    dataKey: string;
    title: string;
    width: number;
    sortable: boolean=false;
    public constructor(init?:Partial<ColumnObject>) {
      Object.assign(this, init);
    }
  }