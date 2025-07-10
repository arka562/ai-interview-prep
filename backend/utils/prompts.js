// Generate prompt for interview questions based on role, experience, and topics
export const questionAnswerPrompt = (role, experience, topics) => {
  const experienceLevel = getExperienceLevel(experience);
  const topicsList = topics.length > 0 ? topics.join(", ") : "general technical skills";
  
  return `
You are a senior technical interviewer with 10+ years of experience hiring for ${role} positions.

Generate 5 high-quality, realistic interview questions for a ${experienceLevel} ${role} candidate.

**Focus Areas:** ${topicsList}

**Requirements:**
- Questions should be appropriate for ${experienceLevel} level
- Mix of conceptual, practical, and problem-solving questions
- Questions should test both depth and breadth of knowledge
- Include at least one scenario-based or behavioral question
- Avoid overly theoretical questions; focus on practical application

**For each question, provide:**
1. **Question:** Clear, specific, and realistic
2. **Model Answer:** Comprehensive answer that demonstrates strong understanding
3. **Key Points:** 3-4 essential points the candidate should cover
4. **Follow-up:** One potential follow-up question an interviewer might ask

**Format:**
Q1: [Question]
A1: [Model Answer]
Key Points: [Key points to cover]
Follow-up: [Follow-up question]

Q2: [Question]
A2: [Model Answer]
Key Points: [Key points to cover]
Follow-up: [Follow-up question]

[Continue for all 5 questions]

**Note:** Ensure questions progress from fundamental concepts to more advanced topics, reflecting a real interview flow.
`;
};

// Generate prompt to explain specific interview questions
export const conceptExplainPrompt = (questions) => {
  return `
You are a technical mentor helping candidates prepare for interviews.

Please provide detailed explanations for the following interview questions to help candidates understand what interviewers are looking for.

**For each question, provide:**
1. **What the question is really asking:** Break down the core concept being tested
2. **Why it matters:** Explain the practical importance in real work scenarios
3. **Key areas to cover:** Main points a strong answer should include
4. **Common mistakes:** What candidates often get wrong or miss
5. **Pro tip:** One insider tip to make the answer stand out

**Questions to explain:**
${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

**Format for each question:**
**Question ${1}:** [Question text]
**What they're really asking:** [Core concept explanation]
**Why it matters:** [Practical importance]
**Key areas to cover:** [Main points to include]
**Common mistakes:** [What to avoid]
**Pro tip:** [How to excel]

---

Keep explanations clear, practical, and focused on helping candidates succeed in their interviews.
`;
};