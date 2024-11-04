import axios from 'axios';
import { Product } from '../types/product';

const API_URL = 'http://localhost:3000/products';

export const productService = {
    // Lấy danh sách sản phẩm
    async getProducts(): Promise<Product[]> {
        const response = await axios.get<Product[]>(API_URL);
        return response.data;
    },

    // Thêm sản phẩm mới
    async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
        const response = await axios.post<Product>(API_URL, product);
        return response.data;
    },

    // Cập nhật sản phẩm
    async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
        const response = await axios.put<Product>(`${API_URL}/${id}`, product);
        return response.data;
    },

    // Xóa sản phẩm
    async deleteProduct(id: number): Promise<void> {
        await axios.delete(`${API_URL}/${id}`);
    }
};