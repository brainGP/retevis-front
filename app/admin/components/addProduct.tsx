"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { uploadNewProduct, uploadUpdatedProduct } from "@/apis/uploads";
import ProductModal from "@/components/Products/ProductModal";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/Product";

const AddProduct = ({
  setProducts,
  editProduct,
  setEditProduct,
}: {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  editProduct: Product | null;
  setEditProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}) => {
  const [newProduct, setNewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (editProduct) {
      setNewProduct(editProduct);
    }
  }, [editProduct]);

  const saveProduct = async (product: Product, files: File[]) => {
    try {
      const data = editProduct?._id
        ? await uploadUpdatedProduct(product, files)
        : await uploadNewProduct(product, files);
      setProducts((prev) => {
        const existingProductIndex = prev.findIndex((p) => p._id === data._id);
        if (existingProductIndex >= 0) {
          const updatedProducts = [...prev];
          updatedProducts[existingProductIndex] = data;
          return updatedProducts;
        }
        return [...prev, data];
      });

      toast.success(
        editProduct
          ? "Бүтээгдэхүүн амжилттай шинэчлэгдсэн!"
          : "Бүтээгдэхүүн амжилттай нэмэгдлээ!"
      );
      setEditProduct(null);
    } catch (e) {
      const err = e as Error;
      toast.error(err.message);
    }
  };

  return (
    <>
      <Button
        className="mb-4 text-white"
        onClick={() => setNewProduct({} as Product)}
      >
        Шинэ бүтээгдэхүүн нэмэх
      </Button>
      {newProduct && (
        <ProductModal
          product={newProduct}
          onClose={() => {
            setNewProduct(null);
            setEditProduct(null);
          }}
          onSave={async (updatedProduct: Product, files: File[]) =>
            await saveProduct(updatedProduct, files)
          }
        />
      )}
    </>
  );
};

export default AddProduct;
