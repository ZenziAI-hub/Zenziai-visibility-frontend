import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react'

export function AnalysisResults({ data }) {
  if (!data) return null

  const platforms = [
    { id: 'chatgpt', name: 'ChatGPT', provider: 'OpenAI' },
    { id: 'claude', name: 'Claude', provider: 'Anthropic' },
    { id: 'perplexity', name: 'Perplexity AI', provider: 'Perplexity' },
    { id: 'arc_search', name: 'Arc Search', provider: 'The Browser Company' },
    { id: 'searchgpt', name: 'SearchGPT', provider: 'OpenAI' }
  ]

  const methodologies = [
    { id: 'cidr', name: 'CIDR', fullName: 'Contextual Intent-Driven Ranking' },
    { id: 'scvs', name: 'SCVS', fullName: 'Source Credibility & Verifiability Score' },
    { id: 'acso', name: 'ACSO', fullName: 'Adaptive Content Structure Optimization' },
    { id: 'uifl', name: 'UIFL', fullName: 'User Interaction & Feedback Loop' }
  ]

  // Prepare data for charts
  const platformData = platforms.map(platform => {
    const scores = data[`${platform.id}_scores`] || {}
    const avgScore = methodologies.reduce((sum, method) => {
      return sum + (scores[method.id]?.score || 0)
    }, 0) / methodologies.length

    return {
      name: platform.name,
      score: Math.round(avgScore),
      ...methodologies.reduce((acc, method) => {
        acc[method.id] = scores[method.id]?.score || 0
        return acc
      }, {})
    }
  })

  const methodologyData = methodologies.map(method => {
    const avgScore = platforms.reduce((sum, platform) => {
      const scores = data[`${platform.id}_scores`] || {}
      return sum + (scores[method.id]?.score || 0)
    }, 0) / platforms.length

    return {
      name: method.name,
      fullName: method.fullName,
      score: Math.round(avgScore)
    }
  })

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score) => {
    if (score >= 80) return <Badge variant="default" className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 60) return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Good</Badge>
    return <Badge variant="default" className="bg-red-100 text-red-800">Needs Improvement</Badge>
  }

  const getTrendIcon = (score) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (score >= 60) return <Minus className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Analysis Results for {data.company_name}</CardTitle>
          <CardDescription>
            Comprehensive AI visibility analysis across 5 platforms and 4 methodologies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <Info className="h-4 w-4 inline mr-1" />
            {data.insights}
          </div>
        </CardContent>
      </Card>

      {/* Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Average scores across all methodologies</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Methodology Performance</CardTitle>
            <CardDescription>Average scores across all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={methodologyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="platforms" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="platforms">By Platform</TabsTrigger>
          <TabsTrigger value="methodologies">By Methodology</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map(platform => {
              const scores = data[`${platform.id}_scores`] || {}
              const avgScore = methodologies.reduce((sum, method) => {
                return sum + (scores[method.id]?.score || 0)
              }, 0) / methodologies.length

              return (
                <Card key={platform.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <CardDescription>{platform.provider}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(avgScore)}
                        <span className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>
                          {Math.round(avgScore)}
                        </span>
                      </div>
                    </div>
                    {getScoreBadge(avgScore)}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {methodologies.map(method => {
                      const methodScore = scores[method.id]?.score || 0
                      return (
                        <div key={method.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{method.name}</span>
                            <span className={getScoreColor(methodScore)}>{methodScore}/100</span>
                          </div>
                          <Progress value={methodScore} className="h-2" />
                          {scores[method.id]?.comment && (
                            <p className="text-xs text-muted-foreground">
                              {scores[method.id].comment}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="methodologies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {methodologies.map(method => {
              const avgScore = platforms.reduce((sum, platform) => {
                const scores = data[`${platform.id}_scores`] || {}
                return sum + (scores[method.id]?.score || 0)
              }, 0) / platforms.length

              return (
                <Card key={method.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{method.name}</CardTitle>
                        <CardDescription>{method.fullName}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(avgScore)}
                        <span className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>
                          {Math.round(avgScore)}
                        </span>
                      </div>
                    </div>
                    {getScoreBadge(avgScore)}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {platforms.map(platform => {
                      const scores = data[`${platform.id}_scores`] || {}
                      const platformScore = scores[method.id]?.score || 0
                      return (
                        <div key={platform.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{platform.name}</span>
                            <span className={getScoreColor(platformScore)}>{platformScore}/100</span>
                          </div>
                          <Progress value={platformScore} className="h-2" />
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

