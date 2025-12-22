const Manga = require('@/models/mangaModel')

/**
 * Pipeline dùng chung cho mọi query manga
 */
const baseMangaPipeline = () => [
  // chapters
  {
    $lookup: {
      from: 'chapters',
      localField: '_id',
      foreignField: 'mangaId',
      as: 'chapters',
    },
  },
  {
    $addFields: {
      chapterCount: { $size: '$chapters' },
      latestChapterDate: { $max: '$chapters.createdAt' },
    },
  },

  // genres
  {
    $lookup: {
      from: 'mangagenres',
      localField: '_id',
      foreignField: 'mangaId',
      as: 'genreLinks',
    },
  },
  {
    $lookup: {
      from: 'genres',
      localField: 'genreLinks.genreId',
      foreignField: '_id',
      as: 'genres',
    },
  },

  // chuẩn hóa output
  {
    $project: {
      title: 1,
      coverImageUrl: 1,
      description: 1,
      viewCount: 1,
      author: 1,
      translationGroup: 1,
      status: 1,
      createdAt: 1,
      chapterCount: 1,
      genres: '$genres.name',
      latestChapterDate: 1,
    },
  },
]

/**
 * Manga mới cập nhật
 */
const getLatestUpdatedMangas = async (limit = 10) =>
  Manga.aggregate([
    ...baseMangaPipeline(),
    { $match: { chapterCount: { $gt: 0 } } },
    { $sort: { latestChapterDate: -1 } },
    { $limit: Number(limit) },
  ])

/**
 * Manga top view
 */
const getTopViews = async (limit = 10) =>
  Manga.aggregate([
    ...baseMangaPipeline(),
    { $sort: { viewCount: -1 } },
    { $limit: Number(limit) },
  ])

/**
 * Manga phân trang
 */
const getAllMangasPaginated = async (page = 1, limit = 20) => {
  const p = Math.max(1, Number(page))
  const l = Math.max(1, Number(limit))

  const result = await Manga.aggregate([
    ...baseMangaPipeline(),
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        mangas: [{ $skip: (p - 1) * l }, { $limit: l }],
        total: [{ $count: 'count' }],
      },
    },
  ])

  return {
    mangas: result[0].mangas,
    pagination: {
      page: p,
      limit: l,
      total: result[0].total[0]?.count || 0,
      totalPages: Math.ceil((result[0].total[0]?.count || 0) / l),
    },
  }
}

/**
 * Manga random
 */
const getRandomMangas = async (limit = 5) =>
  Manga.aggregate([
    { $sample: { size: Number(limit) } },
    ...baseMangaPipeline(),
  ])

/**
 * CRUD (admin)
 */
const getMangaById = (id) => Manga.findById(id)
const createManga = (data) => new Manga(data).save()
const updateManga = (id, data) =>
  Manga.findByIdAndUpdate(id, data, { new: true })
const deleteManga = (id) => Manga.findByIdAndDelete(id)

module.exports = {
  getLatestUpdatedMangas,
  getTopViews,
  getAllMangasPaginated,
  getRandomMangas,
  getMangaById,
  createManga,
  updateManga,
  deleteManga,
}
