import type { RequestHandler } from "express";
import userRepository from "../modules/user/userRepository";

const connected: RequestHandler = async (req, res) => {
  if (!req.auth || typeof req.auth.sub !== "string") {
    res.sendStatus(401);
    return;
  }
  try {
    const userId = Number.parseInt(req.auth.sub, 10);
    const user = await userRepository.read(userId);

    if (!user) {
      res.sendStatus(404);
      return;
    }

    const { hashed_password, ...userWithoutHashedPassword } = user;
    res.json({ user: userWithoutHashedPassword });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export default { connected };
