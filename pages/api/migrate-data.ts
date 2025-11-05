import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";
import { GAMES_DATA } from "../../data/games";
import { BLOGS_DATA, COMMENTS_DATA } from "../../data/blogs";
import { PRODUCTS_DATA } from "../../data/products";
import { isAuthenticated } from "./auth/check";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    return res.status(500).json({ error: "DATABASE_URL not configured" });
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    await client.query("DELETE FROM comments");
    await client.query("DELETE FROM blog_posts");
    await client.query("DELETE FROM games");
    await client.query("DELETE FROM products");

    for (const game of GAMES_DATA) {
      await client.query(
        `INSERT INTO games (id, title, image_url, category, tags, theme, description, video_url, download_url, gallery) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          game.id,
          game.title,
          game.imageUrl,
          game.category,
          game.tags || [],
          game.theme || null,
          game.description,
          game.videoUrl || null,
          game.downloadUrl,
          game.gallery,
        ]
      );
    }

    for (const blog of BLOGS_DATA) {
      await client.query(
        `INSERT INTO blog_posts (id, title, summary, image_url, video_url, author, publish_date, rating, affiliate_url, content, category) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          blog.id,
          blog.title,
          blog.summary,
          blog.imageUrl,
          blog.videoUrl || null,
          blog.author,
          blog.publishDate,
          blog.rating,
          blog.affiliateUrl,
          blog.content,
          blog.category,
        ]
      );
    }

    for (const product of PRODUCTS_DATA) {
      await client.query(
        `INSERT INTO products (id, name, image_url, price, url, description, gallery, category) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          product.id,
          product.name,
          product.imageUrl,
          product.price,
          product.url,
          product.description,
          product.gallery,
          product.category,
        ]
      );
    }

    for (const [blogId, comments] of Object.entries(COMMENTS_DATA)) {
      for (const comment of comments) {
        await client.query(
          `INSERT INTO comments (id, blog_post_id, author, avatar_url, date, text) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            comment.id,
            parseInt(blogId),
            comment.author,
            comment.avatarUrl,
            comment.date,
            comment.text,
          ]
        );
      }
    }

    await client.query(`SELECT setval('games_id_seq', (SELECT MAX(id) FROM games))`);
    await client.query(`SELECT setval('blog_posts_id_seq', (SELECT MAX(id) FROM blog_posts))`);
    await client.query(`SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))`);
    await client.query(`SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments))`);

    res.status(200).json({ 
      success: true, 
      message: "Data migrated successfully",
      counts: {
        games: GAMES_DATA.length,
        blogs: BLOGS_DATA.length,
        products: PRODUCTS_DATA.length,
        comments: Object.values(COMMENTS_DATA).flat().length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  } finally {
    await client.end();
  }
}
