import { useState } from 'react';
import { Search, FileText, Download, Key, Play } from 'lucide-react';

export default function EpicTechAI() {
  const [mode, setMode] = useState<'research' | 'crawl' | 'extract'>('research');
  const [query, setQuery] = useState('');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    tavily: '',
    firecrawl: ''
  });

  const handleResearch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, mode })
      });
      const data = await res.json();
      setResult(data.result || JSON.stringify(data, null, 2));
    } catch (e) {
      setResult('Error: ' + (e as Error).message);
    }
    setLoading(false);
  };

  const handleExtract = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, prompt: query })
      });
      const data = await res.json();
      setResult(data.markdown || data.result || JSON.stringify(data, null, 2));
    } catch (e) {
      setResult('Error: ' + (e as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-cyan-400 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                EPIC TECH AI
              </h1>
              <p className="text-zinc-500 text-sm">REAL-TIME RESEARCH • DEEP CRAWL • STRUCTURED EXTRACTION</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setMode('research')}
              className={`px-6 py-2.5 rounded-2xl flex items-center gap-2 transition-all ${mode === 'research' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' : 'bg-zinc-900 hover:bg-zinc-800'}`}
            >
              <Search className="w-4 h-4" />
              RESEARCH
            </button>
            <button 
              onClick={() => setMode('crawl')}
              className={`px-6 py-2.5 rounded-2xl flex items-center gap-2 transition-all ${mode === 'crawl' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/50' : 'bg-zinc-900 hover:bg-zinc-800'}`}
            >
              <Download className="w-4 h-4" />
              DEEP CRAWL
            </button>
            <button 
              onClick={() => setMode('extract')}
              className={`px-6 py-2.5 rounded-2xl flex items-center gap-2 transition-all ${mode === 'extract' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/50' : 'bg-zinc-900 hover:bg-zinc-800'}`}
            >
              <FileText className="w-4 h-4" />
              EXTRACT
            </button>
          </div>
        </div>

        {/* API Keys */}
        <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4 text-sm text-zinc-400">
            <Key className="w-4 h-4" /> API KEYS
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-zinc-500 mb-1">TAVILY API KEY</div>
              <input 
                type="password"
                value={apiKeys.tavily}
                onChange={(e) => setApiKeys({...apiKeys, tavily: e.target.value})}
                className="w-full bg-black border border-zinc-700 rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-purple-500"
                placeholder="tvly-..."
              />
            </div>
            <div>
              <div className="text-xs text-zinc-500 mb-1">FIRECRAWL API KEY</div>
              <input 
                type="password"
                value={apiKeys.firecrawl}
                onChange={(e) => setApiKeys({...apiKeys, firecrawl: e.target.value})}
                className="w-full bg-black border border-zinc-700 rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-cyan-500"
                placeholder="fc-..."
              />
            </div>
          </div>
        </div>

        {/* Main Input */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">
          {mode === 'research' && (
            <div>
              <div className="text-xl font-semibold mb-2 text-purple-400">INTELLIGENT RESEARCH</div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-32 bg-black border border-zinc-700 rounded-2xl p-6 text-lg font-light resize-y focus:outline-none focus:border-purple-500"
                placeholder="What do you want to research deeply? (e.g. latest breakthroughs in agentic AI...)"
              />
              <button 
                onClick={handleResearch}
                disabled={loading}
                className="mt-6 w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 py-4 rounded-2xl font-medium flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
              >
                <Play className="w-5 h-5" />
                {loading ? 'RESEARCHING THE WEB...' : 'START RESEARCH'}
              </button>
            </div>
          )}

          {(mode === 'crawl' || mode === 'extract') && (
            <div>
              <div className="text-xl font-semibold mb-2 text-cyan-400">DEEP CRAWL + STRUCTURED EXTRACTION</div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-2xl px-6 py-5 text-lg font-mono focus:outline-none focus:border-cyan-400 mb-4"
                placeholder="https://example.com/article"
              />
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-24 bg-black border border-zinc-700 rounded-2xl p-6 text-sm font-light resize-y focus:outline-none focus:border-cyan-400"
                placeholder="What to extract or instructions for crawl..."
              />
              <button 
                onClick={handleExtract}
                disabled={loading}
                className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 py-4 rounded-2xl font-medium text-black flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
              >
                <Download className="w-5 h-5" />
                {loading ? 'CRAWLING + EXTRACTING...' : 'RUN FIRECRAWL'}
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-black border border-zinc-800 rounded-3xl p-8">
            <div className="uppercase text-xs tracking-[2px] text-zinc-500 mb-4">RESULT</div>
            <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-light leading-relaxed overflow-auto max-h-[600px]">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
