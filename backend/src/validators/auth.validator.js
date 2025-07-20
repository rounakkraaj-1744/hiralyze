import Joi from "joi"
import { ApiError } from "../utils/apiError.js"

const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("candidate", "recruiter").default("candidate"),
    phone: Joi.string().optional(),
  })

  const { error } = schema.validate(req.body)
  if (error) {
    throw new ApiError(400, error.details[0].message)
  }

  next()
}

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })

  const { error } = schema.validate(req.body)
  if (error) {
    throw new ApiError(400, error.details[0].message)
  }

  next()
}

export {validateRegistration, validateLogin}