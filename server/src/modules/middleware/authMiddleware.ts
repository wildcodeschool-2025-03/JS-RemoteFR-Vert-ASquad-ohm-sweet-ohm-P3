import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

const verifyToken: RequestHandler = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.sendStatus(401);
      return;
    }

    req.auth = jwt.verify(
      token,
      process.env.APP_SECRET as string,
    ) as JwtPayload;
    next();
  } catch (err) {
    console.error("Token invalide :", err);
    res.sendStatus(401);
  }
};

export default { verifyToken };
