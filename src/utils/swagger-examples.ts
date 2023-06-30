export class SwaggerExamples {
  static mangaEntityExample = {
    id: '1',
    name: 'Naruto',
    url: 'https://example.com/manga/naruto',
    cover: 'https://example.com/manga/naruto/cover.jpg',
    synopsis: 'Naruto is a ninja from the village of Konoha.',
    genres: ['Action', 'Adventure', 'Comedy'],
    status: 'ongoing',
    updatedAt: '2023-06-30T15:15:00.000Z',
    chapters: [
      {
        name: 'Chapter 1',
        url: 'https://example.com/manga/naruto/chapter-1',
        releasedAt: '2023-06-30T15:15:00.000Z',
        pages: [
          'https://example.com/manga/naruto/chapter-1/page-1.jpg',
          'https://example.com/manga/naruto/chapter-1/page-2.jpg',
        ],
      },
    ],
    hasCover: true,
    source: 'novelcool',
  };

  static simplifiedMangasExample = [
    {
      id: '1',
      name: 'Naruto',
      cover: 'https://example.com/manga/naruto/cover.jpg',
      url: 'https://example.com/manga/naruto',
      synopsis: 'Naruto is a ninja from the village of Konoha.',
      hasCover: false,
    },
    {
      id: '2',
      name: 'One Piece',
      cover: 'https://example.com/manga/onepiece/cover.jpg',
      url: 'https://example.com/manga/onepiece',
      synopsis:
        'One Piece is a story about Monkey D. Luffy, who wants to become a sea-robber.',
      hasCover: true,
    },
  ];
}
