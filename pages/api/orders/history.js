import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../lib/data";
async function handler(req, res) {
  if (req.method !== "GET") {
    return;
  }
  const client = await connectToDatabase();
  const db = client.db();
  const session = await getSession({ req });
  const id = session.user.id;

  // let ordersInfo = [];
  try {
    const ordersInfo = await db
      .collection("orders")
      .find({ userId: id })
      .toArray();
    // .forEach(order => {
    //   ordersInfo.push(order);
    // });

    client.close();
    res.status(201).json({
      message: "Successful stored message !",
      ordersInfo,
    });
  } catch (error) {
    client.close();
    res.status(422).json({ message: "No Orders" });
  }
}
export default handler;
