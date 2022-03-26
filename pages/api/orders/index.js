import { connectToDatabase } from "../../../lib/data";
async function handler(req, res) {
  if (req.method === "POST") {
    const order = req.body;
    const client = await connectToDatabase();
    const db = client.db();

    try {
      const result = await db.collection("orders").insertOne({ ...order });
      order.id = result.insertedId;
    } catch (error) {
      client.close();
      res.status(422).json({ message: "Failed to make order" });
      return;
    }
    client.close();
    res.status(201).json({ message: "Created order", order: order });
  }
}

export default handler;
