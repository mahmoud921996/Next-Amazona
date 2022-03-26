import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../lib/data";

async function handler(req, res) {
  if (req.method === "GET") {
    let client;
    try {
      client = await connectToDatabase();
    } catch (err) {
      res.status(500).json({ message: "failed to connect to DB" });
      return;
    }
    const db = client.db();
    const id = req.query.id;

    try {
      const userOrder = await db
        .collection("orders")
        .findOne({ _id: ObjectId(id) });
      client.close();
      res.status(201).send({ data: userOrder });
    } catch (error) {
      client.close();
      res.status(422).json({ message: "Failed to find order" });
      return;
    }

    // res.status(201).json({ message: "order fetched" });
  }
}

export default handler;
