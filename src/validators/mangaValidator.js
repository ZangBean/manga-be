const Joi = require('joi')

const createMangaValidator = (data) => {
  const schema = Joi.object({
    title: Joi.string().max(255).required(),
    description: Joi.string().allow('', null),
    coverImageUrl: Joi.string().uri().max(255).allow('', null),
    viewCount: Joi.number().integer().min(0).optional(),
    likeCount: Joi.number().integer().min(0).optional(),
    status: Joi.string().valid('ongoing', 'completed', 'hiatus').optional(),
    releaseDate: Joi.date().optional(),
    author: Joi.string().max(255).allow('', null),
    uploaderId: Joi.string().required(),
  })

  return schema.validate(data)
}

const updateMangaValidator = (data) => {
  const schema = Joi.object({
    title: Joi.string().max(255).optional(),
    description: Joi.string().allow('', null).optional(),
    coverImageUrl: Joi.string().uri().max(255).allow('', null).optional(),
    viewCount: Joi.number().integer().min(0).optional(),
    likeCount: Joi.number().integer().min(0).optional(),
    status: Joi.string().valid('ongoing', 'completed', 'hiatus').optional(),
    releaseDate: Joi.date().optional(),
    author: Joi.string().max(255).allow('', null).optional(),
  })

  return schema.validate(data)
}

module.exports = {
  createMangaValidator,
  updateMangaValidator,
}
