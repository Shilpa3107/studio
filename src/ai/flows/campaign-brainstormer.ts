'use server';

/**
 * @fileOverview Campaign Brainstormer AI agent.
 *
 * - campaignBrainstormer - A function that handles the campaign brainstorming process.
 * - CampaignBrainstormerInput - The input type for the campaignBrainstormer function.
 * - CampaignBrainstormerOutput - The return type for the campaignBrainstormer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CampaignBrainstormerInputSchema = z.object({
  productDetails: z.string().describe('Details about the product or service.'),
  targetAudience: z.string().describe('Information about the target audience.'),
});
export type CampaignBrainstormerInput = z.infer<typeof CampaignBrainstormerInputSchema>;

const CampaignBrainstormerOutputSchema = z.object({
  campaignIdeas: z.array(
    z.string().describe('A creative campaign idea for the product.')
  ).describe('A list of creative campaign ideas.'),
});
export type CampaignBrainstormerOutput = z.infer<typeof CampaignBrainstormerOutputSchema>;

export async function campaignBrainstormer(
  input: CampaignBrainstormerInput
): Promise<CampaignBrainstormerOutput> {
  return campaignBrainstormerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'campaignBrainstormerPrompt',
  input: {schema: CampaignBrainstormerInputSchema},
  output: {schema: CampaignBrainstormerOutputSchema},
  prompt: `You are a marketing expert. Generate creative campaign ideas based on the product details and target audience information provided.

Product Details: {{{productDetails}}}
Target Audience: {{{targetAudience}}}

Generate at least 3 campaign ideas.`,
});

const campaignBrainstormerFlow = ai.defineFlow(
  {
    name: 'campaignBrainstormerFlow',
    inputSchema: CampaignBrainstormerInputSchema,
    outputSchema: CampaignBrainstormerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
