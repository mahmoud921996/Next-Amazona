// import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../../lib/data";

async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "GET") {
    const client = await connectToDatabase();

    if (!session && !session.user.isAdmin) {
      client.close();
      res
        .status(401)
        .json({ message: "Something went wrong , please try again" });
      return;
    }
    const items = await client.db().collection("users").find().toArray();
    client.close();
    res.status(201).json({ message: "Data fetched correctly", users: items });
  }
}

export default handler;
