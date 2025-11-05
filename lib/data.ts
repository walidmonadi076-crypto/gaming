// lib/data.ts
import { query } from '../db';
import type { BlogPost, Comment, Product, Game } from '../types';

/* ========== 📰 BLOG POSTS ========== */

// جلب جميع المقالات
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const result = await query(`
    SELECT 
      id,
      title,
      summary,
      image_url AS "imageUrl",
      video_url AS "videoUrl",
      author,
      publish_date AS "publishDate",
      rating::float,
      affiliate_url AS "affiliateUrl",
      content,
      category
    FROM blog_posts
    ORDER BY id ASC
  `);
  return result.rows;
}

// جلب مقال واحد عبر الـ ID
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const result = await query(`
    SELECT 
      id,
      title,
      summary,
      image_url AS "imageUrl",
      video_url AS "videoUrl",
      author,
      publish_date AS "publishDate",
      rating::float,
      affiliate_url AS "affiliateUrl",
      content,
      category
    FROM blog_posts
    WHERE id = $1
  `, [id]);

  return result.rows.length > 0 ? result.rows[0] : null;
}

/* ========== 💬 COMMENTS ========== */

// جلب التعليقات الخاصة بكل مقال
export async function getCommentsByBlogId(blogId: number): Promise<Comment[]> {
  const result = await query(`
    SELECT 
      id,
      author,
      avatar_url AS "avatarUrl",
      text,
      date
    FROM comments
    WHERE blog_post_id = $1
    ORDER BY id DESC
  `, [blogId]);

  return result.rows;
}

/* ========== 🛍️ PRODUCTS ========== */

// جلب جميع المنتجات
export async function getAllProducts(): Promise<Product[]> {
  const result = await query(`
    SELECT
      id,
      name,
      image_url AS "imageUrl",
      price,
      url,
      description,
      gallery,
      category
    FROM products
    ORDER BY id ASC
  `);
  return result.rows;
}
// جلب منتج واحد عبر الـ ID
export async function getProductById(id: number): Promise<Product | null> {
  const result = await query(`
    SELECT
      id,
      name,
      image_url AS "imageUrl",
      price,
      url,
      description,
      gallery,
      category
    FROM products
    WHERE id = $1
  `, [id]);

  return result.rows.length > 0 ? result.rows[0] : null;
}

/* ========== 🎮 GAMES ========== */

// جلب جميع الألعاب
export async function getAllGames(): Promise<Game[]> {
  const result = await query(`
    SELECT
      id,
      title,
      image_url AS "imageUrl",
      category,
      tags,
      theme,
      description,
      video_url AS "videoUrl",
      download_url AS "downloadUrl",
      gallery
    FROM games
    ORDER BY id ASC
  `);
  return result.rows;
}
export async function getGameById(id: number): Promise<Game | null> {
  const result = await query(`
    SELECT
      id,
      title,
      image_url AS "imageUrl",
      category,
      tags,
      theme,
      description,
      video_url AS "videoUrl",
      download_url AS "downloadUrl",
      gallery
    FROM games
    WHERE id = $1
  `, [id]);

  return result.rows.length > 0 ? result.rows[0] : null;
}
