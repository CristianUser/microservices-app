interface CommonProps {
  id?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  disabled?: boolean;
  status?: 'draft' | 'archived' | 'active';
}

export interface ItemGroup extends CommonProps {
  name?: string;
}

export interface ItemBrand extends CommonProps {
  name?: string;
}
export interface ItemPrice {
  id?: number;
  currency?: string;
  rate?: number;
  buying?: boolean;
  selling?: boolean;
  disabled?: boolean;
  status?: string;
  item?: Item;
}
export interface Item extends CommonProps {
  uom?: string;
  brand?: string;
  itemGroup?: ItemGroup;
  prices: ItemPrice[];
}

// interface OneOfOption {
//   const: string | number;
//   label: string;
// }

export interface Order {
  id?: string;
  customer?: string;
  description?: string;
  disabled?: boolean;
  status?: string;
  items: any[];
  subTotal: number;
  total: number;
}

export interface Customer extends CommonProps {
  name?: string;
}
