import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  if (password === ADMIN_PASSWORD) {
    res.setHeader('Set-Cookie', `admin_auth=true; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`);
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
  }
}
