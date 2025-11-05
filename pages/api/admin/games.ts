import type { NextApiRequest, NextApiResponse } from 'next';
import { getDbClient } from '../../../db';
import { isAuthenticated } from '../auth/check';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  const client = await getDbClient();

  try {
    if (req.method === 'POST') {
      const { title, imageUrl, category, tags, theme, description, videoUrl, downloadUrl, gallery } = req.body;
      
      const result = await client.query(
        `INSERT INTO games (title, image_url, category, tags, theme, description, video_url, download_url, gallery) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [title, imageUrl, category, tags || [], theme || null, description, videoUrl || null, downloadUrl, gallery || []]
      );
      
      res.status(201).json(result.rows[0]);
    } else if (req.method === 'PUT') {
      const { id, title, imageUrl, category, tags, theme, description, videoUrl, downloadUrl, gallery } = req.body;
      
      const result = await client.query(
        `UPDATE games 
         SET title = $1, image_url = $2, category = $3, tags = $4, theme = $5, description = $6, video_url = $7, download_url = $8, gallery = $9, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $10 RETURNING *`,
        [title, imageUrl, category, tags || [], theme || null, description, videoUrl || null, downloadUrl, gallery || [], id]
      );
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Game not found' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      
      const result = await client.query('DELETE FROM games WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Game not found' });
      } else {
        res.status(200).json({ message: 'Game deleted successfully' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
}
