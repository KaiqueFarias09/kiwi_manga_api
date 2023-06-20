import * as fs from 'fs';

export function readJsonFileAsync(filename: string) {
  const buffer = fs.readFileSync(filename);
  const jsonString = buffer.toString();
  return JSON.parse(jsonString);
}
