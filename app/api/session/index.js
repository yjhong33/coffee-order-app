import { Redis } from '@upstash/redis'
import crypto from 'crypto'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

const TTL_SECONDS = 86400

function genId() {
  return crypto.randomBytes(4).toString('hex').toUpperCase()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' })
    return
  }

  const { cafeName, people } = req.body || {}
  const id = genId()
  const peopleList = Array.isArray(people) ? people : []

  await redis.set(`session:${id}:meta`, { cafeName: cafeName || '', createdAt: Date.now() }, { ex: TTL_SECONDS })

  if (peopleList.length) {
    const entries = {}
    for (const p of peopleList) entries[p.id] = p
    await redis.hset(`session:${id}:people`, entries)
    await redis.expire(`session:${id}:people`, TTL_SECONDS)
  }

  res.status(200).json({ id })
}
