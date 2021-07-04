interface CommonProps {
  id?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  disabled?: boolean;
}

export interface ItemGroup extends CommonProps {
  name?: string;
}

export interface ItemBrand extends CommonProps {
  name?: string;
}

export interface Item extends CommonProps {
  uom?: string;
  brand?: string;
  itemGroup?: ItemGroup;
}
