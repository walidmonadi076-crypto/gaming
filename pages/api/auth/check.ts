import type { NextApiRequest, NextApiResponse } from 'next';

export function isAuthenticated(req: NextApiRequest): boolean {
  const cookies = req.headers.cookie || '';
  return cookies.includes('admin_auth=true');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authenticated = isAuthenticated(req);
  return res.status(200).json({ authenticated });
}
