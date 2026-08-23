export interface ClientProduct {
  id: string;
  shopId: string;
  name: string;
  price: number;
  imageUrl: string;
  available: boolean;
  locked: boolean;
  stock: number | null;
  createdAt: Date;
}

export type ProductModalState =
  | { type: "add" }
  | { type: "edit"; product: ClientProduct }
  | null;
