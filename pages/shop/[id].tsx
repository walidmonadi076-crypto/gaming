
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { getProductById, getAllProducts } from '../../lib/data';
import type { Product } from '../../types';

interface ProductDetailPageProps {
    product: Product;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
    const router = useRouter();
    const [mainImage, setMainImage] = useState<string>('');

    useEffect(() => {
        if (product) {
            setMainImage(product.gallery[0] || product.imageUrl);
        }
    }, [product]);

    const AdPlaceholder: React.FC<{ className?: string, text: string }> = ({ className, text }) => (
      <div className={`bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm font-semibold">{text}</span>
      </div>
    );

    if (router.isFallback) {
        return (
             <div className="text-center p-10">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-lg text-gray-300">Loading Product...</p>
            </div>
        );
    }
    
    return (
        <>
            <Head>
                <title>{product.name} | Crazy Games Clone</title>
                <meta name="description" content={product.description} />
            </Head>
            <div className="max-w-6xl mx-auto">
                <div className="mb-4">
                    <Link href="/shop" className="text-sm text-purple-400 hover:underline">&lt; Back to Shop</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <div>
                        <div className="bg-gray-800 rounded-2xl overflow-hidden mb-4 aspect-square relative">
                           {mainImage && <Image src={mainImage} alt={product.name} fill sizes="100vw" className="object-cover transition-all duration-300" />}
                        </div>
                        <div className="flex gap-2">
                            {product.gallery.map((img, index) => (
                                <button key={index} onClick={() => setMainImage(img)} className={`w-1/4 rounded-lg overflow-hidden aspect-square border-2 transition-colors relative ${mainImage === img ? 'border-purple-500' : 'border-transparent hover:border-gray-500'}`}>
                                    <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} fill sizes="25vw" className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col">
                         <h1 className="text-4xl font-extrabold text-white mb-2">{product.name}</h1>
                         <p className="text-4xl font-bold text-purple-400 mb-6">{product.price}</p>
                         <div className="prose prose-invert prose-p:text-gray-300 prose-p:leading-relaxed mb-8">
                             <p>{product.description}</p>
                         </div>
                         <a href={product.url} target="_blank" rel="noopener noreferrer" className="mt-auto w-full text-center bg-green-500 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-green-600 transition-colors duration-300 transform hover:scale-105">
                            Buy Now
                        </a>
                        <AdPlaceholder className="w-full h-48 mt-8" text="Square Ad (300x250)" />
                    </div>
                </div>
            </div>
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const products = await getAllProducts();
    const paths = products.map(product => ({
        params: { id: product.id.toString() },
    }));
    return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const { id } = context.params!;
    const product = await getProductById(Number(id));

    if (!product) {
        return { notFound: true };
    }

    return {
        props: {
            product,
        },
        revalidate: 60,
    };
};

export default ProductDetailPage;
