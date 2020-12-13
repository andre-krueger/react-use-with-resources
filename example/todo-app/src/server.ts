import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  setTimeout(() => {
    res.send({ test: true });
  }, 3000);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
