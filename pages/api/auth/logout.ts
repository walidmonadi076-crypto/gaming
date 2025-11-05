import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', `admin_auth=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict`);
  return res.status(200).json({ success: true });
}
