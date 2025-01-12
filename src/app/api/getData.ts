import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  env: any,
  res: NextApiResponse
) {
  try {
    const query =
      "SELECT id, timestamp, voltage, humidity, temperature, inverter_status FROM your_table_name";
    const data = await env.store.prepare(query).all();

    res.status(200).json(data.results);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
