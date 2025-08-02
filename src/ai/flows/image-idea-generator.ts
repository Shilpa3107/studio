'use server';
/**
 * @fileOverview Image Idea Generator AI agent.
 *
 * - imageIdeaGenerator - A function that handles the image idea generation process.
 * - ImageIdeaGeneratorInput - The input type for the imageIdeaGenerator function.
 * - ImageIdeaGeneratorOutput - The return type for the imageIdeaGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageIdeaGeneratorInputSchema = z.object({
  campaignConcept: z
    .string()
    .describe('A brief description of the ad campaign concept.'),
});
export type ImageIdeaGeneratorInput = z.infer<
  typeof ImageIdeaGeneratorInputSchema
>;

const ImageIdeaGeneratorOutputSchema = z.object({
  imageIdeas: z
    .array(
      z.object({
        title: z.string().describe('A short title for the image idea.'),
        description: z
          .string()
          .describe('A detailed description of the visual elements.'),
        artStyle: z.string().describe('The suggested art style (e.g., "photorealistic", "minimalist", "watercolor").'),
      })
    )
    .describe('A list of creative image ideas.'),
});
export type ImageIdeaGeneratorOutput = z.infer<
  typeof ImageIdeaGeneratorOutputSchema
>;

export async function imageIdeaGenerator(
  input: ImageIdeaGeneratorInput
): Promise<ImageIdeaGeneratorOutput> {
  return imageIdeaGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageIdeaGeneratorPrompt',
  input: {schema: ImageIdeaGeneratorInputSchema},
  output: {schema: ImageIdeaGeneratorOutputSchema},
  prompt: `You are a creative director at an ad agency. Brainstorm 3 distinct and compelling visual concepts for an ad campaign.

For each concept, provide a title, a detailed description of the visuals, and a suggested art style.

Campaign Concept: {{{campaignConcept}}}`,
});

const imageIdeaGeneratorFlow = ai.defineFlow(
  {
    name: 'imageIdeaGeneratorFlow',
    inputSchema: ImageIdeaGeneratorInputSchema,
    outputSchema: ImageIdeaGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
