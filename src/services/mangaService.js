import Manga from '../models/mangaModel.js'
import Chapter from '../models/chapterModel.js'
import Image from '../models/imageModel.js'
import { uploadMangaCoverToR2, deleteImagesFromR2 } from './r2UploadService.js'

const homeMangaPipeline = () => [
  {
    $lookup: {
      from: 'chapters',
      localField: '_id',
      foreignField: 'mangaId',
      as: 'chapters',
    },
  },
  {
    $lookup: {
      from: 'mangagenres',
      localField: '_id',
      foreignField: 'mangaId',
      as: 'mangaGenres',
    },
  },
  {
    $lookup: {
      from: 'genres',
      localField: 'mangaGenres.genreId',
      foreignField: '_id',
      as: 'genres',
    },
  },
  {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'mangaId',
      as: 'comments',
    },
  },
  {
    $addFields: {
      chapterCount: { $size: '$chapters' },
      latestChapterDate: { $max: '$chapters.createdAt' },
      genres: {
        $map: {
          input: '$genres',
          as: 'genre',
          in: '$$genre.name',
        },
      },
      comments: { $size: '$comments' },
    },
  },
  {
    $project: {
      title: 1,
      coverImageUrl: 1,
      viewCount: 1,
      chapterCount: 1,
      latestChapterDate: 1,
      description: 1,
      author: 1,
      totalChapters: 1,
      translationGroup: 1,
      year: { $year: '$releaseDate' },
      rating: '$likeCount',
      genres: 1,
      comments: 1,
    },
  },
]

const baseMangaPipeline = () => [
  {
    $lookup: {
      from: 'chapters',
      localField: '_id',
      foreignField: 'mangaId',
      as: 'chapters',
    },
  },
  {
    $lookup: {
      from: 'mangagenres',
      localField: '_id',
      foreignField: 'mangaId',
      as: 'mangaGenres',
    },
  },
  {
    $lookup: {
      from: 'genres',
      localField: 'mangaGenres.genreId',
      foreignField: '_id',
      as: 'genres',
    },
  },
  {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'mangaId',
      as: 'comments',
    },
  },
  {
    $addFields: {
      chapterCount: { $size: '$chapters' },
      latestChapterDate: { $max: '$chapters.createdAt' },
      genres: {
        $map: {
          input: '$genres',
          as: 'genre',
          in: '$$genre.name',
        },
      },
      comments: { $size: '$comments' },
    },
  },
]

export const getHomeTopViews = (limit = 10) =>
  Manga.aggregate([
    ...homeMangaPipeline(),
    { $sort: { viewCount: -1 } },
    { $limit: Number(limit) },
  ])

export const getHomeLatestUpdated = (limit = 10) =>
  Manga.aggregate([
    ...homeMangaPipeline(),
    { $match: { chapterCount: { $gt: 0 } } },
    { $sort: { latestChapterDate: -1 } },
    { $limit: Number(limit) },
  ])

// ── QUERY ──
export const getAllMangas = () =>
  Manga.aggregate([...baseMangaPipeline(), { $sort: { createdAt: -1 } }])

export const getLatestUpdatedMangas = (limit = 10) =>
  Manga.aggregate([
    ...baseMangaPipeline(),
    { $match: { chapterCount: { $gt: 0 } } },
    { $sort: { latestChapterDate: -1 } },
    { $limit: Number(limit) },
  ])

export const getTopViews = (limit = 10) =>
  Manga.aggregate([
    ...baseMangaPipeline(),
    { $sort: { viewCount: -1 } },
    { $limit: Number(limit) },
  ])

export const getAllMangasPaginated = async (page = 1, limit = 20) => {
  const p = Math.max(1, Number(page))
  const l = Math.max(1, Number(limit))

  const [result] = await Manga.aggregate([
    ...baseMangaPipeline(),
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        mangas: [{ $skip: (p - 1) * l }, { $limit: l }],
        total: [{ $count: 'count' }],
      },
    },
  ])

  const total = result.total[0]?.count || 0

  return {
    mangas: result.mangas,
    pagination: {
      page: p,
      limit: l,
      total,
      totalPages: Math.ceil(total / l),
    },
  }
}

export const getRandomMangas = (limit = 5) =>
  Manga.aggregate([
    ...baseMangaPipeline(),
    { $sample: { size: Number(limit) } },
  ])

export const getMangaById = (id) => Manga.findById(id).lean()

export const getMangasByUploader = (uploaderId) =>
  Manga.find({ uploaderId }).sort({ createdAt: -1 }).lean()

// ── MUTATION ──
export const createMangaService = async (mangaData, file = null) => {
  const newManga = await Manga.create(mangaData)

  if (file) {
    const { url, key } = await uploadMangaCoverToR2(
      file,
      newManga._id.toString()
    )

    await Manga.findByIdAndUpdate(
      newManga._id,
      {
        coverImageUrl: url,
        coverImageKey: key,
      },
      { new: true }
    )
  }

  // Trả về manga đầy đủ
  return getMangaById(newManga._id)
}

export const updateMangaService = async (
  mangaId,
  updateData,
  file = null,
  userId
) => {
  const manga = await Manga.findById(mangaId).lean()
  if (!manga) {
    throw new Error('Manga không tồn tại')
  }

  if (manga.uploaderId?.toString() !== userId) {
    throw new Error('Bạn không có quyền cập nhật manga này')
  }

  let finalUpdateData = { ...updateData }

  if (file) {
    const { url, key } = await uploadMangaCoverToR2(file, mangaId)

    if (manga.coverImageKey) {
      await deleteImagesFromR2([manga.coverImageKey])
    }

    finalUpdateData.coverImageUrl = url
    finalUpdateData.coverImageKey = key
  }

  const updated = await Manga.findByIdAndUpdate(mangaId, finalUpdateData, {
    new: true,
  }).lean()

  return updated
}

export const deleteMangaService = async (mangaId, userId) => {
  const manga = await Manga.findById(mangaId).lean()
  if (!manga) {
    throw new Error('Manga không tồn tại')
  }

  if (manga.uploaderId?.toString() !== userId) {
    throw new Error('Bạn không có quyền xóa manga này')
  }

  const chapters = await Chapter.find({ mangaId }).select('_id').lean()
  const chapterIds = chapters.map((c) => c._id)

  let allImageKeys = []

  if (chapterIds.length > 0) {
    const images = await Image.find({ chapterId: { $in: chapterIds } })
      .select('key')
      .lean()
    allImageKeys = images.map((img) => img.key).filter(Boolean)
  }

  if (manga.coverImageKey) {
    allImageKeys.push(manga.coverImageKey)
  }

  if (allImageKeys.length > 0) {
    await deleteImagesFromR2(allImageKeys)
  }

  if (chapterIds.length > 0) {
    await Image.deleteMany({ chapterId: { $in: chapterIds } })
    await Chapter.deleteMany({ mangaId })
  }

  await Manga.findByIdAndDelete(mangaId)

  return {
    deletedChapters: chapters.length,
    deletedImages: allImageKeys.length,
  }
}
