import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function UrlAnalysisResults({ data }) {
  if (!data) return null

  const analysisCategories = [
    { key: 'content_quality', label: 'Content Quality' },
    { key: 'relevance_and_intent', label: 'Relevance & Intent' },
    { key: 'source_credibility', label: 'Source Credibility' },
    { key: 'content_structure', label: 'Content Structure' },
    { key: 'freshness_and_timeliness', label: 'Freshness & Timeliness' },
    { key: 'user_engagement_potential', label: 'User Engagement Potential' },
    { key: 'technical_seo', label: 'Technical SEO' }
  ]

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
  }

  const getTrendIcon = (score) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (score >= 60) return <Minus className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const overallScore = data.overall_score?.value || 0

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">URL Analysis Results</CardTitle>
          <CardDescription>
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
              {data.url}
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </p>
            </div>
            <div className="text-right">
              {getTrendIcon(overallScore)}
              {getScoreBadge(overallScore)}
            </div>
          </div>
          {data.overall_score?.interpretation && (
            <p className="text-sm text-muted-foreground mt-4">
              {data.overall_score.interpretation}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysisCategories.map(category => {
          const categoryData = data[category.key] || {}
          const score = categoryData.score || 0
          const findings = categoryData.findings || []

          return (
            <Card key={category.key}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.label}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(score)}
                    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                      {score}
                    </span>
                  </div>
                </div>
                {getScoreBadge(score)}
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={score} className="h-2" />
                <div className="space-y-2">
                  {findings.map((finding, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground">
                      • {finding}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
