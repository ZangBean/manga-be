import Joi from 'joi'

export const createChapterValidator = (data) =>
  Joi.object({
    chapterNumber: Joi.number().positive().required(),
    title: Joi.string().max(255).allow('', null).optional(),
  }).validate(data)

