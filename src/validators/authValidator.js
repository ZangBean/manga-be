import Joi from 'joi'

export const loginValidator = (data) =>
  Joi.object({
    email: Joi.string().email().required().max(100),
    password: Joi.string().required().min(6).max(255),
  }).validate(data)

