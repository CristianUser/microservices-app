export interface Order {
  id: string;
  customer: string;
  description?: string;
  disabled: boolean;
  status: string;
  items?: string[];
  total: number;
  subTotal: number;
}

export interface Customer {
  id: string;
  name: string;
  description?: string;
  disabled: boolean;
  status: string;
}

export interface PosLayout {
  id: string;
  name: string;
  data: any;
  description?: string;
  startDate?: Date;
  endDate?: Date;
}
