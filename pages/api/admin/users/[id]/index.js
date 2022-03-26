import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../lib/data";
import { getSession } from "next-auth/react";

async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "GET") {
    let client;

    try {
      client = await connectToDatabase();
    } catch (err) {
      res.status(500).json({ message: "failed to connect to DB" });
      return;
    }
    if (!session && !session.user.isAdmin) {
      client.close();
      res
        .status(401)
        .json({ message: "Something went wrong , please try again" });
      return;
    }
    const db = client.db();
    const id = req.query.id;

    try {
      const user = await db.collection("users").findOne({ _id: ObjectId(id) });
      client.close();
      res.status(201).send({ user });
    } catch (error) {
      client.close();
      res.status(422).json({ message: "Failed to find user" });
      return;
    }

    res.status(201).json({ message: "user  fetched" });
  }

  if (req.method === "PUT") {
    const client = await connectToDatabase();
    const db = client.db();
    const id = req.query.id;
    const name = req.body.name;
    if (!session && !session.user.isAdmin) {
      client.close();
      res
        .status(401)
        .json({ message: "Something went wrong , please try again" });
      return;
    }

    const isAdmin = req.body.isAdmin;

    const item = await db.collection("users").findOne({ _id: ObjectId(id) });
    if (item) {
      try {
        const result = await db.collection("users").updateOne(
          {
            _id: ObjectId(id),
          },
          {
            $set: {
              name,
              isAdmin,
            },
          }
        );
        client.close();
        res.status(201).json({ message: "User Updated successfully" });
      } catch (error) {
        client.close();
        res.status(422).json({ message: "Failed To update User" });
      }
    }
  }

  if (req.method === "DELETE") {
    let client;
    if (!session && !session.user.isAdmin) {
      client.close();
      res
        .status(401)
        .json({ message: "Something went wrong , please try again" });
      return;
    }
    try {
      client = await connectToDatabase();
    } catch (err) {
      res.status(500).json({ message: "failed to connect to DB" });
      return;
    }
    const db = client.db();
    const id = req.query.id;

    try {
      await db.collection("users").deleteOne({ _id: ObjectId(id) });
      client.close();
      res.status(201).json({ message: "Deleted" });
    } catch (error) {
      client.close();
      res.status(422).json({ message: "Failed to Delete item" });
    }
  }
}
export default handler;
