import http from 'http'
import url from 'url'

import { deleteUser, getUser, getUsers, saveUser } from './user.js'

export function handleGetReq(_req, res) {
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  return res.end(JSON.stringify(getUsers()))
}

export function handlePostReq(req, res) {
  const size = parseInt(req.headers['content-length'], 10)
  const buffer = Buffer.allocUnsafe(size)
  var pos = 0

  req.on('data', (chunk) => {
    const offset = pos + chunk.length
    if (offset > size) {
      reject(413, 'Too Large', res)
      return
    }
    chunk.copy(buffer, pos)
    pos = offset
  })

  req.on('end', () => {
    if (pos !== size) {
      reject(400, 'Bad Request', res)
      return
    }
    const data = JSON.parse(buffer.toString())

    if (req.url === '/login') {
      var user = getUser(data.username)[0]
      if (!user) {
        return handleError(res, 404)
      }
      var { id, username, password } = user

      if (id) {
        if (password == data.password) {
          res.statusCode = 200
          return res.end(JSON.stringify({ id, username }))
        } else {
          res.statusCode = 301
          return res.end(JSON.stringify({ error: "password invalidad" }))
        }
      } else {
        return handleError(res, 404)
      }


    }
    if (req.url === '/register') {
      saveUser(data)
      res.statusCode = 201
      data.password = '...'
      return res.end(JSON.stringify(data))
    }
  })
}

export function handleDeleteReq(req, res) {
  const { query } = url.parse(req.url)
  const id = query.split('=')[1]
  const userDeleted = deleteUser(parseInt(id))
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  return res.end(`{"userDeleted": ${userDeleted}}`)
}

export function handlePutReq(req, res) {
  const { query } = url.parse(req.url)
  const id = query.split('=')[1]

  const size = parseInt(req.headers['content-length'], 10)
  const buffer = Buffer.allocUnsafe(size)
  var pos = 0
  req
    .on('data', (chunk) => {
      const offset = pos + chunk.length
      if (offset > size) {
        reject(413, 'Too Large', res)
        return
      }
      chunk.copy(buffer, pos)
      pos = offset
    })
    .on('end', () => {
      if (pos !== size) {
        reject(400, 'Bad Request', res)
        return
      }
      const data = JSON.parse(buffer.toString())

      const userUpdated = Users.replaceUser(id, data);
      res.setHeader('Content-Type', 'application/json;charset=utf-8');
      return res.end(`{"userUpdated": ${userUpdated}}`)
    })
}

export function handleError(res, code) {
  res.statusCode = code
  return res.end(`{"error": "${http.STATUS_CODES[code]}"}`)
}
