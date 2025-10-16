import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Loader2 } from 'lucide-react'

export function SearchForm({ onSearch, isLoading }) {
  const [companyName, setCompanyName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (companyName.trim()) {
      onSearch(companyName.trim())
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Visibility Search Tool
        </CardTitle>
        <CardDescription className="text-lg">
          Analyze company visibility across multiple AI platforms using proprietary ranking methodologies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter URL to analyze (e.g., https://www.apple.com )"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !companyName.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

