const validateRequest = (validator) => (req, res, next) => {
  const { error } = validator(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }
  next()
}

export default validateRequest
