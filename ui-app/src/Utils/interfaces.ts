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
  currency: string;
  rate: number;
  buying?: boolean;
  selling?: boolean;
  disabled?: boolean;
  status?: string;
  item: Item | string;
}
export interface Item extends CommonProps {
  uom?: string;
  brand?: string;
  itemGroup?: ItemGroup;
  prices: ItemPrice[];
}

export interface PricedItem extends Item {
  price: number;
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
  session?: string;
}

export interface PosSession {
  id?: string;
  employee?: string;
  layout?: any;
  data?: any;
  description?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface Customer extends CommonProps {
  name?: string;
}

export type DataTextProp = {
  dynamic?: boolean;
  value: string;
};

export interface BreadcrumbRoute {
  path: string;
  breadcrumbName: DataTextProp;
}
export interface JsonPageProps {
  apiRoutePrefix: string;
  title: any;
  breadcrumbRoutes: BreadcrumbRoute[];
  [key: string]: any;
}

export interface JsonFormPageProps extends JsonPageProps {
  schemaPath: string;
  uiSchema: any;
  includeImage: boolean;
  schemaSubs?: string[];
}

export interface JsonListProps extends JsonPageProps {
  collapsedSidebar?: boolean;
  callArgs?: any;
  toNewDoc: string;
  columns: any[];
}

export interface JsonPage {
  type: 'list' | 'form';
  routePath: string;
  title: string;
  props: JsonFormPageProps | JsonListProps;
}
