'use server';
/**
 * @fileOverview Detects crisis language in user input and provides a helpline redirection.
 *
 * - detectCrisisLanguage - A function that checks for crisis language and returns a redirection flag.
 * - DetectCrisisLanguageInput - The input type for the detectCrisisLanguage function.
 * - DetectCrisisLanguageOutput - The return type for the detectCrisisLanguage function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const DetectCrisisLanguageInputSchema = z.object({
  text: z.string().describe('The user input text to check for crisis language.'),
});
export type DetectCrisisLanguageInput = z.infer<typeof DetectCrisisLanguageInputSchema>;

const DetectCrisisLanguageOutputSchema = z.object({
  isCrisis: z.boolean().describe('Whether the input text indicates a crisis situation.'),
});
export type DetectCrisisLanguageOutput = z.infer<typeof DetectCrisisLanguageOutputSchema>;

export async function detectCrisisLanguage(input: DetectCrisisLanguageInput): Promise<DetectCrisisLanguageOutput> {
  return detectCrisisLanguageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectCrisisLanguagePrompt',
  input: {
    schema: z.object({
      text: z.string().describe('The user input text to check for crisis language.'),
    }),
  },
  output: {
    schema: z.object({
      isCrisis: z.boolean().describe('Whether the input text indicates a crisis situation.'),
    }),
  },
  prompt: `You are an AI assistant designed to detect crisis language in user input.

  Analyze the following text and determine if it indicates a crisis situation requiring immediate support.
  Respond with true if the text suggests a crisis, and false otherwise.

  Text: {{{text}}}
  `,
});

const detectCrisisLanguageFlow = ai.defineFlow<
  typeof DetectCrisisLanguageInputSchema,
  typeof DetectCrisisLanguageOutputSchema
>({
  name: 'detectCrisisLanguageFlow',
  inputSchema: DetectCrisisLanguageInputSchema,
  outputSchema: DetectCrisisLanguageOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
