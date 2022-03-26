// import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../../lib/data";

async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "POST") {
    const client = await connectToDatabase();
    const db = client.db();
    if (!session && !session.user.isAdmin) {
      client.close();
      res
        .status(401)
        .json({ message: "Something went wrong , please try again" });
      return;
    }
    const product = req.body.product;
    const item = {
      name: product.name,
      price: Number(product.price),
      slug: product.slug,
      image: product.image,
      category: product.category,
      countInStock: Number(product.countInStock),
      brand: product.brand,
      description: product.description,
      reviews: [],
    };
    await db.collection("data").insertOne(item);
    client.close();
    res.status(201).json({ message: "New Product Created Successfully" });
  }

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

    const items = await client.db().collection("data").find().toArray();
    client.close();
    res
      .status(201)
      .json({ message: "Data fetched correctly", products: items });
  }
}

export default handler;
