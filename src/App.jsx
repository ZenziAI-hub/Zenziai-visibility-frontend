import { useState } from 'react'
import { SearchForm } from './components/SearchForm'
import { AnalysisResults } from './components/AnalysisResults'
import './App.css'

function App() {
  const [analysisData, setAnalysisData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (companyName) => {
    setIsLoading(true)
    setError(null)
    setAnalysisData(null)
    console.log('URL being sent to backend:', companyName)

    try {
      const response = await fetch('http://127.0.0.1:5000/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: companyName }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Something went wrong')
      }

      const result = await response.json()
      setAnalysisData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto py-8 space-y-8">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Error: {error}</p>
            </div>
          </div>
        )}

        {analysisData && <AnalysisResults data={analysisData} />}
      </div>
    </div>
  )
}

export default App
