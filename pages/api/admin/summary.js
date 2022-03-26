import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../lib/data";

async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "GET") {
    const client = await connectToDatabase();
    const db = client.db();

    if (!session && !session.user.isAdmin) {
      client.close();
      res
        .status(401)
        .json({ message: "Something went wrong , please try again" });
      return;
    }
    const ordersCount = await db.collection("orders").countDocuments();
    const usersCount = await db.collection("users").countDocuments();
    const productsCount = await db.collection("data").countDocuments();
    const ordersPriceGroup = await db
      .collection("orders")
      .aggregate([
        {
          $group: {
            _id: null,
            sales: { $sum: "$totalPrice" },
          },
        },
      ])
      .toArray();
    const ordersPrice =
      ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

    await db.collection("orders").aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    res
      .status(201)
      .json({ ordersCount, usersCount, productsCount, ordersPrice });
  }
}
export default handler;
