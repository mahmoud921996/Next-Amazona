import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../lib/data";

async function handler(req, res) {
  if (req.method === "GET") {
    const client = await connectToDatabase();
    const session = await getSession({ req });
    if (!session && !session.user.isAdmin) {
      client.close();
      res
        .status(401)
        .json({ message: "Something went wrong , please try again" });
      return;
    }
    const items = await client
      .db()
      .collection("orders")
      .aggregate([
        {
          $lookup: {
            //searching collection name
            from: "users",
            //setting variable [searchId] where your string converted to ObjectId
            let: { searchId: { $toObjectId: "$userId" } },
            //search query with our [searchId] value
            pipeline: [
              //searching [searchId] value equals your field [_id]
              //   { $match: { $expr: [{ _id: "$$searchId" }] } },
              { $match: { $expr: { $eq: ["$_id", "$$searchId"] } } },
              //projecting only fields you reaaly need, otherwise you will store all - huge data loads
              { $project: { name: 1 } },
            ],

            as: "user",
          },
        },
      ])
      .toArray();
    client.close();
    res.status(201).json({ message: "Data fetched correctly", orders: items });
  }
}
export default handler;
