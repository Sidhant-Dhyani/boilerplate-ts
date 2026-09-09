import { NextFunction, Request, Response } from "express";
import { z } from "zod";

type RequestSchema = z.ZodType<{
  body?: unknown;
  query?: unknown;
  params?: unknown;
}>;

export const validate =
  (schema: RequestSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (parsed.body !== undefined) {
      req.body = parsed.body;
    }
    next();
  };
