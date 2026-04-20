/**
 * Build extra_prompt for AI quiz generation focused on missed concepts.
 * @param {Array<{ question_text?: string, is_correct?: boolean | null, feedback?: string, explanation?: string }>} questions
 */
export function buildWeakAreaExtraPrompt(questions) {
  const wrong = (questions || []).filter((q) => q.is_correct === false);
  if (wrong.length === 0) {
    return (
      "The student answered everything correctly on the last attempt. " +
      "Generate a new quiz with different wording that still covers the same document themes and difficulty."
    );
  }
  const lines = wrong.map((q, idx) => {
    const qtext = (q.question_text || "").replace(/\s+/g, " ").trim().slice(0, 400);
    const hint = (q.feedback || q.explanation || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 250);
    return `${idx + 1}. Missed: ${qtext}${hint ? ` Context: ${hint}` : ""}`;
  });
  return [
    "The student missed these items on a previous attempt. Write NEW questions (different wording) that test the same underlying concepts — do not copy the same question text.",
    ...lines,
  ].join("\n");
}

/** Count question types in a completed quiz payload. */
export function countQuestionTypes(questions) {
  let mc_count = 0;
  let fitb_count = 0;
  let fr_count = 0;
  for (const q of questions || []) {
    if (q.question_type === "mc") {
      mc_count += 1;
    } else if (q.question_type === "fitb") {
      fitb_count += 1;
    } else if (q.question_type === "free_response") {
      fr_count += 1;
    }
  }
  return { mc_count, fitb_count, fr_count };
}
