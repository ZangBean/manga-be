import Joi from 'joi'

const baseFields = {
  title: Joi.string().max(255),
  description: Joi.string().allow('', null),
  coverImageUrl: Joi.string().uri().max(255).allow('', null),
  viewCount: Joi.number().integer().min(0),
  likeCount: Joi.number().integer().min(0),
  status: Joi.string().valid('ongoing', 'completed', 'hiatus'),
  releaseDate: Joi.date(),
  author: Joi.string().max(255).allow('', null),
  translationGroup: Joi.string().max(255).allow('', null),
}

export const createMangaValidator = (data) =>
  Joi.object({
    ...baseFields,
    title: baseFields.title.required(),
  }).validate(data)

export const updateMangaValidator = (data) =>
  Joi.object(baseFields).min(1).validate(data)
