import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

const TTL_SECONDS = 86400

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const meta = await redis.get(`session:${id}:meta`)
    if (!meta) {
      res.status(404).json({ error: 'not found' })
      return
    }
    const peopleMap = (await redis.hgetall(`session:${id}:people`)) || {}
    res.status(200).json({ cafeName: meta.cafeName || '', people: Object.values(peopleMap) })
    return
  }

  if (req.method === 'PUT') {
    const meta = await redis.get(`session:${id}:meta`)
    if (!meta) {
      res.status(404).json({ error: 'not found' })
      return
    }
    const { people } = req.body || {}
    const peopleList = Array.isArray(people) ? people : []
    if (peopleList.length) {
      const entries = {}
      for (const p of peopleList) entries[p.id] = p
      await redis.hset(`session:${id}:people`, entries)
      await redis.expire(`session:${id}:people`, TTL_SECONDS)
      await redis.expire(`session:${id}:meta`, TTL_SECONDS)
    }
    res.status(200).json({ ok: true })
    return
  }

  res.status(405).json({ error: 'method not allowed' })
}
