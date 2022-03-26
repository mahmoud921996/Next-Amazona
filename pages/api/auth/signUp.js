import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/data";
async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const data = req.body;
  const { password, name, confirmPassword, email } = data;
  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7 ||
    !name ||
    name.trim().length === 0 ||
    confirmPassword !== password
  ) {
    res.status(422).json({ message: " Invalid Input" });
    return;
  }

  const client = await connectToDatabase();
  const db = client.db();
  const existingUser = await db.collection("users").findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: "Email Already Exist !!" });
    client.close();
    return;
  }
  const hashedPassword = await hashPassword(password);
  const newUser = {
    name: name,
    email: email,
    password: hashedPassword,
    isAdmin: false,
  };
  await db.collection("users").insertOne(newUser);
  res.status(201).json({ message: "Created User" });
  client.close();
}
export default handler;
