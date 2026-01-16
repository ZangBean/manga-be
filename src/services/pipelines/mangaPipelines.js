export const homeMangaPipeline = () => [
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
      genres: { $map: { input: '$genres', as: 'genre', in: '$$genre.name' } },
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

export const baseMangaPipeline = () => [
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
      genres: { $map: { input: '$genres', as: 'genre', in: '$$genre.name' } },
      comments: { $size: '$comments' },
    },
  },
]
