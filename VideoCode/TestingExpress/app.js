import express from "express";
import ExpressError from "./expressError";
import catsRoutes from "./routes/cats";

const app = express();

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
