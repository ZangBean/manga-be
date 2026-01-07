import Joi from 'joi'

const baseFields = {
  name: Joi.string().trim().max(100),
  description: Joi.string().allow('', null),
}

export const createGenreValidator = (data) =>
  Joi.object({
    ...baseFields,
    name: baseFields.name.required(),
  }).validate(data)

export const updateGenreValidator = (data) =>
  Joi.object(baseFields).min(1).validate(data)

