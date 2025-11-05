
import type { Game, Product, BlogPost, Comment } from './types';

const fetcher = async <T>(url: string): Promise<T> => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return res.json();
}

export const fetchGames = (): Promise<Game[]> => fetcher<Game[]>('/api/games');
export const fetchGameById = (id: number): Promise<Game | undefined> => fetcher<Game | undefined>(`/api/games/${id}`);

export const fetchProducts = (): Promise<Product[]> => fetcher<Product[]>('/api/products');
export const fetchProductById = (id: number): Promise<Product | undefined> => fetcher<Product | undefined>(`/api/products/${id}`);

export const fetchBlogs = (): Promise<BlogPost[]> => fetcher<BlogPost[]>('/api/blogs');
export const fetchBlogById = (id: number): Promise<BlogPost | undefined> => fetcher<BlogPost | undefined>(`/api/blogs/${id}`);

export const fetchCommentsByBlogId = (blogId: number): Promise<Comment[]> => fetcher<Comment[]>(`/api/comments/${blogId}`);
