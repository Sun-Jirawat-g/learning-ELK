import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { requestContext, logger } from "./logger";

export function tracingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const traceId = randomUUID();
  const start = Date.now();

  requestContext.run({ traceId }, () => {
    res.on("finish", () => {
      logger.info({
        type: "request",
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration_ms: Date.now() - start,
      });
    });
    next();
  });
}
