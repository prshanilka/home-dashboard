/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    try {
      // SQL query to fetch data
      const query =
        "SELECT id, timestamp, voltage, humidity, temperature, inverter_status FROM your_table_name";

      // Execute query using Cloudflare D1
      const data = await env.DATABASE.prepare(query).all();

      // Return the results as JSON
      return new Response(JSON.stringify(data.results), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching data:", error);

      // Return an error response
      return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
