import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

// Tavily Research
app.post('/api/research', async (req, res) => {
  const { query, mode } = req.body;
  
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TAVILY_API_KEY}`
      },
      body: JSON.stringify({
        query,
        search_depth: "advanced",
        include_answer: true,
        max_results: 10
      })
    });

    const data = await response.json();
    res.json({ 
      result: data.answer || 'No answer generated.',
      sources: data.results || []
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Firecrawl Extract / Crawl
app.post('/api/extract', async (req, res) => {
  const { url, prompt } = req.body;

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html'],
        extract: {
          prompt: prompt || "Extract all key information, facts, and structured data from this page."
        }
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Epic Tech AI backend running on http://localhost:${PORT}`);
});
