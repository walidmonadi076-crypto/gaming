import type { NextApiRequest, NextApiResponse } from "next";
import { testConnection } from "../../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await testConnection();
    res.status(200).json({ success: true, time: result.now }); //  JSON صافي بلا رموز
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
}
