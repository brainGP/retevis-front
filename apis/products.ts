import { DELETE, GET, POST, PUT } from "./axios";
import { Product } from "@/types/Product";
import { AxiosError } from "axios";

export interface ProductSearchPage {
  products: Product[];
  pagination: { page?: number; limit: number; total?: number; pages?: number; nextCursor?: string | null; hasMore?: boolean };
}

export const getProductsPage = async (cursor?: string, filters: { sort?: string; order?: string } = {}): Promise<ProductSearchPage> => {
  const params = new URLSearchParams({ limit: "24" });
  if (cursor) params.set("cursor", cursor);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.order) params.set("order", filters.order);
  const response = await GET({ route: `/api/product?${params.toString()}` });
  if (response.status !== 200) throw new Error("Алдаа гарлаа");
  return response.data as ProductSearchPage;
};

function adminRequestError(error: unknown, fallback: string): Error {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) return new Error("Нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү.");
    if (error.response?.status === 403) return new Error("Зөвхөн админ эрхтэй хэрэглэгч энэ үйлдлийг хийх боломжтой.");
  }
  return new Error(fallback);
}

// This is a browser request so the backend's HttpOnly /api cookie is attached
// by the browser. Admin authorization remains enforced by the backend route.
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await GET({ route: "/api/product?all=true" });
    if (response.status !== 200) throw new Error("Бүтээгдэхүүн татаж чадсангүй.");
    return response.data.products || [];
  } catch (error) {
    throw adminRequestError(error, "Бүтээгдэхүүн татаж чадсангүй.");
  }
};

export const getProductByName = async ({
  name,
}: {
  name: string;
}): Promise<Product | null> => {
  try {
    const response = await GET({ route: `/api/product/find/${encodeURIComponent(name)}` });
    if (response.status !== 200) throw new Error("Алдаа гарлаа");
    return response.data as Product;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) return null;
    throw error;
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const normalized = query.trim();
  if (!normalized) return [];
  if (normalized.length < 2) return [];
  const response = await GET({ route: `/api/product?q=${encodeURIComponent(normalized)}&limit=8` });
  if (response.status !== 200) throw new Error("Хайлт амжилтгүй боллоо.");
  return response.data.products || [];
};

export const getProductsBySearch = async (query: string, cursor?: string, filters: { brand?: string; sort?: string; order?: string } = {}): Promise<ProductSearchPage> => {
  if (!query.trim()) return getProductsPage(cursor, filters);
  const params = new URLSearchParams({ q: query.trim(), limit: "24" });
  if (cursor) params.set("cursor", cursor);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.order) params.set("order", filters.order);
  const response = await GET({ route: `/api/product?${params.toString()}` });
  if (response.status !== 200) throw new Error("Бүтээгдэхүүн татаж чадсангүй.");
  return response.data as ProductSearchPage;
};

export const getProductsByBrand = async ({
  brand,
  cursor,
  sort,
  order,
}: {
  brand: string;
  cursor?: string;
  sort?: string;
  order?: string;
}): Promise<ProductSearchPage> => {
  const params = new URLSearchParams({ brand, limit: "24" });
  if (cursor) params.set("cursor", cursor);
  if (sort) params.set("sort", sort);
  if (order) params.set("order", order);
  const response = await GET({ route: `/api/product?${params.toString()}` });
  if (response.status !== 200) throw new Error("Алдаа гарлаа");
  return response.data as ProductSearchPage;
};

export const getNewProducts = async (): Promise<Product[]> => {
  const response = await GET({ route: `/api/product/?new=true` });
  if (response.status !== 200) throw new Error("Алдаа гарлаа");
  const data: Product[] = response.data.products || [];
  return data;
};

export const getProductById = async ({
  id,
}: {
  id: string;
}): Promise<Product> => {
  const response = await GET({ route: `/api/product/${encodeURIComponent(id)}` });
  if (response.status !== 200) throw new Error("Алдаа гарлаа");
  return response.data as Product;
};

export const postNewProduct = async (product: FormData): Promise<Product> => {
  try {
    const response = await POST({ route: "/api/product", body: product });
    if (response.status !== 200) throw new Error("Бүтээгдэхүүнийг нэмж чадсангүй.");
    return response.data;
  } catch (error) {
    throw adminRequestError(error, "Бүтээгдэхүүнийг нэмж чадсангүй.");
  }
};

export const deleteProductById = async ({ id }: { id: string }) => {
  try {
    const response = await DELETE({ route: `/api/product/${encodeURIComponent(id)}` });
    if (response.status !== 200) throw new Error("Бүтээгдэхүүнийг устгаж чадсангүй.");
  } catch (error) {
    throw adminRequestError(error, "Бүтээгдэхүүнийг устгаж чадсангүй.");
  }
};

export const updateProductById = async ({
  product,
  formData,
}: {
  product: Product;
  formData?: FormData;
}): Promise<Product> => {
  try {
    const response = await PUT({
      route: `/api/product/${encodeURIComponent(product._id)}`,
      body: formData || product,
    });
    if (response.status !== 200) throw new Error("Бүтээгдэхүүнийг шинэчилж чадсангүй.");
    return response.data;
  } catch (error) {
    throw adminRequestError(error, "Бүтээгдэхүүнийг шинэчилж чадсангүй.");
  }
};

export const updateProductStock = async ({
  id,
  quantity,
  status,
}: {
  id: string;
  quantity?: number;
  status?: boolean;
}): Promise<Product> => {
  const body: { quantity?: number; status?: boolean } = {};
  if (quantity !== undefined) body.quantity = quantity;
  if (status !== undefined) body.status = status;
  try {
    const response = await PUT({ route: `/api/product/${encodeURIComponent(id)}`, body });
    if (response.status !== 200) throw new Error("Бүтээгдэхүүний үлдэгдлийг шинэчилж чадсангүй.");
    return response.data as Product;
  } catch (error) {
    throw adminRequestError(error, "Бүтээгдэхүүний үлдэгдлийг шинэчилж чадсангүй.");
  }
};
