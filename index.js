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


let userList = [
  {
    username: 'haikal',
    password: '1121102019'
  }
]


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
    if (myPath.includes('login.html')) {
      let formData
      req.on('data', (chunk) => {
        formData = chunk
      })
      req.on('end', () => {
        formData = new URLSearchParams(Buffer.from(formData).toString())
        res.writeHead(200, { 'Content-Type': mimeTypes['.html'] })
        if (userList.some((v) => {
          return (formData.get('username') == v.username) && (formData.get('password') == v.password)
        })) {
          res.end(
            Buffer.from('PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CjxtZXRhIGNoYXJzZXQ9IlVURi04Ij4KPHRpdGxlPkRhc2hib2FyZDwvdGl0bGU+CjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iLi9zdHlsZXMvZGVmYXVsdC5jc3MiPgo8L2hlYWQ+Cjxib2R5Pgo8aGVhZGVyPgo8aDE+VGVudGFuZyBTYXlhPC9oMT4KPC9oZWFkZXI+CjxuYXY+CjxzcGFuPjxhIGhyZWY9Ii4vaW5kZXguaHRtbCI+SG9tZTwvYT48L3NwYW4+CnwKPHNwYW4+PGEgaHJlZj0iLi9wYWdlcy9hYm91dC5odG1sIj5BYm91dDwvYT48L3NwYW4+CnwKPHNwYW4+PGEgaHJlZj0iLi9wYWdlcy9zZWVfQ1NTLmh0bWwiPkxpaGF0IENTUzwvYT48L3NwYW4+CjxzcGFuPgo8Zm9ybSBhY3Rpb249Ii4vc2VhcmNoLmh0bWwiIG1ldGhvZD0iZ2V0IiBpZD0icyI+CjxpbnB1dCB0eXBlPSJzZWFyY2giIG5hbWU9InMiIHBsYWNlaG9sZGVyPSJzZWFyY2guLi4iIHJlcXVpcmVkPgo8YnV0dG9uIHR5cGU9InN1Ym1pdCI+U2VhcmNoPC9idXR0b24+CjwvZm9ybT4KPC9zcGFuPgp8CjxzcGFuPgo8YSBocmVmPSIuL2xvZ2luLmh0bWwiPkxvZ2luPC9hPgp8CjxhIGhyZWY9Ii4vc2lnbnVwLmh0bWwiPkRhZnRhcjwvYT4KPC9zcGFuPgo8L25hdj4KPG1haW4+CjxhcnRpY2xlPgo8ZGl2IHN0eWxlPSJ0ZXh0LWFsaWduOiBjZW50ZXI7Ij48aW1nIHNyYz0iLi9pbWFnZXMvcCAoMykgLSBDb3B5XzM4NC5wbmciIGFsdD0iTXkgUGljdHVyZSIgc3R5bGU9ImJvcmRlci1yYWRpdXM6IDUwJTsgaGVpZ2h0OiAxNnJlbTsiPjwvZGl2Pgo8aDI+U2F5YSwgQmludGFuZyBIYWlrYWwgQWZpZiBSb3dpPC9oMj4KPHA+U2F5YSBhZGFsYWggb3JhbmcgYmlhc2Egc2VwZXJ0aSBvcmFuZyBwYWRhIHVtdW1ueWEuIFNheWEganVnYSBwdW55YSBrZWxlYmloYW4gZGFuIGtla3VyYW5nYW4gcGFkYSBkaXJpIHNheWEuIFRpZGFrIGJhbnlhayBjZXJpdGEgeWFuZyBiaXNhIHNheWEgc2FtcGFpa2FuLiBJbnRpbnlhLCBzZW1vZ2EgeWFuZyBtZW1iYWNhIHR1bGlzYW4gaW5pIGRpYmVya2FoaSB1bXVyIHlhbmcgYmVybWFuZmFhdCwgc2VsYW1hdCBkdW5pYSBzYW1wYWkgYWtoaXJhdC48L3A+CjwvYXJ0aWNsZT4KPC9tYWluPgo8L2JvZHk+CjwvaHRtbD4=',
              'base64')
          )
        } else {
          res.end(
            eval(`\`${Buffer.from('PCFET0NUWVBFIGh0bWw+DQo8aHRtbCBsYW5nPSJlbiI+DQo8aGVhZD4NCjxtZXRhIGNoYXJzZXQ9IlVURi04Ij4NCjx0aXRsZT5Mb2dpbjwvdGl0bGU+DQo8bGluayByZWw9InN0eWxlc2hlZXQiIGhyZWY9Ii4vc3R5bGVzL2RlZmF1bHQuY3NzIj4NCjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iLi9zdHlsZXMvbG9naW4vbG9naW4uY3NzIj4NCjwvaGVhZD4NCjxib2R5Pg0KPGhlYWRlcj4NCjxoMT5Mb2dpbjwvaDE+DQo8L2hlYWRlcj4NCjxuYXY+DQo8c3Bhbj48YSBocmVmPSIuL2luZGV4Lmh0bWwiPkhvbWU8L2E+PC9zcGFuPg0KfA0KPHNwYW4+PGEgaHJlZj0iLi9wYWdlcy9hYm91dC5odG1sIj5BYm91dDwvYT48L3NwYW4+DQp8DQo8c3Bhbj48YSBocmVmPSIuL3BhZ2VzL3NlZV9DU1MuaHRtbCI+TGloYXQgQ1NTPC9hPjwvc3Bhbj4NCjxzcGFuPg0KPGZvcm0gYWN0aW9uPSIuL3NlYXJjaC5odG1sIiBtZXRob2Q9ImdldCIgaWQ9InMiPg0KPGlucHV0IHR5cGU9InNlYXJjaCIgbmFtZT0icyIgcGxhY2Vob2xkZXI9InNlYXJjaC4uLiIgcmVxdWlyZWQ+DQo8YnV0dG9uIHR5cGU9InN1Ym1pdCI+U2VhcmNoPC9idXR0b24+DQo8L2Zvcm0+DQo8L3NwYW4+DQp8DQo8c3Bhbj4NCjxhIGhyZWY9Ii4vbG9naW4uaHRtbCI+TG9naW48L2E+DQp8DQo8YSBocmVmPSIuL3NpZ251cC5odG1sIj5EYWZ0YXI8L2E+DQo8L3NwYW4+DQo8L25hdj4NCjxtYWluPg0KPGFydGljbGU+DQo8aDI+JyR7Zm9ybURhdGEuZ2V0KCd1c2VybmFtZScpfScgdGlkYWsgZGl0ZW11a2FuIGF0YXUgcGFzc3dvcmQgc2FsYWguPC9oMj4NCjwvYXJ0aWNsZT4NCjxmb3JtIGFjdGlvbj0iLi9sb2dpbi5odG1sIiBtZXRob2Q9InBvc3QiIGlkPSJsb2dpbiI+DQo8ZmllbGRzZXQ+DQo8bGVnZW5kPkxvZ2luPC9sZWdlbmQ+DQo8dGFibGU+DQo8dHI+DQo8dGQgY29sc3Bhbj0iMyI+PGltZyBzcmM9Ii4vaW1hZ2VzL3VzZXIuc3ZnIiBhbHQ9InVzZXIiPjwvdGQ+DQo8L3RyPg0KPHRyPg0KPHRkPjxsYWJlbCBmb3I9InVzZXJuYW1lIj5Vc2VybmFtZTwvbGFiZWw+PC90ZD4NCjx0ZD46PC90ZD4NCjx0ZD48aW5wdXQgdHlwZT0idGV4dCIgbmFtZT0idXNlcm5hbWUiIGlkPSJ1c2VybmFtZSIgcGxhY2Vob2xkZXI9ImhhaWthbCI+PC90ZD4NCjwvdHI+DQo8dHI+DQo8dGQ+PGxhYmVsIGZvcj0icGFzc3dvcmQiPlBhc3N3b3JkPC9sYWJlbD48L3RkPg0KPHRkPjo8L3RkPg0KPHRkPjxpbnB1dCB0eXBlPSJwYXNzd29yZCIgbmFtZT0icGFzc3dvcmQiIGlkPSJwYXNzd29yZCIgcGxhY2Vob2xkZXI9IjExMjExMDIwMTkiPjwvdGQ+DQo8L3RyPg0KPHRyPg0KPHRkIGNvbHNwYW49IjMiPg0KPGJ1dHRvbiB0eXBlPSJzdWJtaXQiPkxvZ2luPC9idXR0b24+DQo8L3RkPg0KPC90cj4NCjwvdGFibGU+DQo8L2ZpZWxkc2V0Pg0KPC9mb3JtPg0KPC9tYWluPg0KPC9ib2R5Pg0KPC9odG1sPg==',
              'base64')
              .toString()}\``
            )
          )
        }
      })
    } else if (myPath.includes('signup.html')) {
      let formData
      req.on('data', (chunk) => {
        formData = chunk
      })
      req.on('end', () => {
        formData = new URLSearchParams(Buffer.from(formData).toString())
        res.writeHead(200, { 'Content-Type': mimeTypes['.html'] })
        userList.push({
          username: formData.get('username'),
          password: formData.get('password')
        })
      })
      res.end(Buffer.from('PG1ldGEgaHR0cC1lcXVpdj0icmVmcmVzaCIgY29udGVudD0iMTsgdXJsPS8iPg==',
        'base64')
        .toString())
    }
  }
}).listen(PORT)