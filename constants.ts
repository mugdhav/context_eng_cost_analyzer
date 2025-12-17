export const DEFAULT_BASE_TEXT = `Starlink is a satellite internet constellation operated by American aerospace company SpaceX, providing coverage to over 60 countries. It also aims for global mobile phone service after 2023. SpaceX started launching Starlink satellites in 2019. As of early 2024, it consists of over 5,500 mass-produced small satellites in low Earth orbit (LEO), which communicate with designated ground transceivers. In total, nearly 12,000 satellites are planned to be deployed, with a possible later extension to 42,000. SpaceX announced reaching more than 2 million subscribers in September 2023.

The LEO orbit of the satellites allows for lower latency (25-50ms) compared to geostationary satellites (600ms+), making it suitable for real-time applications like video calls and gaming. However, astronomers have raised concerns about the constellation's effect on ground-based astronomy and the potential for orbital debris.`;

export const DEFAULT_SIMPLE_PROMPT = "Summarize this text.";

export const DEFAULT_CONTEXT_PROMPT = `You are a skeptical technology investment analyst evaluating SpaceX. 

Your goal is to summarize the provided text for a potential investor who is concerned about risks.
- Focus on potential downsides or operational challenges mentioned (or implied).
- Use a professional, slightly critical tone.
- Format the output as a Markdown table comparing "Features" vs "Potential Risks".
- Keep the summary under 150 words.`;

// Pricing for Gemini 1.5 Flash (Example rates, can be adjusted)
// $0.075 per 1M input tokens
// $0.30 per 1M output tokens
export const PRICING = {
  INPUT_PER_1M: 0.075,
  OUTPUT_PER_1M: 0.30
};