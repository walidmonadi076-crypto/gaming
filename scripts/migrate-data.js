import { getPool } from "../lib/db.js";
import { GAMES_DATA } from "../data/games.js";
import { BLOGS_DATA, COMMENTS_DATA } from "../data/blogs.js";
import { PRODUCTS_DATA } from "../data/products.js";

async function migrateData() {
const pool = getPool();

try {
console.log("🚀 Starting data migration...");

```
// 🕹️ Insert Games
for (const game of GAMES_DATA) {
  await pool.query(
    `INSERT INTO games (id,title, image_url, category, tags, theme, description, video_url, download_url, gallery)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT DO NOTHING`,
    [
      game.id,
      game.title,
      game.imageUrl,
      game.category,
      game.tags || [],
      game.theme,
      game.description,
      game.videoUrl || null,
      game.downloadUrl || null,
      game.gallery || [],
    ]
  );

console.log(`✅ Inserted ${GAMES_DATA.length} games`);

// 📰 Insert Blogs
for (const blog of BLOGS_DATA) {
  await pool.query(
    `INSERT INTO blog_posts (title, summary, image_url, video_url, author, publish_date, rating, affiliate_url, content, category)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     ON CONFLICT (id) DO NOTHING`,
    [
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

  // 📋 Insert Comments for each blog (if exist)
  const comments = COMMENTS_DATA[blog.id];
  if (comments) {
    for (const c of comments) {
      await pool.query(
        `INSERT INTO comments (blog_id, author, avatar_url, date, text)
         VALUES ((SELECT id FROM blog_posts WHERE title = $1 LIMIT 1), $2,$3,$4,$5)
         ON CONFLICT (id) DO NOTHING`,
        [blog.title, c.author, c.avatarUrl, c.date, c.text]
      );
    }
  }
}
console.log(`✅ Inserted ${BLOGS_DATA.length} blogs + comments`);

// 🛍️ Insert Products
for (const p of PRODUCTS_DATA) {
  await pool.query(
    `INSERT INTO products (name, image_url, price, url, description, gallery, category)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (id) DO NOTHING`,
    [
      p.name,
      p.imageUrl,
      p.price,
      p.url,
      p.description,
      p.gallery || [],
      p.category,
    ]
  );
}
console.log(`✅ Inserted ${PRODUCTS_DATA.length} products`);

console.log("🎉 Data migration completed successfully!");
```

} catch (err) {
console.error("❌ Error during migration:", err);
} finally {
await pool.end();
}
}

migrateData();
