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
