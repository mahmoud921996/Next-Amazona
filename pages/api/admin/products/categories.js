import { connectToDatabase } from "../../../../lib/data";

async function handler(req, res) {
  if (req.method === "GET") {
    const client = await connectToDatabase();
    const db = client.db();
    try {
      const categories = await db.collection("data").distinct("category");
      client.close();
      res.status(201).json({ message: "All Category fetched", categories });
    } catch (err) {
      client.close();
      res.status(422).json({ message: "No Category found" });
    }
  }
}

export default handler;
