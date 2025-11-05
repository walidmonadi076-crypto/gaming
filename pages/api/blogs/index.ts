import type { NextApiRequest, NextApiResponse } from 'next';
import { getDbClient } from '../../../db';
import type { BlogPost } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogPost[] | { error: string }>
) {
  const client = await getDbClient();

  try {
    const result = await client.query(
      'SELECT id, title, summary, image_url as "imageUrl", video_url as "videoUrl", author, publish_date as "publishDate", rating, affiliate_url as "affiliateUrl", content, category FROM blog_posts ORDER BY id'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
}
