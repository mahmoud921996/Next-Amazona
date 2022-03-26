import { connectToDatabase } from "../../../../lib/data";
import { getSession } from "next-auth/react";
import { hashPassword, verifyPassword } from "../../../../lib/auth";

async function handler(req, res) {
  if (req.method === "PATCH") {
    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    const userEmail = session.user.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const client = await connectToDatabase();
    const useresCollection = client.db().collection("users");
    const user = await useresCollection.findOne({ email: userEmail });
    if (!user) {
      res.status(404).json({ message: "user not found" });
      client.close();
      return;
    }
    const currentPassword = user.password;
    const passwordAreEqual = await verifyPassword(oldPassword, currentPassword);
    if (!passwordAreEqual) {
      res.status(403).json({ message: "Invalid password." });
      client.close();
      return;
    }
    const hashedPassword = await hashPassword(newPassword);
    const result = await useresCollection.updateOne(
      { email: userEmail },
      { $set: { password: hashedPassword } }
    );
    client.close();
    res.status(200).json({ message: "Password updated" });
  }
}

export default handler;
