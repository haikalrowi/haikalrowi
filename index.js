const http = require('http')
const fs = require('fs')
const path = require('path')


const PORT = process.env.PORT || 5000


const mimeTypes = {
  '.py': 'text/x-python',
  '.html': 'text/html',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.css': 'text/css',
  '.map': 'None',
  '.scss': 'None',
}


function HTTPStatusNotFound(res) {
  res.writeHead(404)
  res.end(http.STATUS_CODES[404])
}


http.createServer((req, res) => {
  let myURL = new URL(req.url, `http://${req.headers.host}`);
  let myPath = path.join(__dirname, 'root', decodeURI(myURL.pathname))
  if (req.method == 'GET') {
    if (fs.existsSync(myPath)) {
      if (myPath.includes('search.html') && myURL.searchParams.get('s')) {
        res.end(fs.readFileSync(myPath).toString()
          .replace(
            '<h1>Anda mencari: </h1>',
            `<h1>Anda mencari: ${myURL.searchParams.get('s')}</h1>`
          )
          .replace(
            '<h2>Lorem.</h2>',
            `<h2>'${myURL.searchParams.get('s')}' Tidak ditemukan</h2>`
          ))
      }


      else if (fs.statSync(myPath).isDirectory()) {
        fs.readFile(path.join(myPath, 'index.html'), (err, data) => {
          if (err) {
            HTTPStatusNotFound(res)
          } else {
            res.writeHead(200, { 'Content-Type': mimeTypes['.html'] })
            res.end(data)
          }
        })
      } else if (fs.statSync(myPath).isFile()) {
        res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(myPath)] })
        res.end(fs.readFileSync(myPath))
      }
    } else { HTTPStatusNotFound(res) }
  } else if (req.method == 'POST') {
    let formData
    req.on('data', (chunk) => {
      formData = chunk
    })
    req.on('end', () => {
      formData = new URLSearchParams(Buffer.from(formData).toString())

      res.writeHead(200, { 'Content-Type': mimeTypes['.html'] })
      if (formData.get('username') == 'haikal'
        && formData.get('password') == '1121102019') {
        res.end(
          Buffer.from("PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CjxtZXRhIGNoYXJzZXQ9IlVURi04Ij4KPHRpdGxlPkRhc2hib2FyZDwvdGl0bGU+CjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iLi4vc3R5bGVzL2RlZmF1bHQuY3NzIj4KPC9oZWFkPgo8Ym9keT4KPGhlYWRlcj4KPGgxPlRlbnRhbmcgU2F5YTwvaDE+CjwvaGVhZGVyPgo8bmF2Pgo8c3Bhbj48YSBocmVmPSIuLi9pbmRleC5odG1sIj5Ib21lPC9hPjwvc3Bhbj4KfAo8c3Bhbj48YSBocmVmPSIuL2Fib3V0Lmh0bWwiPkFib3V0PC9hPjwvc3Bhbj4KfAo8c3Bhbj48YSBocmVmPSIuL3NlZV9DU1MuaHRtbCI+TGloYXQgQ1NTPC9hPjwvc3Bhbj4KPHNwYW4+Cjxmb3JtIGFjdGlvbj0iLi4vc2VhcmNoLmh0bWwiIG1ldGhvZD0iZ2V0IiBpZD0icyI+CjxpbnB1dCB0eXBlPSJzZWFyY2giIG5hbWU9InMiIHBsYWNlaG9sZGVyPSJzZWFyY2guLi4iIHJlcXVpcmVkPgo8YnV0dG9uIHR5cGU9InN1Ym1pdCI+U2VhcmNoPC9idXR0b24+CjwvZm9ybT4KPC9zcGFuPgp8CjxzcGFuPjxhIGhyZWY9Ii4uL2xvZ2luLmh0bWwiPkxvZ2luPC9hPjwvc3Bhbj4KPC9uYXY+CjxtYWluPgo8YXJ0aWNsZT4KPGRpdiBzdHlsZT0idGV4dC1hbGlnbjogY2VudGVyOyI+PGltZyBzcmM9Ii4uL2ltYWdlcy9wICgzKSAtIENvcHlfMzg0LnBuZyIgYWx0PSJNeSBQaWN0dXJlIiBzdHlsZT0iYm9yZGVyLXJhZGl1czogNTAlOyBoZWlnaHQ6IDE2cmVtOyI+PC9kaXY+CjxoMj5TYXlhLCBCaW50YW5nIEhhaWthbCBBZmlmIFJvd2k8L2gyPgo8cD5TYXlhIGFkYWxhaCBvcmFuZyBiaWFzYSBzZXBlcnRpIG9yYW5nIHBhZGEgdW11bW55YS4gU2F5YSBqdWdhIHB1bnlhIGtlbGViaWhhbiBkYW4ga2VrdXJhbmdhbiBwYWRhIGRpcmkgc2F5YS4gVGlkYWsgYmFueWFrIGNlcml0YSB5YW5nIGJpc2Egc2F5YSBzYW1wYWlrYW4uIEludGlueWEsIHNlbW9nYSB5YW5nIG1lbWJhY2EgdHVsaXNhbiBpbmkgZGliZXJrYWhpIHVtdXIgeWFuZyBiZXJtYW5mYWF0LCBzZWxhbWF0IGR1bmlhIHNhbXBhaSBha2hpcmF0LjwvcD4KPC9hcnRpY2xlPgo8L21haW4+CjwvYm9keT4KPC9odG1sPg==",
            'base64')
        )
      } else {
        res.end(
          eval(`\`${Buffer.from('PCFET0NUWVBFIGh0bWw+DQo8aHRtbCBsYW5nPSJlbiI+DQo8aGVhZD4NCjxtZXRhIGNoYXJzZXQ9IlVURi04Ij4NCjx0aXRsZT5Mb2dpbjwvdGl0bGU+DQo8bGluayByZWw9InN0eWxlc2hlZXQiIGhyZWY9Ii4uL3N0eWxlcy9kZWZhdWx0LmNzcyI+DQo8bGluayByZWw9InN0eWxlc2hlZXQiIGhyZWY9Ii4uL3N0eWxlcy9sb2dpbi9sb2dpbi5jc3MiPg0KPC9oZWFkPg0KPGJvZHk+DQo8aGVhZGVyPg0KPGgxPkxvZ2luPC9oMT4NCjwvaGVhZGVyPg0KPG5hdj4NCjxzcGFuPjxhIGhyZWY9Ii4uL2luZGV4Lmh0bWwiPkhvbWU8L2E+PC9zcGFuPg0KfA0KPHNwYW4+PGEgaHJlZj0iLi9hYm91dC5odG1sIj5BYm91dDwvYT48L3NwYW4+DQp8DQo8c3Bhbj48YSBocmVmPSIuL3NlZV9DU1MuaHRtbCI+TGloYXQgQ1NTPC9hPjwvc3Bhbj4NCjxzcGFuPg0KPGZvcm0gYWN0aW9uPSIuLi9zZWFyY2guaHRtbCIgbWV0aG9kPSJnZXQiIGlkPSJzIj4NCjxpbnB1dCB0eXBlPSJzZWFyY2giIG5hbWU9InMiIHBsYWNlaG9sZGVyPSJzZWFyY2guLi4iIHJlcXVpcmVkPg0KPGJ1dHRvbiB0eXBlPSJzdWJtaXQiPlNlYXJjaDwvYnV0dG9uPg0KPC9mb3JtPg0KPC9zcGFuPg0KfA0KPHNwYW4+PGEgaHJlZj0iLi4vbG9naW4uaHRtbCI+TG9naW48L2E+PC9zcGFuPg0KPC9uYXY+DQo8bWFpbj4NCjxhcnRpY2xlPg0KPGgyPicke2Zvcm1EYXRhLmdldCgndXNlcm5hbWUnKX0nIHRpZGFrIGRpdGVtdWthbiBhdGF1IHBhc3N3b3JkIHNhbGFoLjwvaDI+DQo8L2FydGljbGU+DQo8Zm9ybSBhY3Rpb249Ii4vZGFzaGJvYXJkLmh0bWwiIG1ldGhvZD0icG9zdCIgaWQ9ImxvZ2luIj4NCjxmaWVsZHNldD4NCjxsZWdlbmQ+TG9naW48L2xlZ2VuZD4NCjx0YWJsZT4NCjx0cj4NCjx0ZCBjb2xzcGFuPSIzIj48aW1nIHNyYz0iLi4vaW1hZ2VzL3VzZXIuc3ZnIiBhbHQ9InVzZXIiPjwvdGQ+DQo8L3RyPg0KPHRyPg0KPHRkPjxsYWJlbCBmb3I9InVzZXJuYW1lIj5Vc2VybmFtZTwvbGFiZWw+PC90ZD4NCjx0ZD46PC90ZD4NCjx0ZD48aW5wdXQgdHlwZT0idGV4dCIgbmFtZT0idXNlcm5hbWUiIGlkPSJ1c2VybmFtZSIgcGxhY2Vob2xkZXI9ImhhaWthbCI+PC90ZD4NCjwvdHI+DQo8dHI+DQo8dGQ+PGxhYmVsIGZvcj0icGFzc3dvcmQiPlBhc3N3b3JkPC9sYWJlbD48L3RkPg0KPHRkPjo8L3RkPg0KPHRkPjxpbnB1dCB0eXBlPSJwYXNzd29yZCIgbmFtZT0icGFzc3dvcmQiIGlkPSJwYXNzd29yZCIgcGxhY2Vob2xkZXI9IjExMjExMDIwMTkiPjwvdGQ+DQo8L3RyPg0KPHRyPg0KPHRkIGNvbHNwYW49IjMiPg0KPGJ1dHRvbiB0eXBlPSJzdWJtaXQiPkxvZ2luPC9idXR0b24+DQo8L3RkPg0KPC90cj4NCjwvdGFibGU+DQo8L2ZpZWxkc2V0Pg0KPC9mb3JtPg0KPC9tYWluPg0KPC9ib2R5Pg0KPC9odG1sPg==',
            'base64')
            .toString()}\``
          )
        )
      }
    })
  }
}).listen(PORT)