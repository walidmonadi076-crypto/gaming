
import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';
import type { BlogPost } from '../../types';
import { getAllBlogPosts } from '../../lib/data';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className="flex items-center text-yellow-400">
            {[...Array(fullStars)].map((_, i) => <svg key={`full-${i}`} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>)}
            {halfStar && <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545zM10 12.83V2.5l1.837 3.718 4.108.597-2.973 2.898.702 4.09L10 12.83z"/></svg>}
            {[...Array(emptyStars)].map((_, i) => <svg key={`empty-${i}`} className="w-4 h-4 fill-current text-gray-600" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>)}
            <span className="ml-2 text-sm text-gray-400">{rating.toFixed(1)}</span>
        </div>
    );
};

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => (
    <Link href={`/blogs/${post.id}`} className="bg-gray-800 rounded-2xl overflow-hidden group shadow-lg transform hover:-translate-y-1 transition-transform duration-200 flex flex-col">
        <div className="aspect-video relative">
            <Image src={post.imageUrl} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{post.title}</h3>
            <p className="text-gray-400 text-sm mb-4 flex-grow">{post.summary}</p>
            <div className="mt-auto pt-4 border-t border-gray-700 flex justify-between items-center">
                <div>
                    <p className="text-xs text-gray-500">{post.author}</p>
                    <p className="text-xs text-gray-500">{post.publishDate}</p>
                </div>
                <StarRating rating={post.rating} />
            </div>
        </div>
    </Link>
);

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

interface BlogsPageProps {
    searchQuery: string;
    posts: BlogPost[];
}

const BlogsPage: React.FC<BlogsPageProps> = ({ searchQuery, posts }) => {
    const router = useRouter();
    const selectedCategory = (router.query.category as string) || 'All';

    const categories = useMemo(() => ['All', ...Array.from(new Set(posts.map(p => p.category)))], [posts]);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
            return matchesQuery && matchesCategory;
        });
    }, [posts, selectedCategory, searchQuery]);

    const handleCategorySelect = (cat: string) => {
        const newQuery = { ...router.query };
        if (cat === 'All' || cat === selectedCategory) {
            delete newQuery.category;
        } else {
            newQuery.category = cat;
        }
        router.push({ pathname: '/blogs', query: newQuery }, undefined, { shallow: true });
    };

    const areFiltersActive = searchQuery || (selectedCategory && selectedCategory !== 'All');

    return (
        <div>
            <h1 className="text-4xl font-bold mb-4">
                {areFiltersActive ? `Results (${filteredPosts.length})` : 'Affiliate Blogs & Reviews'}
            </h1>
            
            <div className="flex flex-wrap gap-2 items-center mb-8">
                <span className="text-sm font-medium text-gray-400 mr-2 hidden sm:inline">Categories:</span>
                {categories.map(cat => (
                    <FilterButton key={cat} label={cat} isActive={selectedCategory === cat} onClick={() => handleCategorySelect(cat)} />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => <BlogCard key={post.id} post={post} />)}
            </div>
            {filteredPosts.length === 0 && (
                <div className="text-center py-10 col-span-full">
                    <p className="text-gray-400">No blog posts found. Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const posts = await getAllBlogPosts();
    return {
        props: {
            posts,
        },
        revalidate: 60,
    };
};

export default BlogsPage;
