import express from "express";
import morgan from "morgan";
import ExpressError from "./expressError.js";
import catsRoutes from "./routes/cats.js";

const app = express();

// On Request Middleware

// Define a custom format named 'test'
morgan.format("test", ":method :url :status");

// Configure morgan with different formats based on the environment
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev")); // Use the 'dev' format for non-test environments
} else {
  app.use(morgan("test")); // Use the custom 'test' format for testing
}

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
