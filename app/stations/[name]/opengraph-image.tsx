/* eslint @next/next/no-img-element: off */
import { getProductByName } from "@/apis/products";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Image generation
export default async function og({ params }: { params: { name: string } }) {
  const name = (await params).name;
  const station = await getProductByName({ name });
  if (!station) notFound();
  const imageUrl = station.images?.[0]?.image;

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div tw="relative flex w-full h-full flex items-center justify-center">
        <div tw="absolute flex inset-0">
          {imageUrl ? (
            <img tw="flex flex-1" src={imageUrl} alt={station.name} />
          ) : (
            <div tw="flex flex-1 bg-slate-800" />
          )}
          <div tw="absolute flex inset-0 bg-black bg-opacity-50 z-10" />
        </div>
        <div tw="flex flex-col text-gray">
          <div tw="text-7xl font-bold">{station.name}</div>
          <div tw="flex mt-6 flex-wrap space-x-10 items-center text-4xl text-gray">
            {station.description}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
