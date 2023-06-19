import * as fs from 'fs';

const buffer = fs.readFileSync('mangas.json');
const jsonString = buffer.toString();
const data = JSON.parse(jsonString);

const mangas = data.mangas;
const genres = mangas.map((manga) => manga.mangaInfo.genres);
const uniqueGenres = [...new Set(genres.flat())].sort();
fs.writeFileSync(
  'genres.json',
  JSON.stringify(
    uniqueGenres.map((genre, i) => {
      return { name: genre, code: i + 1 };
    }),
  ),
);
