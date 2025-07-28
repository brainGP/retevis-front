"use client";
import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/Product";
import SetQuantity from "./CartQuantity";
import { useCart } from "@/hooks/useCarts";
import { useRouter } from "next/navigation";
import { Rating } from "@mui/material";
import { formatPrice } from "@/utils/formatPrice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import StoreIcon from "@/public/icons/store";
import BatteryIcon from "@/public/icons/battery";

const StationCard = ({ station }: { station: Product }) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(station.images[0]?.image);
  const [isProductInCart, setIsProductInCart] = useState(false);
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };
  const { handleAddProductToCart, cartProducts } = useCart();
  const [cartProduct, setCartProduct] = useState<Product>({
    _id: station._id,
    name: station.name,
    type: station.type,
    style: station.style,
    price: station.price,
    priceN: station.priceN,
    battery: station.battery,
    power: station.power,
    hertz: station.hertz,
    status: station.status,
    size: station.size,
    images: station.images,
    quantity: 1,
    sort: station.sort,
    brand: station.brand,
    description: station.description,
    rating: station.rating,
  });

  useEffect(() => {
    setIsProductInCart(false);

    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item._id === station._id
      );
      if (existingIndex > -1) {
        setIsProductInCart(true);
      }
    }
  }, [cartProducts, station._id]);

  const handleQtyIncrease = useCallback(() => {
    setCartProduct((prev) => {
      if (prev.quantity >= station.quantity) return prev;
      return { ...prev, quantity: prev.quantity + 1 };
    });
  }, [station.quantity]);

  const handleQtyDecrease = useCallback(() => {
    setCartProduct((prev) => {
      if (prev.quantity <= 1) return prev;
      return { ...prev, quantity: prev.quantity - 1 };
    });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full justify-between gap-8 space-y-4 lg:space-y-0 mt-8">
      <div className="flex w-full h-full gap-8 flex-row justify-between">
        <div className="flex flex-col gap-8 justify-center items-center w-[33%]">
          {station.images.slice(0, 3).map((image) => (
            <div
              key={image.image}
              onClick={() => handleImageClick(image.image)}
              className="cursor-pointer border hover:border-gray/30 rounded-lg flex justify-center items-center group aspect-square
                 w-full p-2"
            >
              <Image
                src={image.image}
                alt={image.image}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 aspect-square"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center w-full border rounded-lg overflow-hidden bg-white p-8 aspect-square">
          <Image
            src={selectedImage}
            alt={station.name}
            width={0}
            height={0}
            sizes="100vw"
            className="w-fit h-full object-contain rounded-md aspect-square"
            priority
          />
        </div>
      </div>

      <div className="w-full flex justify-center lg:h-[580px]">
        <div className="flex flex-col space-y-2 w-full justify-between h-full">
          <ScrollArea className="w-full h-auto lg:h-full lg:overflow-y-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray">
                {station.name}
              </h1>
              <div className="flex items-center gap-2 p-4">
                <Rating value={station.rating} precision={0.5} readOnly />
                <span className="text-sm text-gray">({station.rating})</span>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl md:text-4xl font-semibold">
                {formatPrice(station.priceN)}₮
              </span>
              <span className="text-gray/40"> (НӨАТ-тэй)</span>
            </div>
            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex-1 space-y-2">
                <strong>Тайлбар:</strong>
                <p className="text-sm break-words whitespace-pre-wrap">
                  {station.description}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <strong>Батарэй:</strong>
                <p className="text-sm">{station.battery}</p>
                <BatteryIcon />
              </div>
              <div className="flex space-x-2 items-center">
                <strong>Гаралтын чадал:</strong>
                <p className="text-sm">{station.power}</p>
              </div>
              <div className="flex space-x-2 items-center">
                <strong>Давтамж:</strong>
                <p className="text-sm ">{station.hertz}</p>
              </div>
              <div className="flex space-x-2 items-center">
                <strong>Загвар:</strong>
                <p className="text-sm ">{station.style}</p>
              </div>
            </div>
          </ScrollArea>
          <Separator />
          <div className="mt-4">
            <SetQuantity
              cartProduct={cartProduct}
              handleQtyDecrease={handleQtyDecrease}
              handleQtyIncrease={handleQtyIncrease}
            />
          </div>
          <div className="flex items-center justify-between gap-4 md:gap-x-16">
            {isProductInCart ? (
              <Button
                className="flex text-white px-6 py-3 rounded-md w-full"
                onClick={() => router.push("/cart")}
              >
                <StoreIcon size={24} color="white" />
                <span>Сагс харах</span>
              </Button>
            ) : (
              <Button
                className="flex text-white px-6 py-3 rounded-md w-full"
                onClick={() => handleAddProductToCart(cartProduct)}
              >
                <StoreIcon size={24} color="white" />
                <span>Сагсанд нэмэх</span>
              </Button>
            )}

            <Button className=" bg-white border border-gray/30 text-gray hover:bg-gray/5 px-6 py-3 rounded-md gap-4 w-full">
              <a
                href="https://m.me/RetevisMongolia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 justify-between"
              >
                <Image
                  src="/icons/msgIcon.svg"
                  alt="icon"
                  height={16}
                  width={16}
                />
                <span>Холбогдох</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationCard;
