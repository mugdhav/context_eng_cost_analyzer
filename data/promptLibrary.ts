export interface PromptSet {
  category: string;
  title: string;
  baseText: string;
  simplePrompt: string;
  contextPrompt: string;
}

export const PROMPT_LIBRARY: PromptSet[] = [
  {
    category: "Logic & Reasoning",
    title: "The Hat Puzzle",
    baseText: "Three friends, Alice, Bob, and Charlie, are wearing hats. They know the hats are drawn from a set of 2 red and 3 blue hats. They can see others' hats but not their own. Alice sees a red hat on Bob and a blue hat on Charlie. Bob sees a blue hat on Charlie. Charlie cannot see any hats. All three are perfect logicians and tell the truth. \n\nAlice is asked: 'Do you know the color of your hat?' She says: 'No.'\nThen Bob is asked: 'Do you know the color of your hat?' He says: 'No.'\nFinally, Charlie is asked: 'Do you know the color of your hat?'",
    simplePrompt: "What color is Charlie's hat and why?",
    contextPrompt: "You are an expert in epistemic logic and deductive reasoning.\n\nYour task is to solve the riddle by analyzing the knowledge state of each agent (Alice, Bob, Charlie) sequentially.\n1. Analyze what Alice's answer implies about the hat combination she sees.\n2. Analyze what Bob's answer implies, given Alice's previous answer and what he sees.\n3. Deduce what Charlie must know based on the silence/answers of the previous two.\n\nProvide the solution with a clear, step-by-step logical proof."
  },
  {
    category: "Finance & Tax",
    title: "Corporate Tax Calculation",
    baseText: "Company XYZ Financial Data for FY2023:\n- Gross Revenue: $4,500,000\n- Cost of Goods Sold (COGS): $2,100,000\n- Operating Expenses (OpEx): $1,800,000\n  (Note: OpEx includes $200,000 in qualified research expenses)\n- Standard Corporate Tax Rate: 21%\n\nThe company intends to claim a federal R&D tax credit. For this scenario, assume the R&D credit is calculated as a flat 10% of qualified research expenses.",
    simplePrompt: "Calculate the net income after tax for Company XYZ.",
    contextPrompt: "You are a Senior Corporate Tax Accountant.\n\nPerform a detailed calculation of Company XYZ's Net Income after Tax. You must:\n1. Calculate Gross Profit.\n2. Calculate Earnings Before Interest and Taxes (EBIT) / Taxable Income.\n3. Calculate the gross tax liability before credits.\n4. Calculate the R&D Tax Credit value.\n5. Determine the Final Tax Liability and Effective Tax Rate.\n6. State the final Net Income.\n\nFormat your response as a professional financial summary table."
  },
  {
    category: "Medicine",
    title: "Endocrine Case Study",
    baseText: "Patient Profile: 54-year-old female.\nChief Complaint: Increasing fatigue, weight gain (15 lbs in 2 months), and sensitivity to cold.\nHistory: Bipolar disorder, managed on Lithium Carbonate for 12 years.\nVitals: HR 58 bpm, BP 110/70.\nLabs:\n- TSH: 8.5 mIU/L (Reference: 0.4 - 4.0)\n- Free T4: 0.7 ng/dL (Reference: 0.8 - 1.8)\n- Sodium: 138 mEq/L",
    simplePrompt: "What is the diagnosis and what caused it?",
    contextPrompt: "You are a Board-Certified Endocrinologist.\n\nEvaluate the patient's clinical presentation and lab results.\n1. Provide the primary diagnosis based on the TSH and Free T4 values.\n2. Explain the pathophysiology of how the patient's long-term medication (Lithium) likely contributed to this condition.\n3. Recommend a management plan, addressing both the endocrine issue and the psychiatric medication.\n\nUse professional medical terminology."
  },
  {
    category: "Mathematics",
    title: "Optimization Problem",
    baseText: "Problem statement: A farmer has 100 meters of fencing and wants to enclose a rectangular plot of land that borders a straight river. No fence is needed along the river.",
    simplePrompt: "Find the dimensions that maximize the area.",
    contextPrompt: "You are a Calculus Professor teaching an undergraduate class on optimization.\n\nSolve the problem by:\n1. Defining the variables and the objective function A(x).\n2. Determining the constraint equation and the domain of the variable.\n3. Finding the critical points using the first derivative test.\n4. Verifying the maximum using the second derivative test.\n5. Explaining the geometric intuition behind the answer."
  },
  {
    category: "Language",
    title: "Idiom Translation",
    baseText: "Original English Text: 'The project manager decided to bite the bullet and call it a day, realizing the team was barking up the wrong tree with the current marketing strategy. It was time to go back to the drawing board.'",
    simplePrompt: "Translate this text into professional French.",
    contextPrompt: "You are a professional Business Translator and Linguist.\n\nTranslate the provided English text into formal, corporate French.\n- Do NOT translate idioms literally.\n- Replace 'bite the bullet' with a phrase implying making a difficult decision.\n- Replace 'call it a day' with a phrase implying ending the work session.\n- Replace 'barking up the wrong tree' with a phrase implying a misguided approach.\n- Ensure the tone is suitable for a business report.\n\nProvide the French translation followed by a glossary explaining the choice of French idioms used."
  }
];