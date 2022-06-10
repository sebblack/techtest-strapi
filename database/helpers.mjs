import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

export const seedDataDir = path.join(
  fileURLToPath(import.meta.url),
  '../',
  'seed-data'
)

export const loadSeedJson = async (filename) => {
  const file = await readFile(path.join(seedDataDir, filename), { encoding: 'utf8' })
  return JSON.parse(file)
}