
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '../types';

interface StoreItemCardProps {
  product: Product;
}

const StoreItemCard: React.FC<StoreItemCardProps> = ({ product }) => {
  return (
    <Link href={`/shop/${product.id}`} className="block bg-gray-800 rounded-2xl overflow-hidden group shadow-lg transform hover:-translate-y-1 transition-transform duration-200">
      <div className="aspect-square relative">
        <Image 
          src={product.imageUrl} 
          alt={product.name} 
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
            <p className="text-xl font-bold text-purple-400">{product.price}</p>
            <div
                className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center text-sm"
            >
                View Item
            </div>
        </div>
      </div>
    </Link>
  );
};

export default StoreItemCard;
