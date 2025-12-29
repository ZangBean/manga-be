const mangaService = require('@/services/mangaService')
const {
  uploadImageToR2,
  deleteImageFromR2,
} = require('@/services/r2UploadService')

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
    let coverImageKey = null

    if (req.file) {
      const uploaded = await uploadImageToR2(req.file)
      coverImageUrl = uploaded.url
      coverImageKey = uploaded.key
    }

    const manga = await mangaService.createManga({
      ...req.body,
      coverImageUrl,
      coverImageKey,
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
    const mangaId = req.params.id

    // 1. Tìm manga hiện tại để lấy ảnh cũ
    const existingManga = await mangaService.getMangaById(mangaId)
    if (!existingManga) return notFound(res, 'Manga not found')

    let updateData = { ...req.body }

    // 2. Xử lý upload ảnh mới nếu có
    if (req.file) {
      // Upload ảnh mới
      const { url: newUrl, key: newKey } = await uploadImageToR2(req.file)

      // Xóa ảnh cũ nếu tồn tại
      if (existingManga.coverImageKey) {
        await deleteImageFromR2(existingManga.coverImageKey)
      }

      // Cập nhật field mới
      updateData.coverImageUrl = newUrl
      updateData.coverImageKey = newKey
    }

    // 3. Update document
    const updatedManga = await mangaService.updateManga(mangaId, updateData)

    ok(res, updatedManga)
  } catch (err) {
    next(err)
  }
}

exports.deleteManga = async (req, res, next) => {
  try {
    const mangaId = req.params.id

    // 1. Tìm manga trước để lấy thông tin ảnh cũ
    const manga = await mangaService.getMangaById(mangaId)
    if (!manga) {
      return notFound(res, 'Manga not found')
    }

    // 2. Xóa ảnh bìa trên R2 nếu tồn tại
    if (manga.coverImageKey) {
      await deleteImageFromR2(manga.coverImageKey)
      console.log(
        `Đã xóa ảnh bìa trên R2 cho manga ${mangaId}: ${manga.coverImageKey}`
      )
    } else if (manga.coverImageUrl) {
      try {
        const urlParts = new URL(manga.coverImageUrl).pathname.split('/')
        const key = urlParts.slice(1).join('/') // loại bỏ '/' đầu tiên
        await deleteImageFromR2(key)
        console.log(`Fallback: Đã xóa ảnh cũ từ URL cho manga ${mangaId}`)
      } catch (parseErr) {
        console.warn(
          `Không thể parse key từ URL cho manga ${mangaId}:`,
          parseErr
        )
      }
    }

    await mangaService.deleteManga(mangaId)

    ok(res, null, { message: 'Manga và ảnh bìa đã được xóa thành công' })
  } catch (err) {
    console.error('Lỗi khi xóa manga:', err)
    next(err)
  }
}
