export interface Order {
  id: number;
  customer: string;
  description?: string;
  disabled: boolean;
  status: string;
  items?: string[];
  total: number;
  subTotal: number;
}

export interface Customer {
  id: number;
  name: string;
  description?: string;
  disabled: boolean;
  status: string;
}
