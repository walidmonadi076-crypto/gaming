import type { NextApiRequest, NextApiResponse } from 'next';
import { getDbClient } from '../../../db';
import type { Game } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game[] | { error: string }>
) {
  const client = await getDbClient();

  try {
    const result = await client.query(
      'SELECT id, title, image_url as "imageUrl", category, tags, theme, description, video_url as "videoUrl", download_url as "downloadUrl", gallery FROM games ORDER BY id'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
}
