const Manga = require('@/models/mangaModel')
const Chapter = require('@/models/chapterModel')
const MangaGenre = require('@/models/mangaGenreModel')
const Genre = require('@/models/genreModel')

const getAllMangas = async () => {
  return Manga.find()
}

const getMangaById = async (id) => {
  return Manga.findById(id)
}

const createManga = async (data) => {
  const manga = new Manga(data)
  return manga.save()
}

const updateManga = async (id, data) => {
  return Manga.findByIdAndUpdate(id, data, { new: true })
}

const deleteManga = async (id) => {
  return Manga.findByIdAndDelete(id)
}

const getTopViews = async (limit = 10) => {
  const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 10))
  return await Manga.find({})
    .sort({ viewCount: -1 })
    .limit(safeLimit)
    .select('title coverImageUrl description viewCount')
    .lean()
}

const getLatestUpdatedMangas = async (limit = 10) => {
  const safeLimit = Math.max(1, Math.min(50, parseInt(limit) || 10))

  // 1. Lấy các manga có chapter mới nhất
  const latestChapters = await Chapter.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$mangaId',
        latestChapterDate: { $first: '$createdAt' },
      },
    },
    { $sort: { latestChapterDate: -1 } },
    { $limit: safeLimit },
  ])

  const mangaIds = latestChapters.map((item) => item._id)

  if (mangaIds.length === 0) return []

  // 2. Lấy thông tin manga cơ bản
  const mangas = await Manga.find({ _id: { $in: mangaIds } })
    .select(
      'title coverImageUrl description viewCount author translationGroup status createdAt'
    )
    .lean()

  // 3. Đếm số chapter cho từng manga
  const chapterCounts = await Chapter.aggregate([
    { $match: { mangaId: { $in: mangaIds } } },
    { $group: { _id: '$mangaId', chapterCount: { $sum: 1 } } },
  ])

  const countMap = {}
  chapterCounts.forEach((item) => {
    countMap[item._id.toString()] = item.chapterCount
  })

  // 4. Lấy danh sách genre cho tất cả mangaIds (từ bảng mangagenres)
  const mangaGenreLinks = await MangaGenre.find({ mangaId: { $in: mangaIds } })
    .select('mangaId genreId')
    .lean()

  const genreIds = [...new Set(mangaGenreLinks.map((link) => link.genreId))]

  // 5. Lấy tên các genre từ collection genres
  const genres = await Genre.find({ _id: { $in: genreIds } })
    .select('name')
    .lean()

  const genreMap = {}
  genres.forEach((g) => {
    genreMap[g._id.toString()] = g.name
  })

  // 6. Gán genre cho từng manga
  const mangaWithGenres = mangas.map((manga) => {
    const links = mangaGenreLinks.filter(
      (link) => link.mangaId.toString() === manga._id.toString()
    )

    const genreNames = links
      .map((link) => genreMap[link.genreId.toString()])
      .filter(Boolean)

    return {
      ...manga,
      genres: genreNames, // Mảng tên thể loại: ["Action", "Romance", "Fantasy"]
      chapterCount: countMap[manga._id.toString()] || 0,
    }
  })

  // 7. Giữ nguyên thứ tự theo chapter mới nhất
  return mangaIds
    .map((id) =>
      mangaWithGenres.find((m) => m._id.toString() === id.toString())
    )
    .filter(Boolean)
}

const getAllMangasPaginated = async (page = 1, limit = 20) => {
  const safePage = Math.max(1, parseInt(page))
  const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 20))
  const skip = (safePage - 1) * safeLimit

  const mangas = await Manga.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit)
    .select(
      'title coverImageUrl description viewCount genre author translationGroup status createdAt'
    )
    .lean()

  const total = await Manga.countDocuments({})

  const mangaIds = mangas.map((m) => m._id)
  const chapterCounts = await Chapter.aggregate([
    { $match: { mangaId: { $in: mangaIds } } },
    { $group: { _id: '$mangaId', chapterCount: { $sum: 1 } } },
  ])

  const countMap = {}
  chapterCounts.forEach((item) => {
    countMap[item._id] = item.count
  })

  const mangasWithCount = mangas.map((manga) => ({
    ...manga,
    chapterCount: countMap[manga._id] || 0,
  }))

  return {
    mangas: mangasWithCount,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  }
}

module.exports = {
  getAllMangas,
  getMangaById,
  createManga,
  updateManga,
  deleteManga,
  getTopViews,
  getLatestUpdatedMangas,
  getAllMangasPaginated,
}
