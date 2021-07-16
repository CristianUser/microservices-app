import { createContext } from 'react';

type IPageContext = {
  apiRoutePrefix?: string;
  includeImage?: boolean;
  data?: any;
  setData?: React.Dispatch<any>;
  initialData?: any;
  setInitialData?: React.Dispatch<any>;
};

const PageContext = createContext<IPageContext>({});

export default PageContext;
