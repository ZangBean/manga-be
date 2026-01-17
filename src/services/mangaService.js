import mongoose from 'mongoose'
import Manga from '../models/mangaModel.js'
import Chapter from '../models/chapterModel.js'
import Image from '../models/imageModel.js'
import MangaGenre from '../models/mangaGenreModel.js'
import { uploadMangaCoverToR2, deleteImagesFromR2 } from './r2UploadService.js'
import {
  homeMangaPipeline,
  baseMangaPipeline,
} from './pipelines/mangaPipelines.js'

// ── HOME ──
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

export const getLatestUpdatedMangas = async (limit = 10, type = null) => {
  const pipeline = [...baseMangaPipeline()]

  if (type) {
    let typeFilter
    if (typeof type === 'string') {
      const types = type
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      typeFilter = types.length > 1 ? { $in: types } : types[0]
    } else if (Array.isArray(type)) typeFilter = { $in: type }
    else typeFilter = type

    pipeline.unshift({ $match: { type: typeFilter } })
  }

  pipeline.push(
    { $match: { chapterCount: { $gt: 0 } } },
    { $sort: { latestChapterDate: -1 } },
    { $limit: Number(limit) },
  )

  return Manga.aggregate(pipeline)
}

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
    pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
  }
}

export const getRandomMangas = (limit = 5) =>
  Manga.aggregate([
    ...baseMangaPipeline(),
    { $sample: { size: Number(limit) } },
  ])

export const getMangaById = async (id) => {
  const manga = await Manga.findById(id).lean()
  if (!manga) return null

  const mangaGenres = await MangaGenre.find({ mangaId: id })
    .select('genreId')
    .lean()
  return { ...manga, genreIds: mangaGenres.map((g) => g.genreId) }
}

export const getMangaBySlug = async (slug) => {
  const [result] = await Manga.aggregate([
    { $match: { slug: slug } },
    ...baseMangaPipeline(),
    { $limit: 1 },
  ])

  if (!result) return null

  const mangaGenres = await MangaGenre.find({ mangaId: result._id })
    .select('genreId')
    .lean()

  return {
    ...result,
    genreIds: mangaGenres.map((g) => g.genreId.toString()),
  }
}

export const getMangasByUploader = (uploaderId) =>
  Manga.find({ uploaderId }).sort({ createdAt: -1 }).lean()

// ── RANDOM THEO THỂ LOẠI ──
export const getRandomMangasByGenres = async (genreIds = [], limit = 5) => {
  if (!genreIds.length) return []
  const objectIds = genreIds.map((id) => new mongoose.Types.ObjectId(id))
  return Manga.aggregate([
    ...baseMangaPipeline(),
    { $match: { 'mangaGenres.genreId': { $in: objectIds } } },
    { $sample: { size: limit } },
  ])
}

// ── MUTATION ──
export const createMangaService = async (mangaData, file = null) => {
  const { genreIds = [], ...mangaInfo } = mangaData
  const newManga = await Manga.create(mangaInfo)

  if (file) {
    const { url, key } = await uploadMangaCoverToR2(
      file,
      newManga._id.toString(),
    )
    await Manga.findByIdAndUpdate(newManga._id, {
      coverImageUrl: url,
      coverImageKey: key,
    })
  }

  if (Array.isArray(genreIds) && genreIds.length) {
    await MangaGenre.insertMany(
      genreIds.map((genreId) => ({ mangaId: newManga._id, genreId })),
    )
  }

  return getMangaById(newManga._id)
}

export const updateMangaService = async (
  mangaId,
  updateData,
  file = null,
  userId,
) => {
  const { genreIds, ...mangaInfo } = updateData

  const manga = await Manga.findById(mangaId)
  if (!manga) throw new Error('Manga không tồn tại')
  if (manga.uploaderId?.toString() !== userId)
    throw new Error('Bạn không có quyền cập nhật manga này')

  Object.assign(manga, mangaInfo)
  await manga.save()

  if (file) {
    const { url, key } = await uploadMangaCoverToR2(file, mangaId)
    if (manga.coverImageKey) await deleteImagesFromR2([manga.coverImageKey])

    manga.coverImageUrl = url
    manga.coverImageKey = key
    await manga.save()
  }

  if (Array.isArray(genreIds)) {
    await MangaGenre.deleteMany({ mangaId })
    if (genreIds.length) {
      await MangaGenre.insertMany(
        genreIds.map((genreId) => ({ mangaId, genreId })),
      )
    }
  }

  return getMangaById(mangaId)
}

export const deleteMangaService = async (mangaId, userId) => {
  const manga = await Manga.findById(mangaId).lean()
  if (!manga) throw new Error('Manga không tồn tại')
  if (manga.uploaderId?.toString() !== userId)
    throw new Error('Bạn không có quyền xóa manga này')

  await MangaGenre.deleteMany({ mangaId })
  const chapters = await Chapter.find({ mangaId }).select('_id').lean()
  const chapterIds = chapters.map((c) => c._id)

  let allImageKeys = []
  if (chapterIds.length) {
    const images = await Image.find({ chapterId: { $in: chapterIds } })
      .select('key')
      .lean()
    allImageKeys = images.map((img) => img.key).filter(Boolean)
  }
  if (manga.coverImageKey) allImageKeys.push(manga.coverImageKey)
  if (allImageKeys.length) await deleteImagesFromR2(allImageKeys)

  if (chapterIds.length) {
    await Image.deleteMany({ chapterId: { $in: chapterIds } })
    await Chapter.deleteMany({ mangaId })
  }

  await Manga.findByIdAndDelete(mangaId)
  return {
    deletedChapters: chapters.length,
    deletedImages: allImageKeys.length,
  }
}
