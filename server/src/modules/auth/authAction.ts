import type { RequestHandler } from "express";

import argon2 from "argon2";
import jwt from "jsonwebtoken";

import type { JwtPayload } from "jsonwebtoken";

import userRepository from "../user/userRepository";

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  hashed_password: string;
  role_id: number;
  profile_pic: string;
};
type UserUpdate = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  birthdate: string;
  hashed_password: string;
  car_brand: string;
  car_template: string;
  car_socket: string;
  role_id: number;
  profile_pic: string;
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const user = await userRepository.readByEmailWithPassword(req.body.email);

    if (!user) {
      res.sendStatus(401);
      return;
    }

    const verified = await argon2.verify(
      user.hashed_password,
      req.body.password,
    );

    if (verified) {
      const { hashed_password, ...userWithoutHashedPassword } = user;
      const myPayload: JwtPayload = {
        sub: user.id.toString(),
      };

      const token = jwt.sign(myPayload, process.env.APP_SECRET as string, {
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });

      res.status(200).json({ user: userWithoutHashedPassword });
    }
  } catch (err) {
    next(err);
  }
};

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};

const hashPassword: RequestHandler = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await argon2.hash(password, hashingOptions);

    req.body.hashed_password = hashedPassword;
    req.body.password = undefined;

    next();
  } catch (err) {
    next(err);
  }
};

const logout: RequestHandler = (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  res.sendStatus(200);
};

export default { login, hashPassword, logout };
