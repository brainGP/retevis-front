export const formatPrice = (price: string | number | null | undefined): string => {
  if (price === null || price === undefined || price === "") return "—";

  const priceNumber = typeof price === "string"
    ? parseInt(price.replace(/[^0-9]/g, ""), 10)
    : price;

  if (!Number.isFinite(priceNumber)) return "—";

  const formatted = new Intl.NumberFormat("en-MN", {
    style: "currency",
    currency: "MNT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceNumber);

  return formatted.replace("MNT", "").trim();
};
