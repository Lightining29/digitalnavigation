import { validationResult } from 'express-validator';

// Runs express-validator checks; returns 422 with the first error message.
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const first = errors.array()[0];
  return res.status(422).json({ error: first.msg });
}

export default validate;
