import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { AiFillStar } from "react-icons/ai";

type Product = {
  name: string;
  price: number;
  slug: { current: string };
  imageUrl: string;
  isOnSale?: boolean;
  rating?: number;
};

export default async function Home() {
  // Fetch products from Sanity
  const Query = `*[_type == "product"] {
    name,
    price,
    slug,
    "imageUrl": image.asset->url,
    isOnSale,
    rating
  }`;

  const display: Product[] = await client.fetch(Query);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Our Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {display.map((product: Product, i: number) => (
          <Link
            key={i}
            href={`/product/${product.slug.current}`}
            className="relative bg-gradient-to-r from-blue-50 to-blue-100 shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            {/* Sale Badge */}
            {product.isOnSale && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-md">
                Sale
              </span>
            )}

            <Image
              src={product.imageUrl}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {product.name}
              </h2>
              <p className="text-md text-gray-600 mt-1">${product.price}</p>

              {/* Rating Stars */}
              <div className="flex items-center mt-2">
                {product.rating && product.rating > 0 ? (
                  Array.from({ length: product.rating }).map((_, index) => (
                    <AiFillStar key={index} className="text-yellow-500" />
                  ))
                ) : (
                  <p className="text-gray-500 ml-2">No reviews</p>
                )}
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-blue-600 font-semibold hover:underline">
                  View Details
                </span>
                <button className="px-3 py-1 text-white bg-green-600 hover:bg-green-700 rounded-md shadow-md">
                  Add to Cart
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
