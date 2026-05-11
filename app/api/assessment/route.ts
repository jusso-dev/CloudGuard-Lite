import { NextResponse } from "next/server";
import { assessmentQuestions } from "@/lib/assessment/questions";
import { scoreAssessment } from "@/lib/assessment/scoring";

export async function POST(request: Request) {
  const form = await request.formData();
  const answers = assessmentQuestions.map((question) => {
    const raw = form.get(`answer:${question.id}`);
    const value =
      raw === "true" ? true : raw === "false" ? false : typeof raw === "string" ? raw : "";
    return { questionId: question.id, value };
  });

  return NextResponse.json(scoreAssessment(answers));
}
