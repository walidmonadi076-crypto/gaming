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
      const { name, imageUrl, price, url, description, gallery, category } = req.body;
      
      const result = await client.query(
        `INSERT INTO products (name, image_url, price, url, description, gallery, category) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, imageUrl, price, url, description, gallery || [], category]
      );
      
      res.status(201).json(result.rows[0]);
    } else if (req.method === 'PUT') {
      const { id, name, imageUrl, price, url, description, gallery, category } = req.body;
      
      const result = await client.query(
        `UPDATE products 
         SET name = $1, image_url = $2, price = $3, url = $4, description = $5, gallery = $6, category = $7, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $8 RETURNING *`,
        [name, imageUrl, price, url, description, gallery || [], category, id]
      );
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      
      const result = await client.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(200).json({ message: 'Product deleted successfully' });
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
