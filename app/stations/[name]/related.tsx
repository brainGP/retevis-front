"use client";
import { getProductsByBrand } from "@/apis/products";
import ProductDisplay from "@/components/Products/ProductDisplay";
import React from "react";

const RelatedProducts = ({ brand, id }: { brand: string; id: string }) => {
  return (
    <ProductDisplay
      title={`${brand} брэндийн бусад бүтээгдэхүүнүүд`}
      fetcher={(cursor) => getProductsByBrand({ brand, cursor })}
      filter={(product) => product._id != id}
      fetcherKey={[brand, id]}
      hasSort={false}
      error
    />
  );
};

export default RelatedProducts;
