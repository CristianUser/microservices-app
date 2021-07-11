export interface Sale {
  id: number;
  customer: string;
  description?: string;
  disabled: boolean;
  status: string;
  items?: string[];
}
