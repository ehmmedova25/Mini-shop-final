import axios from "axios";

const BASE_URL = "https://dummyjson.com";

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
  reviews?: Review[];
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode?: string;
    qrCode?: string;
  };
}
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const handleApiError = (error: any, customMessage: string) => {
  console.error(`API Error [${customMessage}]:`, error);
  throw new Error(error.response?.data?.message || customMessage);
};


export const getProducts = async (limit = 100, skip = 0): Promise<ProductsResponse> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch products. Please try again later.");
  }
};

export const getProductsByCategory = async (category: string): Promise<ProductsResponse> => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=100`
    );
    return data;
  } catch (error) {
    return handleApiError(error, `Could not load products for category: ${category}`);
  }
};

export const searchProducts = async (query: string): Promise<ProductsResponse> => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=100`
    );
    return data;
  } catch (error) {
    return handleApiError(error, `Search failed for: "${query}"`);
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/products/${id}`);
    return data;
  } catch (error) {
    return handleApiError(error, `Product details not found (ID: ${id})`);
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/products/category-list`);
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to load categories.");
  }
};

export const getRelatedProducts = async (
  category: string,
  excludeId: number,
  limit = 4
): Promise<Product[]> => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=20`
    );
    const products: Product[] = data.products;
    return products.filter((p) => p.id !== excludeId).slice(0, limit);
  } catch (error) {
    console.warn("Could not fetch related products:", error);
    return [];
  }
};


