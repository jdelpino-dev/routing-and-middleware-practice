import { Router } from "express";
import ExpressError from "../expressError.js";
import cats from "../fakeDb.js";

const router = Router();

router.get("/", function (req, res) {
  res.json({ cats });
});

router.post("/", function (req, res, next) {
  try {
    const body = req.body;
    if (!body.name) throw new ExpressError("Name is required", 400);

    body.name = body.name.trim();
    if (!body.name) throw new ExpressError("Name is required", 400);

    const newCat = { name: req.body.name };
    cats.push(newCat);
    return res.status(201).json({ cat: newCat });
  } catch (e) {
    return next(e);
  }
});

router.get("/:name", function (req, res) {
  const foundCat = cats.find((cat) => cat.name === req.params.name);
  if (foundCat === undefined) {
    throw new ExpressError("Cat not found", 404);
  }
  res.json({ cat: foundCat });
});

router.patch("/:name", function (req, res) {
  const foundCat = cats.find((cat) => cat.name === req.params.name);
  if (foundCat === undefined) {
    throw new ExpressError("Cat not found", 404);
  }
  foundCat.name = req.body.name;
  res.json({ cat: foundCat });
});

router.delete("/:name", function (req, res) {
  const foundCat = cats.findIndex((cat) => cat.name === req.params.name);
  if (foundCat === -1) {
    throw new ExpressError("Cat not found", 404);
  }
  cats.splice(foundCat, 1);
  res.json({ message: "Deleted" });
});

export default router;
