import ExpressError from "./expressError";

function logger(req, res, next) {
  console.log(`Sending ${req.method} request to ${req.path}.`);
  return next();
}

function onlyAllowElie(req, res, next) {
  try {
    if (req.params.name === "Elie") {
      return next();
    } else {
      throw new ExpressError("Unauthorized", 401);
    }
  } catch (err) {
    return next(err);
  }
}

export { logger, onlyAllowElie };
