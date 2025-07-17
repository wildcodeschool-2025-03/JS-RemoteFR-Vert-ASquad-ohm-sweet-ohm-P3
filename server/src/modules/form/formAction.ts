import nodemailer from "nodemailer";
import "dotenv/config";
import type { NextFunction, Request, Response } from "express";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { objet, email, nom, prenom, message } = req.body;

    const mailOptions = {
      from: email,
      to: process.env.SMTP_USER,
      subject: `Formulaire de contact : ${objet}`,
      html: `
        <p>Nom : ${nom}</p>
        <p>Prénom : ${prenom}</p>
        <p>Email : ${email}</p>
        <p>Message : ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "E-mail envoyé avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    next(error);
  }
};

export default { sendMail };
