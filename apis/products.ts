"use server";
import { DELETE, GET, POST, PUT } from "./axios";
import { cookies } from "next/headers";
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

// Full collection reads are reserved for the administrator inventory table.
async function getServerAccessToken(): Promise<string | undefined> {
  return (await cookies()).get("rv_access")?.value;
}

export const getProducts = async (): Promise<Product[]> => {
  const token = await getServerAccessToken();
  if (!token) throw new Error("Зөвшөөрөлгүй хэрэглэгч");
  const response = await GET({ route: "/api/product?all=true", token });
  if (response.status !== 200) throw new Error("Алдаа гарлаа");
  return response.data.products || [];
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
  const accessToken = await getServerAccessToken();
  if (!accessToken) throw new Error("Зөвшөөрөлгүй хэрэглэгч");
  const response = await POST({
    route: `/api/product`,
    token: accessToken,
    body: product,
  });
  if (response.status !== 200)
    throw new Error("Бүтээгдэхүүнийг нэмж чадсангүй.");
  return response.data;
};

export const deleteProductById = async ({ id }: { id: string }) => {
  const accessToken = await getServerAccessToken();
  if (!accessToken) throw new Error("Зөвшөөрөлгүй хэрэглэгч");
  const response = await DELETE({
    route: `/api/product/${id}`,
    token: accessToken,
  });

  if (response.status !== 200)
    throw new Error("Бүтээгдэхүүнийг устгаж чадсангүй.!");
};

export const updateProductById = async ({
  product,
  formData,
}: {
  product: Product;
  formData?: FormData;
}): Promise<Product> => {
  const accessToken = await getServerAccessToken();
  if (!accessToken) throw new Error("Зөвшөөрөлгүй хэрэглэгч");
  const response = await PUT({
    route: `/api/product/${product._id}`,
    token: accessToken,
    body: formData || product,
  });

  if (response.status !== 200)
    throw new Error("Бүтээгдэхүүнийг шинэчилж чадсангүй.");
  return response.data;
};
