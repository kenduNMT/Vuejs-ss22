export interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
}