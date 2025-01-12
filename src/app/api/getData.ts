import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await import("@cloudflare/workers-d1");
    const { Database } = db;

    const dbInstance = new Database("your-d1-instance-name");
    const query =
      "SELECT id, timestamp, voltage, humidity, temperature, inverter_status FROM your_table_name";
    const data = await dbInstance.prepare(query).all();

    res.status(200).json(data.results);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
