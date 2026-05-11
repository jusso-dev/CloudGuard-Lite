import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { assessmentQuestions } from "@/lib/assessment/questions";
import { demoAssessmentSummary, demoAnswers } from "@/lib/fixtures/demo-data";

function defaultValue(questionId: string) {
  return demoAnswers.find((answer) => answer.questionId === questionId)?.value;
}

export default function AssessmentPage() {
  const categories = Array.from(new Set(assessmentQuestions.map((question) => question.category)));

  return (
    <AppShell
      title="Assessment"
      description="Answer lightweight security questions to calculate posture, high-risk gaps, and suggested policies."
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Maturity score" value={`${demoAssessmentSummary.maturityScore}/100`} />
        <StatCard
          label="High-risk gaps"
          value={demoAssessmentSummary.highRiskGaps.length}
          detail="Based on weighted answers"
        />
        <StatCard
          label="Progress"
          value={`${demoAssessmentSummary.completedQuestions}/${demoAssessmentSummary.totalQuestions}`}
          detail="Questions answered"
        />
      </div>

      <form action="/api/assessment" method="post" className="space-y-6">
        {categories.map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              {assessmentQuestions
                .filter((question) => question.category === category)
                .map((question) => (
                  <div key={question.id} className="grid gap-2 rounded-md border p-4">
                    <Label htmlFor={question.id}>{question.text}</Label>
                    <p className="text-sm text-muted-foreground">{question.helpText}</p>
                    <input type="hidden" name="questionId" value={question.id} />
                    {question.answerType === "yes_no" ? (
                      <Select
                        id={question.id}
                        name={`answer:${question.id}`}
                        defaultValue={String(defaultValue(question.id) ?? "false")}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </Select>
                    ) : question.answerType === "maturity" ? (
                      <Select
                        id={question.id}
                        name={`answer:${question.id}`}
                        defaultValue={String(defaultValue(question.id) ?? "developing")}
                      >
                        <option value="none">None</option>
                        <option value="informal">Informal</option>
                        <option value="developing">Developing</option>
                        <option value="managed">Managed</option>
                        <option value="optimized">Optimized</option>
                      </Select>
                    ) : question.answerType === "multiple_choice" ? (
                      <Select
                        id={question.id}
                        name={`answer:${question.id}`}
                        defaultValue={String(defaultValue(question.id) ?? question.options?.[0])}
                      >
                        {question.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Textarea
                        id={question.id}
                        name={`answer:${question.id}`}
                        defaultValue={String(defaultValue(question.id) ?? "")}
                      />
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
        <Button>Save assessment</Button>
      </form>
    </AppShell>
  );
}
