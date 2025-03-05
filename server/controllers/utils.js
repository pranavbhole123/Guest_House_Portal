import { sendVerificationEmail } from "../utils.js";

export async function sendMail(req, res) {
  const { to, subject, body } = req.body;
  try {
    await sendVerificationEmail(to, subject, body);
    res.status(200).json({ message: "Request received" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
