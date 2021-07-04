export interface Item {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  disabled: boolean;
  status: string;
  uom?: string;
  brand?: string;
  itemGroup: any;
}

export interface ItemPrice {
  id: number;
  currency: string;
  rate: number;
  buying: boolean;
  selling: boolean;
  disabled: boolean;
  status: string;
  item: Item;
}
