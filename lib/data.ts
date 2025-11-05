import { query } from '../db';
import type { Game, Product, BlogPost, Comment } from '../types';

// Games
export async function getAllGames(): Promise<Game[]> {
  const result = await query(
    'SELECT id, title, image_url as "imageUrl", category, tags, theme, description, video_url as "videoUrl", download_url as "downloadUrl", gallery FROM games ORDER BY id'
  );
  return result.rows;
}

export async function getGameById(id: number): Promise<Game | null> {
  const result = await query(
    'SELECT id, title, image_url as "imageUrl", category, tags, theme, description, video_url as "videoUrl", download_url as "downloadUrl", gallery FROM games WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

// Products
export async function getAllProducts(): Promise<Product[]> {
  const result = await query(
    'SELECT id, name, image_url as "imageUrl", price, url, description, gallery, category FROM products ORDER BY id'
  );
  return result.rows;
}

export async function getProductById(id: number): Promise<Product | null> {
  const result = await query(
    'SELECT id, name, image_url as "imageUrl", price, url, description, gallery, category FROM products WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

// Blogs
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const result = await query(
    'SELECT id, title, summary, image_url as "imageUrl", video_url as "videoUrl", author, publish_date as "publishDate", rating, affiliate_url as "affiliateUrl", content, category FROM blog_posts ORDER BY id'
  );
  return result.rows.map(row => ({
    ...row,
    publishDate: row.publishDate ? new Date(row.publishDate).toISOString().split('T')[0] : null,
    rating: row.rating ? parseFloat(row.rating) : 0,
  }));
}

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const result = await query(
    'SELECT id, title, summary, image_url as "imageUrl", video_url as "videoUrl", author, publish_date as "publishDate", rating, affiliate_url as "affiliateUrl", content, category FROM blog_posts WHERE id = $1',
    [id]
  );
  const row = result.rows[0];
  if (!row) return null;
  
  return {
    ...row,
    publishDate: row.publishDate ? new Date(row.publishDate).toISOString().split('T')[0] : null,
    rating: row.rating ? parseFloat(row.rating) : 0,
  };
}

// Comments
export async function getCommentsByBlogId(blogId: number): Promise<Comment[]> {
  const result = await query(
    'SELECT id, author, avatar_url as "avatarUrl", date, text FROM comments WHERE blog_post_id = $1 ORDER BY id',
    [blogId]
  );
  return result.rows.map(row => ({
    ...row,
    date: row.date ? new Date(row.date).toISOString().split('T')[0] : null,
  }));
}
