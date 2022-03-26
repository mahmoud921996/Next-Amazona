import { connectToDatabase } from "../../../lib/data";

async function handler(req, res) {
  if (req.method === "GET") {
    const client = await connectToDatabase();
    const db = client.db();
    try {
      const result = await db.collection("data");
      client.close();
      res.status(201).json({ message: "Data inserted", data: result });
    } catch (error) {
      client.close();
      res.status(422).json({ message: "Failed to post Data" });
    }
  }
}
export default handler;
