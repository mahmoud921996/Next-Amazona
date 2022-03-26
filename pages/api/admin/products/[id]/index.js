import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../../../lib/data";

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
      const product = await db
        .collection("data")
        .findOne({ _id: ObjectId(id) });
      client.close();
      res.status(201).send({ product });
    } catch (error) {
      client.close();
      res.status(422).json({ message: "Failed to find order" });
      return;
    }

    // res.status(201).json({ message: "order fetched" });
  }

  if (req.method === "PUT") {
    const client = await connectToDatabase();
    const db = client.db();
    const id = req.query.id;
    if (!session && !session.user.isAdmin) {
      client.close();
      res
        .status(401)
        .json({ message: "Something went wrong , please try again" });
      return;
    }
    const product = req.body.product;
    const item = await db.collection("data").findOne({ _id: ObjectId(id) });
    if (item) {
      try {
        const result = await db.collection("data").updateOne(
          {
            _id: ObjectId(id),
          },
          {
            $set: {
              name: product.name,
              price: Number(product.price),
              slug: product.slug,
              image: product.image,
              category: product.category,
              countInStock: product.countInStock,
              brand: product.brand,
              description: product.description,
            },
          }
        );
        console.log(result);
        client.close();
        res.status(201).json({ message: "Product Updated successfully" });
      } catch (error) {
        client.close();
        res.status(422).json({ message: "Failed payment" });
      }
    }
  }

  if (req.method === "DELETE") {
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
      await db.collection("data").deleteOne({ _id: ObjectId(id) });
      client.close();
      res.status(201).json({ message: "Deleted" });
    } catch (error) {
      client.close();
      res.status(422).json({ message: "Failed to Delete item" });
    }
  }
}
export default handler;
