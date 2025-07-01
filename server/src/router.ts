import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";
import reviewActions from "./modules/review/review/reviewActions";

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

/* ************************************************************************* */

router.get("/api/review", reviewActions.browse);
router.get("/api/review/:id", reviewActions.read);

/* ************************************************************************* */

import authActions from "./modules/auth/authAction";
import userActions from "./modules/user/userActions";

router.get("/api/users", userActions.browse);
router.post("/api/users", authActions.hashPassword, userActions.add);

export default router;
