const { Pool } = require('pg');

const GAMES_DATA = require('../data/games').GAMES_DATA;
const { BLOGS_DATA, COMMENTS_DATA } = require('../data/blogs');
const PRODUCTS_DATA = require('../data/products').PRODUCTS_DATA;

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Starting migration...');
    
    await pool.query("DELETE FROM comments");
    await pool.query("DELETE FROM blog_posts");
    await pool.query("DELETE FROM games");
    await pool.query("DELETE FROM products");
    console.log('Cleared existing data');

    for (const game of GAMES_DATA) {
      await pool.query(
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
    console.log(`Migrated ${GAMES_DATA.length} games`);

    for (const blog of BLOGS_DATA) {
      await pool.query(
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
    console.log(`Migrated ${BLOGS_DATA.length} blog posts`);

    for (const product of PRODUCTS_DATA) {
      const price = typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^0-9.]/g, ''))
        : product.price;
      
      await pool.query(
        `INSERT INTO products (id, name, image_url, price, url, description, gallery, category) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          product.id,
          product.name,
          product.imageUrl,
          price,
          product.url,
          product.description,
          product.gallery,
          product.category,
        ]
      );
    }
    console.log(`Migrated ${PRODUCTS_DATA.length} products`);

    for (const [blogId, comments] of Object.entries(COMMENTS_DATA)) {
      for (const comment of comments) {
        let commentDate = comment.date;
        if (typeof commentDate === 'string') {
          const daysAgoMatch = commentDate.match(/(\d+) days? ago/);
          if (daysAgoMatch) {
            const daysAgo = parseInt(daysAgoMatch[1]);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            commentDate = date.toISOString().split('T')[0];
          } else {
            commentDate = new Date().toISOString().split('T')[0];
          }
        }
        
        await pool.query(
          `INSERT INTO comments (id, blog_post_id, author, avatar_url, date, text) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            comment.id,
            parseInt(blogId),
            comment.author,
            comment.avatarUrl,
            commentDate,
            comment.text,
          ]
        );
      }
    }
    console.log(`Migrated comments`);

    await pool.query(`SELECT setval('games_id_seq', (SELECT MAX(id) FROM games))`);
    await pool.query(`SELECT setval('blog_posts_id_seq', (SELECT MAX(id) FROM blog_posts))`);
    await pool.query(`SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))`);
    await pool.query(`SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments))`);
    console.log('Reset sequences');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
