const mangaService = require('@/services/mangaService')
const { uploadImageToR2 } = require('@/services/r2UploadService')

const ok = (res, data, extra = {}) =>
  res.json({ success: true, data, ...extra })

const created = (res, data) => res.status(201).json({ success: true, data })

const notFound = (res, message = 'Not found') =>
  res.status(404).json({ success: false, message })

/* ===================== QUERY ===================== */

exports.getAllMangas = async (req, res, next) => {
  try {
    const mangas = await mangaService.getAllMangas()
    ok(res, mangas)
  } catch (err) {
    next(err)
  }
}

exports.getMangaById = async (req, res, next) => {
  try {
    const manga = await mangaService.getMangaById(req.params.id)
    if (!manga) return notFound(res, 'Manga not found')
    ok(res, manga)
  } catch (err) {
    next(err)
  }
}

exports.getTopViews = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10
    const mangas = await mangaService.getTopViews(limit)
    ok(res, mangas)
  } catch (err) {
    next(err)
  }
}

exports.getLatestUpdatedMangas = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10
    const mangas = await mangaService.getLatestUpdatedMangas(limit)
    ok(res, mangas)
  } catch (err) {
    next(err)
  }
}

exports.getRandomMangas = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 5
    const mangas = await mangaService.getRandomMangas(limit)
    ok(res, mangas)
  } catch (err) {
    next(err)
  }
}

exports.getAllMangasPaginated = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const { mangas, pagination } = await mangaService.getAllMangasPaginated(
      page,
      limit
    )

    ok(res, mangas, { pagination })
  } catch (err) {
    next(err)
  }
}

/* ===================== MUTATION ===================== */

exports.createManga = async (req, res, next) => {
  try {
    let coverImageUrl = null

    if (req.file) {
      coverImageUrl = await uploadImageToR2(req.file)
    }

    const manga = await mangaService.createManga({
      ...req.body,
      coverImageUrl,
      uploaderId: req.user.id,
    })

    res.status(201).json({
      success: true,
      data: manga,
    })
  } catch (err) {
    next(err)
  }
}

exports.getMyMangas = async (req, res, next) => {
  try {
    const mangas = await mangaService.getMangasByUploader(req.user.id)
    ok(res, mangas)
  } catch (err) {
    next(err)
  }
}

exports.updateManga = async (req, res, next) => {
  try {
    const manga = await mangaService.updateManga(req.params.id, req.body)
    if (!manga) return notFound(res, 'Manga not found')
    ok(res, manga)
  } catch (err) {
    next(err)
  }
}

exports.deleteManga = async (req, res, next) => {
  try {
    const manga = await mangaService.deleteManga(req.params.id)
    if (!manga) return notFound(res, 'Manga not found')
    ok(res, null, { message: 'Deleted successfully' })
  } catch (err) {
    next(err)
  }
}
