import { POST, PUT } from "@/apis/axios";
import { Product } from "@/types/Product";
import { Banner } from "@/types/Banner";
import { notifyCatalogChanged } from "@/lib/catalogCache";

function productFormData(product: Product, files: File[]) {
  const body = new FormData();
  Object.keys(product).forEach((key) => {
    if (key === "_id" || key === "id" || key === "images") return;
    const value = product[key as keyof Product];
    if (value !== undefined && value !== null) body.append(key, String(value));
  });
  body.append("images", JSON.stringify(product.images || []));
  files.forEach((file) => body.append("images", file));
  return body;
}

export async function uploadNewProduct(product: Product, files: File[]): Promise<Product> {
  const response = await POST({
    route: "/api/product",
    body: productFormData(product, files),
  });
  notifyCatalogChanged();
  return response.data as Product;
}

export async function uploadUpdatedProduct(product: Product, files: File[]): Promise<Product> {
  const response = await PUT({
    route: `/api/product/${encodeURIComponent(product._id)}`,
    body: productFormData(product, files),
  });
  notifyCatalogChanged();
  return response.data as Product;
}

export async function uploadNewBanner(file: File): Promise<Banner> {
  const body = new FormData();
  body.append("banner", file);
  const response = await POST({
    route: "/api/dashboard",
    body,
  });
  notifyCatalogChanged("banners");
  return response.data as Banner;
}

export async function uploadUpdatedBanner(id: string, file: File): Promise<Banner> {
  const body = new FormData();
  body.append("banner", file);
  const response = await PUT({
    route: `/api/dashboard/${encodeURIComponent(id)}`,
    body,
  });
  notifyCatalogChanged("banners");
  return response.data as Banner;
}
