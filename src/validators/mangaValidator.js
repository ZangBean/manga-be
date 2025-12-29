const Joi = require('joi')

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

// exports.createMangaValidator = (data) =>
//   Joi.object({
//     ...baseFields,
//     title: baseFields.title.required(),
//   }).validate(data)

exports.updateMangaValidator = (data) =>
  Joi.object(baseFields).min(1).validate(data)
