import { Request, Response, NextFunction } from 'express'
import { ZodType } from 'zod'

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      })
    }

    // overwrite req.body with the parsed & typed data
    req.body = result.data
    next()
  }
}