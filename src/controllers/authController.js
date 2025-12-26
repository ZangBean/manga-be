const authService = require('@/services/authService')

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { token, user } = await authService.login(email, password)

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false, // localhost bắt buộc false
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    res.json({ user })
  } catch (err) {
    next(err)
  }
}

exports.logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  })
  res.sendStatus(204)
}

exports.me = async (req, res) => {
  res.json({ user: req.user || null })
}
