const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

const API_KEY = 'e0f2e162';  // твій ключ OMDb API

app.get("/search", async (req, res) => {
  const title = req.query.title;
  if (!title) {
    return res.status(400).json({ error: "No title provided" });
  }

  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`
    );
    const data = await response.json();
    if (data.Response === "False") {
      return res.status(404).json({ error: data.Error });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
