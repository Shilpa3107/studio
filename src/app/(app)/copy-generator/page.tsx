'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateCopyVariations,
  type GenerateCopyVariationsOutput,
} from '@/ai/flows/copy-generator';
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ThumbsUp, ThumbsDown, Copy, Download, Sparkles, AlertCircle, Type } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard, exportText } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  productDescription: z
    .string()
    .min(10, { message: 'Please provide a more detailed product description.' }),
  targetAudience: z
    .string()
min(10, { message: 'Please describe the target audience in more detail.' }),
  campaignGoals: z
    .string()
    .min(10, { message: 'Please specify the campaign goals.' }),
});

type FeedbackState = {
  titles: Record<number, 'up' | 'down' | null>;
  taglines: Record<number, 'up' | 'down' | null>;
  adCopy: Record<number, 'up' | 'down' | null>;
};

export default function CopyGeneratorPage() {
  const [result, setResult] = useState<GenerateCopyVariationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({ titles: {}, taglines: {}, adCopy: {} });
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productDescription: '',
      targetAudience: '',
      campaignGoals: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setFeedback({ titles: {}, taglines: {}, adCopy: {} });

    try {
      const response = await generateCopyVariations(values);
      setResult(response);
    } catch (e) {
      setError('An error occurred. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (text: string, type: string, index: number) => {
    copyToClipboard(text).then(() => {
        toast({
          title: "Copied to clipboard!",
          description: `Generated ${type} #${index + 1} is ready to paste.`,
        });
    }).catch(err => {
        toast({
            variant: "destructive",
            title: "Copy failed",
            description: "Could not copy text to clipboard.",
        });
    });
  };

  const handleFeedback = (category: keyof FeedbackState, index: number, type: 'up' | 'down') => {
    setFeedback((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: prev[category][index] === type ? null : type,
      }
    }));
  };
  
  const handleExport = () => {
    if (!result) return;
    let content = '--- TITLES ---\n';
    content += result.titles.join('\n');
    content += '\n\n--- TAGLINES ---\n';
    content += result.taglines.join('\n');
    content += '\n\n--- AD COPY ---\n\n';
    content += result.adCopy.map((copy, i) => `Variation ${i + 1}:\n${copy}`).join('\n\n');
    exportText(content, 'generated-copy.txt');
  };

  const renderSection = (title: string, items: string[], category: keyof FeedbackState) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {items.map((item, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="p-4">
            <p>{item}</p>
          </CardContent>
          <CardFooter className="justify-end gap-1 bg-muted/50 p-2">
            <Button variant="ghost" size="icon" onClick={() => handleFeedback(category, index, 'up')} className={cn('h-7 w-7', feedback[category][index] === 'up' && 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400')}><ThumbsUp className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFeedback(category, index, 'down')} className={cn('h-7 w-7', feedback[category][index] === 'down' && 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400')}><ThumbsDown className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(item, title, index)}><Copy className="h-4 w-4" /></Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Copy Generator"
        description="Generate compelling ad copy, titles, and taglines that convert."
      >
        {result && (
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2" />
            Export All
          </Button>
        )}
      </PageHeader>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Brief</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="productDescription" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Description</FormLabel>
                        <FormControl><Textarea placeholder="e.g., An advanced, AI-powered grammar checker..." rows={4} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="targetAudience" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <FormControl><Textarea placeholder="e.g., Students, professional writers, non-native English speakers..." rows={4} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="campaignGoals" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Goals</FormLabel>
                          <FormControl><Textarea placeholder="e.g., Increase sign-ups for the free trial by 20%..." rows={4} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Generating...' : <><Sparkles className="mr-2" /> Generate Copy</>}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card className="min-h-[500px]">
              <CardHeader>
                <CardTitle>Generated Copy</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="space-y-6">
                    <div>
                        <Skeleton className="h-5 w-24 mb-4" />
                        <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                     <div>
                        <Skeleton className="h-5 w-24 mb-4" />
                        <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
                    </div>
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
                           <Type className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <p className="mt-4 text-lg font-medium">Your generated copy will appear here.</p>
                        <p className="text-muted-foreground">Fill out the brief and let our AI do the writing.</p>
                    </div>
                )}
                {result && (
                  <div className="space-y-6 animate-in fade-in-50 duration-500">
                    {renderSection('Titles', result.titles, 'titles')}
                    <Separator />
                    {renderSection('Taglines', result.taglines, 'taglines')}
                    <Separator />
                    {renderSection('Ad Copy', result.adCopy, 'adCopy')}
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
