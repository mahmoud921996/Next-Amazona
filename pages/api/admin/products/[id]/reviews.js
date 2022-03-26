import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../../../lib/data";

async function handler(req, res) {
  if (req.method === "GET") {
    const client = await connectToDatabase();
    const db = client.db();
    const id = req.query.id;

    const product = await db.collection("data").findOne({ _id: ObjectId(id) });
    if (product) {
      client.close();
      res.status(201).json({ message: "Fetched ", product });
    } else {
      client.close();
      res.status(404).json({ message: "Product not found" });
    }
  }

  if (req.method === "POST") {
    const client = await connectToDatabase();
    const db = client.db();
    const id = req.query.id;
    const session = await getSession({ req });
    const userId = session.user.id;
    const rating = req.body.rating;

    const comment = req.body.comment;
    const createdAt = Date.now();

    const product = await db.collection("data").findOne({ _id: ObjectId(id) });
    if (product) {
      const existReview = product.reviews.find(x => x.user == userId);
      if (existReview) {
       await db.collection("data").updateOne(
          { _id: ObjectId(req.query.id), "reviews.user": existReview.user },
          {
            $set: {
              "reviews.$.comment": comment,
              "reviews.$.rating": Number(rating),
              "reviews.$.createdAt": createdAt,
            },
          }
        );
      
        const updatedProduct = await db
          .collection("data")
          .findOne({ _id: ObjectId(id) });
        const numReviews = updatedProduct.reviews.length;
        const updateRating =
          updatedProduct.reviews.reduce((a, c) => c.rating + a, 0) /
          updatedProduct.reviews.length;
        await db.collection("data").updateOne(
          { _id: ObjectId(req.query.id) },
          {
            $set: {
              numReviews: numReviews,
              rating: Number(updateRating),
            },
          }
        );
        client.close();
        return res.send({ message: "Review updated" });
      } else {
        const review = {
          user: ObjectId(userId),
          name: session.user.name,
          rating: Number(rating),
          comment: comment,
          createdAt: createdAt,
        };

        await db.collection("data").updateOne(
          { _id: ObjectId(req.query.id) },
          {
            $push: { reviews: review },
          }
        );
        const item = await db.collection("data").findOne({ _id: ObjectId(id) });
        const numReviews = item.reviews.length;
        const Prodrating =
          item.reviews.reduce((a, c) => c.rating + a, 0) / item.reviews.length;

        await db.collection("data").updateOne(
          { _id: ObjectId(id) },
          {
            $set: {
              numReviews,
              rating: Prodrating,
            },
          }
        );

        client.close();
        res.status(201).send({
          message: "Review submitted",
        });
      }
    } else {
      client.close();
      res.status(404).send({ message: "Product Not Found" });
    }
  }
}
export default handler;
