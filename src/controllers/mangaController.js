import {
  getAllMangas as getAllMangasService,
  getMangaById as getMangaByIdService,
  getTopViews as getTopViewsService,
  getLatestUpdatedMangas as getLatestUpdatedMangasService,
  getRandomMangas as getRandomMangasService,
  getAllMangasPaginated as getAllMangasPaginatedService,
  getMangasByUploader as getMangasByUploaderService,
  createMangaService,
  updateMangaService,
  deleteMangaService,
} from '../services/mangaService.js'

const ok = (res, data, extra = {}) =>
  res.json({ success: true, data, ...extra })

const created = (res, data) => res.status(201).json({ success: true, data })

const notFound = (res, message = 'Not found') =>
  res.status(404).json({ success: false, message })

/* ===================== QUERY ===================== */

export const getAllMangas = async (req, res, next) => {
  try {
    const mangas = await getAllMangasService()
    ok(res, mangas)
  } catch (err) {
    next(err)
  }
}

export const getMangaById = async (req, res, next) => {
  try {
    const manga = await getMangaByIdService(req.params.id)
    if (!manga) return notFound(res, 'Manga not found')
    ok(res, manga)
  } catch (err) {
    next(err)
  }
}

export const getTopViews = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10
    const mangas = await getTopViewsService(limit)
    ok(res, mangas)
  } catch (err) {
    next(err)
  }
}

export const getLatestUpdatedMangas = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10
    const mangas = await getLatestUpdatedMangasService(limit)
    ok(res, mangas)
  } catch (err) {
    next(err)
  }
}

export const getRandomMangas = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 5
    const mangas = await getRandomMangasService(limit)
    ok(res, mangas)
  } catch (err) {
    next(err)
  }
}

export const getAllMangasPaginated = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const { mangas, pagination } = await getAllMangasPaginatedService(
      page,
      limit
    )
    ok(res, mangas, { pagination })
  } catch (err) {
    next(err)
  }
}

export const getMyMangas = async (req, res, next) => {
  try {
    const mangas = await getMangasByUploaderService(req.user.id)
    ok(res, mangas)
  } catch (err) {
    next(err)
  }
}

/* ===================== MUTATION ===================== */

export const createManga = async (req, res, next) => {
  try {
    const mangaData = {
      ...req.body,
      uploaderId: req.user.id,
    }

    const createdManga = await createMangaService(mangaData, req.file)
    created(res, createdManga)
  } catch (err) {
    next(err)
  }
}

export const updateManga = async (req, res, next) => {
  try {
    const mangaId = req.params.id
    const updateData = { ...req.body }

    const updatedManga = await updateMangaService(
      mangaId,
      updateData,
      req.file,
      req.user.id
    )

    ok(res, updatedManga)
  } catch (err) {
    if (err.message?.includes('không tồn tại')) {
      return notFound(res, err.message)
    }
    if (err.message?.includes('quyền')) {
      return res.status(403).json({ success: false, message: err.message })
    }
    next(err)
  }
}

export const deleteManga = async (req, res, next) => {
  try {
    const mangaId = req.params.id
    const result = await deleteMangaService(mangaId, req.user.id)

    ok(res, null, {
      message: 'Manga và tất cả dữ liệu liên quan đã được xóa thành công',
      deletedChapters: result.deletedChapters,
      deletedImages: result.deletedImages,
    })
  } catch (err) {
    if (err.message === 'Manga không tồn tại') {
      return notFound(res, err.message)
    }
    if (err.message === 'Bạn không có quyền xóa manga này') {
      return res.status(403).json({ success: false, message: err.message })
    }
    console.error('Lỗi khi xóa manga:', err)
    next(err)
  }
}
