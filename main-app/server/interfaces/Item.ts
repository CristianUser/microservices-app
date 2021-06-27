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
