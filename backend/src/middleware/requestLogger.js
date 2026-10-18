import { randomUUID } from 'node:crypto'

export function requestId(req, res, next) {
  req.id = req.get('x-request-id') ?? randomUUID()
  res.set('x-request-id', req.id)
  next()
}

export function requestLogger(req, res, next) {
  const start = process.hrtime.bigint()
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6
    const line = `${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms req=${req.id}`
    if (res.statusCode >= 500) console.error(line)
    else console.log(line)
  })
  next()
}
