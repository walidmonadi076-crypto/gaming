import type { NextApiRequest, NextApiResponse } from 'next';
import { getDbClient } from '../../../db';
import type { Product } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[] | { error: string }>
) {
  const client = await getDbClient();

  try {
    const result = await client.query(
      'SELECT id, name, image_url as "imageUrl", price, url, description, gallery, category FROM products ORDER BY id'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  } finally {
    client.release();
  }
}
