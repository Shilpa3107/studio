'use server';

/**
 * @fileOverview A nothing agent that does nothing.
 *
 * - nothingAgent - A function that does nothing.
 * - NothingAgentInput - The input type for the nothingAgent function.
 * - NothingAgentOutput - The return type for the nothingAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NothingAgentInputSchema = z.object({
  prompt: z.string().describe('The user prompt.'),
});
export type NothingAgentInput = z.infer<typeof NothingAgentInputSchema>;

const NothingAgentOutputSchema = z.object({
  message: z.string().describe('A message confirming that nothing was done.'),
});
export type NothingAgentOutput = z.infer<typeof NothingAgentOutputSchema>;

export async function nothingAgent(
  input: NothingAgentInput
): Promise<NothingAgentOutput> {
  return nothingAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'nothingAgentPrompt',
  input: {schema: NothingAgentInputSchema},
  output: {schema: NothingAgentOutputSchema},
  prompt: `You are a helpful agent who can do nothing.
The user said: {{{prompt}}}
Respond by confirming you did nothing.`,
});

const nothingAgentFlow = ai.defineFlow(
  {
    name: 'nothingAgentFlow',
    inputSchema: NothingAgentInputSchema,
    outputSchema: NothingAgentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
