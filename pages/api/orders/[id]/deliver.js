import { connectToDatabase } from "../../../../lib/data";
import { ObjectId } from "mongodb";

async function handler(req, res) {
  if (req.method === "PATCH") {
    const client = await connectToDatabase();

    const db = client.db();
    const id = req.query.id;
    const order = await db.collection("orders").findOne({ _id: ObjectId(id) });
    if (order) {
      try {
        await db.collection("orders").updateOne(
          {
            _id: ObjectId(id),
          },
          {
            $set: {
              isdelivered: true,
              deliveredAt: Date.now(),
            },
          }
        );
        client.close();
        res.status(201).json({ message: "Done!!" });
      } catch (error) {
        client.close();
        res.status(422).json({ message: "Failed payment" });
      }
    }
  }
}

export default handler;
