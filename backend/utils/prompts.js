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
  
  // Try to parse as number
  const expNum = parseInt(experience);
  if (!isNaN(expNum)) {
    if (expNum <= 2) return 'entry-level';
    if (expNum <= 5) return 'mid-level';
    return 'senior';
  }
  
  return experience || 'mid-level'; // Default fallback
};

// Generate prompt for interview questions based on role, experience, and topics
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
    promptTitle: `Interview Question Generator`,
    context: {
      role,
      experienceLevel,
      focusAreas: topicsList,
      questionCount
    },
    instructions: [
      `You are a senior technical interviewer with 10+ years of experience hiring for ${role} positions.`,
      `Generate ${questionCount} high-quality interview questions for a ${experienceLevel} ${role} candidate.`,
      `Ensure a mix of 40% conceptual, 40% practical, and 20% problem-solving/behavioral.`,
      `Include real-world scenarios relevant to the ${role}.`,
      `At least one scenario-based question if ${questionCount} >= 3.`,
      `Avoid overly theoretical questions and prioritize practical application.`,
      `Progress from basic to advanced topics.`,
      `Make questions specific enough to avoid generic answers.`,
      `Focus on ${experienceLevel === 'entry-level' ? 'fundamentals and learning ability' : experienceLevel === 'mid-level' ? 'practical problem-solving' : 'system design and leadership skills'}.`
    ],
    format: {
      question: "Q[Number]: [Clear, specific question]",
      idealAnswer: "[Comprehensive model answer]",
      keyPoints: ["• [Point 1]", "• [Point 2]", "• [Point 3]"],
      followUpQuestion: "[Related follow-up question]",
      evaluationCriteria: "[Guidance on scoring based on depth, clarity, and accuracy]"
    },
    note: "Begin generating the questions based on the structure and context provided."
  };
};


// Generate prompt to explain specific interview questions
export const conceptExplainPrompt = (question) => {
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    throw new Error('Question is required and must be a non-empty string');
  }

  return {
    title: `Interview Question Explanation`,
    question,
    sections: {
      whatTheyAreTesting: `Break down the core technical concept, skill, or competency being evaluated`,
      whyItMatters: `Explain the practical importance in real work scenarios and why companies ask this`,
      keyAreasToCover: [
        'Critical point 1',
        'Critical point 2',
        'Critical point 3',
        'Critical point 4'
      ],
      commonMistakes: [
        'Common error 1',
        'Common error 2',
        'Common error 3'
      ],
      proTips: [
        'Insider tip 1 - how to make your answer memorable',
        'Insider tip 2 - additional context or examples to include'
      ],
      sampleAnswerFramework: `Provide a structured approach to answering this question`,
      followUpQuestions: [
        'Follow-up question 1',
        'Follow-up question 2'
      ],
      strategy: `Keep explanations clear and practical. Focus on demonstrating both technical knowledge and problem-solving approach. Show communication skills through well-structured answers. Connect technical concepts to real-world applications. Prepare for follow-up questions that dive deeper.`
    },
    note: `Great candidates don't just answer questions correctly - they demonstrate their thinking process, show enthusiasm for the technology, and connect their knowledge to business value.`
  };
};
