import { createContext } from 'react';

type ILayoutContext = {
  data?: any;
  setData?: React.Dispatch<any>;
  initialData?: any;
  setInitialData?: React.Dispatch<any>;
};
const LayoutContext = createContext<ILayoutContext>({});

export default LayoutContext;
