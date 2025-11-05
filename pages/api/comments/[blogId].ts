import type { NextApiRequest, NextApiResponse } from 'next';
import { getDbClient } from '../../../db';
import type { Comment } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Comment[] | { error: string }>
) {
  const { blogId } = req.query;
  const client = await getDbClient();

  try {
    const result = await client.query(
      'SELECT id, author, avatar_url as "avatarUrl", date, text FROM comments WHERE blog_post_id = $1 ORDER BY id',
      [blogId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
}
