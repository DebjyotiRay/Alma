import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface AssessmentResultProps {
  result: any
}

export function AssessmentResult({ result }: AssessmentResultProps) {
  if (!result || result.status !== "success") {
    return (
      <Card className="w-full border-destructive">
        <CardHeader className="pb-2">
          <CardTitle className="text-destructive flex items-center">
            <XCircle className="mr-2 h-5 w-5" />
            Analysis Failed
          </CardTitle>
          <CardDescription>{result?.message || "Unable to process the CV file"}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const assessment = result.assessment
  const rating = assessment.qualification_rating.toLowerCase()

  const getBadgeVariant = (rating: string) => {
    switch (rating) {
      case "excellent":
        return "default"
      case "good":
        return "secondary"
      case "moderate":
        return "outline"
      default:
        return "destructive"
    }
  }

  const getIcon = (rating: string) => {
    switch (rating) {
      case "excellent":
      case "good":
        return <CheckCircle2 className="mr-2 h-5 w-5" />
      case "moderate":
        return <AlertCircle className="mr-2 h-5 w-5" />
      default:
        return <XCircle className="mr-2 h-5 w-5" />
    }
  }

  // Get top 3 criteria
  const detailedAssessment = assessment.detailed_assessment || {}
  const sortedCriteria = Object.entries(detailedAssessment)
    .sort((a: any, b: any) => b[1].confidence - a[1].confidence)
    .slice(0, 3)

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            {getIcon(rating)}
            Assessment Results
          </CardTitle>
          <Badge variant={getBadgeVariant(rating)} className="capitalize">
            {assessment.qualification_rating}
          </Badge>
        </div>
        <CardDescription>{assessment.rating_explanation}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Top Criteria:</h3>
            <ul className="space-y-2">
              {sortedCriteria.map(([name, criterion]: [string, any], index) => (
                <li key={index} className="text-sm">
                  <div className="font-medium">
                    {index + 1}. {name}
                  </div>
                  <div className="text-muted-foreground">Confidence: {(criterion.confidence * 100).toFixed(0)}%</div>
                  {criterion.matches && criterion.matches.length > 0 && (
                    <div className="text-xs mt-1 text-muted-foreground">
                      Key evidence: {criterion.matches[0].substring(0, 100)}...
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

