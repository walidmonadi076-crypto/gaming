import type { NextApiRequest, NextApiResponse } from 'next';
import { getDbClient } from '../../../db';
import type { Game } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | { message: string } | { error: string }>
) {
  const { id } = req.query;
  const client = await getDbClient();

  try {
    const result = await client.query(
      'SELECT id, title, image_url as "imageUrl", category, tags, theme, description, video_url as "videoUrl", download_url as "downloadUrl", gallery FROM games WHERE id = $1',
      [id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
}
