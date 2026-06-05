export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  // false when the sheet's "out_of_menu" column is "yes" → shown as Unavailable.
  available: boolean;
  // true when the sheet's "special" column is "yes" → featured in "Our Special Dish".
  special: boolean;
  // true when the sheet's "popular" column is "yes" → featured in "Our Popular Menu".
  popular: boolean;
};
