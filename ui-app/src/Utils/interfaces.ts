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

export interface JsonPageProps {
  apiRoutePrefix: string;
  schemaPath: string;
  title: {
    dynamic: boolean;
    value: string;
  };
  uiSchema: any;
  includeImage: boolean;
  breadcrumbRoutes: [];
}
export interface JsonPage {
  routePath: string;
  title: string;
  props: JsonPageProps;
}
