import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGO_URL);
  return client;
}

export async function getAllProducts() {
  const client = await connectToDatabase();
  const db = client.db();
  const result = await db.collection("data");
  const data = await result.find().toArray();
  client.close();

  const products = data.map(item => ({
    id: item._id.toString(),
    name: item.name,
    slug: item.slug,
    category: item.category,
    image: item.image,
    price: item.price,
    brand: item.brand,
    rating: item.rating ? item.rating : "",
    numReviews: item.numReviews ? item.numReviews : "",
    countInStock: item.countInStock,
    description: item.description,
  }));
  return products;
}

export async function getProduct(slug) {
  const client = await connectToDatabase();
  const db = client.db();
  const item = await db.collection("data").findOne({ slug });
  client.close();

  const product = {
    id: item._id.toString(),
    name: item.name,
    slug: item.slug,
    category: item.category,
    image: item.image,
    price: item.price,
    brand: item.brand,
    rating: item.rating ? item.rating : "",
    numReviews: item.numReviews ? item.numReviews : "",
    countInStock: item.countInStock,
    description: item.description,
  };
  return product;
}
