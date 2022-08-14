import http from 'node:http'
import os from 'node:os'

import { handleError, handlePostReq, handleDeleteReq, handleGetReq } from './handles.js'

// Configurando o hostname e port
const { lo } = os.networkInterfaces()
const hostname = lo[0].address
const port = '3000'

// Configurando a base do servidor
http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json;charset=utf-8');

  // routes
  if (req.url == '/' && req.method == 'GET') {
    handleGetReq(req, res)
  }
  else if (req.url === '/login' && req.method == 'POST') {
    handlePostReq(req, res)
  }
  else if (req.url == '/register' && req.method == 'POST') {
    handlePostReq(req, res)
  }
  else if (req.method == 'DELETE') {
    handleDeleteReq(req, res)
  }
  else {
    handleError(res, 404)
  }

}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`)
})
