import type { NextApiRequest, NextApiResponse } from 'next';

const AIRBNB_API_URL = "https://api.airbnb.com/v2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const response = await fetch(`${AIRBNB_API_URL}/listings`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Airbnb-API-Key": process.env.AIRBNB_CLIENT_ID!,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}