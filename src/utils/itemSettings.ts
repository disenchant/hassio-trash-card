interface ItemSettings {
  label?: string;
  color?: string;
  pattern?: string;
  pattern_exact?: boolean;
  icon?: string;
  type: 'custom' | 'organic' | 'paper' | 'recycle' | 'waste' | 'others';
  picutre?: string;
  max_items?: number;
}

export type {
  ItemSettings
};
