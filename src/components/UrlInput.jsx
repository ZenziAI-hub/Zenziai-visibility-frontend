import { useState } from 'react'
import { Search, AlertCircle } from 'lucide-react'
import { AnalysisResults } from './AnalysisResults'

export function UrlInput() {
  const [url, setUrl] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      // Replace with your actual backend URL
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze URL')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the URL')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Visibility</h1>
          <p className="text-slate-400">Analyze URLs and gain insights across AI platforms</p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg mb-8 border border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Enter a URL to analyze..."
              className="flex-1 px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Search size={20} />
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6 flex gap-3 items-start">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-100">{error}</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
            <AnalysisResults data={results} />
          </div>
        )}

        {/* Empty State */}
        {!results && !error && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Enter a URL and click analyze to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
