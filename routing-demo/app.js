import express from "express";
import ExpressError from "./expressError";
import middleware from "./middleware";
import userRoutes from "./routes";

/** Demo app for routing. */

const app = express();

app.use(express.json());

// this applies to all requests at all paths
app.use(middleware.logger);
// end middleware.logger

//  apply a prefix to every route in userRoutes
app.use("/users", userRoutes);
// end userRoutes

// route handler with middleware
app.get("/hello/:name", middleware.onlyAllowElie, function (req, res, next) {
  return res.send("Hello " + req.params.name);
});

// 404 handler
app.use(function (req, res) {
  return new ExpressError("Not Found", 404);
});

// generic error handler
app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;

  // set the status and alert the user
  return res.status(status).json({
    error: {
      message: err.message,
      status: status,
    },
  });
});
// end generic handler
app.listen(3300, function () {
  console.log("Server is listening on port 3300");
});
// end app.listen
