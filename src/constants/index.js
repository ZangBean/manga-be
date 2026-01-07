export const MANGA_STATUS = {
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  HIATUS: 'hiatus',
}

export const USER_ROLES = {
  ADMIN: 'admin',
  UPLOADER: 'uploader',
  USER: 'user',
}

export const ROLE_HIERARCHY = {
  admin: ['user', 'uploader', 'admin'],
  uploader: ['user', 'uploader'],
  user: ['user'],
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
}

export const MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not found',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_INPUT: 'Invalid input data',
  DUPLICATE_ENTRY: 'Duplicate entry',
}
