import { login as loginService } from '../services/authService.js'

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { token, user } = await loginService(email, password)

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false, // localhost
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    res.json({ user })
  } catch (err) {
    next(err)
  }
}

export const logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  })
  res.sendStatus(204)
}

export const me = async (req, res) => {
  res.json({ user: req.user || null })
}
