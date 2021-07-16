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

export interface Item extends CommonProps {
  uom?: string;
  brand?: string;
  itemGroup?: ItemGroup;
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
  items?: any[];
  subTotal: number;
  total: number;
}

export type DataTextProp = {
  dynamic?: boolean;
  value: string;
};

export interface JsonPageProps {
  apiRoutePrefix: string;
  title: any;
  breadcrumbRoutes: [];
  [key: string]: any;
}

export interface JsonFormPageProps extends JsonPageProps {
  schemaPath: string;
  uiSchema: any;
  includeImage: boolean;
}

export interface JsonListProps extends JsonPageProps {
  toNewDoc: string;
  columns: [];
}

export interface JsonPage {
  type: 'list' | 'form';
  routePath: string;
  title: string;
  props: JsonFormPageProps | JsonListProps;
}
