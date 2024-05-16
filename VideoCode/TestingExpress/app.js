import express from "express";
import morgan from "morgan";
import ExpressError from "./expressError.js";
import catsRoutes from "./routes/cats.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/cats", catsRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  return new ExpressError("Not Found", 404);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.message,
  });
});

export default app;
