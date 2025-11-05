
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';
import type { Product } from '../../types';
import { getAllProducts } from '../../lib/data';
import StoreItemCard from '../../components/StoreItemCard';

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
            isActive 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
    >
        {label}
    </button>
);

interface ShopProps {
  searchQuery: string;
  products: Product[];
}

const Shop: React.FC<ShopProps> = ({ searchQuery, products }) => {
  const router = useRouter();
  const selectedCategory = (router.query.category as string) || 'All';

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
        const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesQuery && matchesCategory;
    });
  }, [products, selectedCategory, searchQuery]);
  
  const handleCategorySelect = (cat: string) => {
    const newQuery = { ...router.query };
    if (cat === 'All' || cat === selectedCategory) {
        delete newQuery.category;
    } else {
        newQuery.category = cat;
    }
    router.push({ pathname: '/shop', query: newQuery }, undefined, { shallow: true });
  };
  
  const areFiltersActive = searchQuery || (selectedCategory && selectedCategory !== 'All');

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">
        {areFiltersActive ? `Results (${filteredProducts.length})` : 'Gaming Product Corner'}
      </h1>
      
      <div className="flex flex-wrap gap-2 items-center mb-8">
        <span className="text-sm font-medium text-gray-400 mr-2 hidden sm:inline">Categories:</span>
        {categories.map(cat => (
          <FilterButton key={cat} label={cat} isActive={selectedCategory === cat} onClick={() => handleCategorySelect(cat)} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
            <StoreItemCard key={product.id} product={product} />
        ))}
      </div>
       {filteredProducts.length === 0 && (
          <div className="text-center py-10 col-span-full">
              <p className="text-gray-400">No products found. Try adjusting your search or filters.</p>
          </div>
        )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
    const products = await getAllProducts();
    return {
        props: {
            products,
        },
        revalidate: 60,
    };
};

export default Shop;
