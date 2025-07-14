// Helper function to standardize experience levels
const getExperienceLevel = (experience) => {
  if (typeof experience === 'string') {
    const exp = experience.toLowerCase();
    if (exp.includes('entry') || exp.includes('junior') || exp.includes('fresher') || exp.includes('0-2')) {
      return 'entry-level';
    } else if (exp.includes('mid') || exp.includes('intermediate') || exp.includes('2-5')) {
      return 'mid-level';
    } else if (exp.includes('senior') || exp.includes('5+') || exp.includes('expert') || exp.includes('lead')) {
      return 'senior';
    }
  }
  const expNum = parseInt(experience);
  if (!isNaN(expNum)) {
    if (expNum <= 2) return 'entry-level';
    if (expNum <= 5) return 'mid-level';
    return 'senior';
  }
  return experience || 'mid-level';
};

export const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions = 5) => {
  if (!role || !experience) {
    throw new Error('Role and experience are required parameters');
  }

  const experienceLevel = getExperienceLevel(experience);
  const topicsList = topicsToFocus && topicsToFocus.length > 0 
    ? topicsToFocus.join(", ") 
    : "general technical skills";

  const questionCount = Math.min(Math.max(numberOfQuestions, 1), 10);

  return {
    promptTitle: `🎯 Interview Question Generator`,
    context: {
      role,
      experienceLevel,
      focusAreas: topicsList,
      questionCount
    },
    instructions: [
      `**You are a senior technical interviewer** with 10+ years of experience hiring for ${role} positions.`,
      `Generate **${questionCount} high-quality interview questions** for a ${experienceLevel} ${role} candidate.`,
      `📊 **Question Mix**: 40% conceptual, 40% practical, 20% problem-solving/behavioral.`,
      `🎯 **Real-world focus**: Include scenarios relevant to the ${role}.`,
      `💡 **Scenario requirement**: At least one scenario-based question if ${questionCount} >= 3.`,
      `✅ **Practical over theoretical**: Prioritize practical application.`,
      `📈 **Progressive difficulty**: From basic to advanced topics.`,
      `🔍 **Specific questions**: Avoid generic answers.`,
      `🎨 **Experience-focused**: ${experienceLevel === 'entry-level' ? '**Fundamentals & learning ability**' : experienceLevel === 'mid-level' ? '**Practical problem-solving**' : '**System design & leadership skills**'}.`
    ],
    formatInstructions: `
**Each question follows this exact format:**

**Q1:** [The interview question goes here]

**Answer:**
[Detailed and structured answer]

**Key Points:**
• [Key Point 1]
• [Key Point 2]

**Follow-up:**
[Follow-up question based on the topic]

**Evaluation:**
[What makes an excellent vs. average answer]
`.trim(),
    note: "🚀 **Begin generating questions** using the format and context provided above. Output must be clearly structured with line breaks and bullet points."
  };
};

export const conceptExplainPrompt = (question) => {
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    throw new Error('Question is required and must be a non-empty string');
  }

  return {
    title: `💡 Interview Question Explanation`,
    question,
    sections: {
      whatTheyAreTesting: `🔍 **Core Evaluation**: Break down the technical concept, skill, or competency being tested`,
      whyItMatters: `🎯 **Business Impact**: Explain practical importance in real work scenarios and why companies ask this`,
      keyAreasToCover: [
        '✅ Critical point 1',
        '✅ Critical point 2',
        '✅ Critical point 3'
      ],
      commonMistakes: [
        '❌ Common error 1',
        '❌ Common error 2'
      ],
      proTips: [
        '🌟 **Pro tip 1** - how to make your answer memorable',
        '🌟 **Pro tip 2** - additional context or examples to include'
      ],
      sampleAnswerFramework: `📋 **Structured Approach**: Provide a clear framework for answering this question`,
      followUpQuestions: [
        '❓ Follow-up question 1',
        '❓ Follow-up question 2'
      ],
      strategy: `🚀 **Strategy**: Keep explanations **clear and practical**. Focus on demonstrating both **technical knowledge** and **problem-solving approach**. Show **communication skills** through well-structured answers. Connect technical concepts to **real-world applications**. Prepare for follow-up questions that dive deeper.`
    },
    note: `💪 **Success Formula**: Great candidates don't just answer correctly - they demonstrate their **thinking process**, show **enthusiasm for technology**, and connect knowledge to **business value**.`
  };
};