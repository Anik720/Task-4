import { Request, Response, NextFunction } from 'express'
import { RequestHandler } from 'express-serve-static-core'
export const catchAsync =
  (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (err) {
      next(err)
    }
  }
