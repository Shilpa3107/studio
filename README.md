# Ad Agency AI Assistant

This is a Next.js application built with Firebase Studio that provides a suite of AI-powered tools to assist with advertising campaigns. It leverages Genkit and Google's Gemini models to offer creative assistance.

## Features & AI Agents

This application includes several AI agents designed to help with different stages of the creative process:

### 1. Campaign Brainstormer
- **File:** `src/app/(app)/campaign-brainstormer/page.tsx`
- **Agent Flow:** `src/ai/flows/campaign-brainstormer.ts`

This agent helps you brainstorm high-level campaign ideas. By providing details about your product and target audience, the agent will generate several distinct campaign concepts to kickstart your marketing strategy.

### 2. Copy Generator
- **File:** `src/app/(app)/copy-generator/page.tsx`
- **Agent Flow:** `src/ai/flows/copy-generator.ts`

Once you have a campaign direction, the Copy Generator can create compelling ad copy. Based on a brief that includes product description, audience, and goals, it generates multiple variations of titles, taglines, and full ad copy.

### 3. Image Idea Generator
- **File:** `src/app/(app)/image-idea-generator/page.tsx`
- **Agent Flow:** `src/ai/flows/image-idea-generator.ts`

This agent is your creative director for visuals. Describe your campaign concept, and it will produce three distinct visual ideas. Each idea includes a title, a detailed description of the scene, and a suggested art style (e.g., photorealistic, minimalist).

This page also integrates the Image Generator agent, allowing you to create an image for any of the generated ideas with a single click.

### 4. Image Generator
- **Agent Flow:** `src/ai/flows/image-generator.ts`

This is a specialized agent that takes a text prompt and generates an image using Google's `gemini-2.0-flash-preview-image-generation` model. It is used by the "Image Idea Generator" page to bring visual concepts to life.

## Getting Started

To get started, simply navigate to one of the tool pages using the sidebar and fill out the required forms. The AI will then generate creative assets for you.
