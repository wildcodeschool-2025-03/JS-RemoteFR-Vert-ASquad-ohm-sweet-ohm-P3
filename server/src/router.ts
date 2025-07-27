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
router.post("/api/login", authActions.login);
router.post("/api/users", authActions.hashPassword, userActions.add);

import terminalAction from "./modules/terminal/terminalAction";

router.get("/api/terminals", terminalAction.browse);
router.get("/api/terminals/:id", terminalAction.read);

import brandAction from "./modules/vehicle/brand/brandAction";

router.get("/api/brands", brandAction.browse);

import templateAction from "./modules/vehicle/template/templateAction";

router.get("/api/brands/:brandId/templates", templateAction.browse);

import { validateBooking } from "./modules/middleware/bookingValidation";

import bookingActions from "./modules/booking/bookingActions";

router.get("/api/bookings", bookingActions.browse);
router.post("/api/bookings", validateBooking, bookingActions.add);

import formAction from "./modules/form/formAction";

router.post("/api/contactForm", formAction.sendMail);

import informationAction from "./modules/information/informationAction";
router.get("/api/information/:id", informationAction.read);
router.get("/api/information/", informationAction.browse);

/* A activer lors de la mise en place de la page Admin

 router.put("/api/information/:id", informationAction.edit);
router.post("/api/information", informationAction.add);
router.delete("/api/information/:id", informationAction.destroy); */

import newsAction from "./modules/news/newsAction";

router.get("/api/news/", newsAction.browse);
router.get("/api/news/:id", newsAction.read);

/*A activer lors de la mise en place de la page Admin

router.put("/api/news/:id", newsAction.edit);
router.post("/api/news/", newsAction.add);
router.delete("/api/news/:id", newsAction.destroy); */
export default router;
