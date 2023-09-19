let http = require("http");
let server = http.createServer((req, res) => {
  console.log("REQ:", req.method, req.url);
  console.log("Headers:", req.headers);
  res.write("HI");
  res.end();
});
server.listen(8880, () => {
  console.log("ready");
});
