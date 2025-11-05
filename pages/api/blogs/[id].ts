import type { NextApiRequest, NextApiResponse } from 'next';
import { getDbClient } from '../../../db';
import type { BlogPost } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogPost | { message: string } | { error: string }>
) {
  const { id } = req.query;
  const client = await getDbClient();

  try {
    const result = await client.query(
      'SELECT id, title, summary, image_url as "imageUrl", video_url as "videoUrl", author, publish_date as "publishDate", rating, affiliate_url as "affiliateUrl", content, category FROM blog_posts WHERE id = $1',
      [id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
}
