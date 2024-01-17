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