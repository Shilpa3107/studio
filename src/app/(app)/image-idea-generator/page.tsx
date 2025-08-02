'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  imageIdeaGenerator,
  type ImageIdeaGeneratorOutput,
} from '@/ai/flows/image-idea-generator';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Camera, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  campaignConcept: z
    .string()
    .min(10, { message: 'Please describe your campaign concept in more detail.' }),
});

export default function ImageIdeaGeneratorPage() {
  const [result, setResult] = useState<ImageIdeaGeneratorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaignConcept: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await imageIdeaGenerator(values);
      setResult(response);
    } catch (e) {
      setError('An error occurred. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Image Idea Generator"
        description="Generate stunning visual concepts for your ad campaigns."
      />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Concept</CardTitle>
                <CardDescription>
                  Describe your campaign to get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="campaignConcept"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., A campaign for a new eco-friendly sneaker made from recycled materials, targeting young, urban consumers."
                              rows={6}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                          'Generating...'
                      ) : (
                        <>
                            <Sparkles className="mr-2" /> Generate Ideas
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card className="min-h-[500px]">
              <CardHeader>
                <CardTitle>Visual Concepts</CardTitle>
                <CardDescription>
                    Your generated image ideas will appear here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-5 w-1/3" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-4/5" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {!isLoading && !result && !error && (
                    <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                        <div className="p-4 bg-secondary rounded-full">
                           <Camera className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <p className="mt-4 text-lg font-medium">Ready for some visual inspiration?</p>
                        <p className="text-muted-foreground">Describe your campaign concept to see the ideas.</p>
                    </div>
                )}
                {result && (
                  <div className="space-y-4 animate-in fade-in-50 duration-500">
                    {result.imageIdeas.map((idea, index) => (
                      <Card key={index} className="shadow-md">
                        <CardHeader>
                            <CardTitle className='flex justify-between items-start'>
                                {idea.title}
                                <Badge variant="outline">{idea.artStyle}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{idea.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
