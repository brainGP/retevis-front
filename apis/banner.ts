import { GET, POST } from "./axios";
import { Banner } from "@/types/Banner";

export const getBanners = async (): Promise<Banner[]> => {
  const response = await GET({ route: "/api/dashboard" });

  if (response.status !== 200) throw new Error("Алдаа гарлаа");

  const data: Banner[] = response.data.banners || [];

  return data;
};

export const postNewBanner = async (banner: FormData): Promise<Banner> => {
  const res = await POST({
    route: `/api/dashboard`,
    body: banner,
  });

  if (res.status !== 200) throw new Error("Бүтээгдэхүүнийг нэмж чадсангүй.");
  return res.data;
};
