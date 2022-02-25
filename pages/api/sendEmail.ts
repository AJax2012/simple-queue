import { NextApiRequest, NextApiResponse } from "next";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.NEXT_SENDGRID_API_KEY!);

const sendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: { message: "Not allowed" },
    });
  }

  const { body } = req;

  const msg = {
    to: body.to,
    from: "janette.ruiz@du.edu",
    subject: body.subject,
    text: body.message,
  };

  sgMail.send(msg).catch((error) => {
    console.error(error);
  });

  res.end();
};

export default sendEmail;
