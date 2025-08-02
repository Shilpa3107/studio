'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  campaignBrainstormer,
  type CampaignBrainstormerOutput,
} from '@/ai/flows/campaign-brainstormer';
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
import { ThumbsUp, ThumbsDown, Copy, Download, Sparkles, AlertCircle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard, exportText } from '@/lib/utils';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  productDetails: z
    .string()
    .min(10, { message: 'Please provide more details about the product.' }),
  targetAudience: z
    .string()
    .min(10, { message: 'Please describe the target audience in more detail.' }),
});

export default function CampaignBrainstormerPage() {
  const [result, setResult] = useState<CampaignBrainstormerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<number, 'up' | 'down' | null>>({});
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productDetails: '',
      targetAudience: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setFeedback({});

    try {
      const response = await campaignBrainstormer(values);
      setResult(response);
    } catch (e) {
      setError('An error occurred. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCopy = (text: string, index: number) => {
    copyToClipboard(text).then(() => {
        toast({
          title: "Copied to clipboard!",
          description: `Campaign idea #${index + 1} is ready to paste.`,
        });
    }).catch(err => {
        toast({
            variant: "destructive",
            title: "Copy failed",
            description: "Could not copy text to clipboard.",
        });
    });
  };

  const handleFeedback = (index: number, type: 'up' | 'down') => {
    setFeedback((prev) => ({
      ...prev,
      [index]: prev[index] === type ? null : type,
    }));
  };
  
  const handleExport = () => {
    if (!result) return;
    const content = `Campaign Ideas:\n\n${result.campaignIdeas.map((idea, i) => `${i + 1}. ${idea}`).join('\n\n')}`;
    exportText(content, 'campaign-ideas.txt');
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Campaign Brainstormer"
        description="Let AI be your creative partner. Generate innovative campaign ideas in seconds."
      >
        {result && (
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2" />
            Export
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
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="productDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., A new line of sustainable, all-natural dog food..."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Millennial pet owners, environmentally conscious, urban dwellers..."
                              rows={5}
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
                <CardTitle>Generated Ideas</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="mt-2 h-4 w-1/2" />
                        </CardContent>
                        <CardFooter>
                           <Skeleton className="h-8 w-24" />
                        </CardFooter>
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
                           <Lightbulb className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <p className="mt-4 text-lg font-medium">Your creative ideas will appear here.</p>
                        <p className="text-muted-foreground">Fill out the brief and let the magic happen.</p>
                    </div>
                )}
                {result && (
                  <div className="space-y-4 animate-in fade-in-50 duration-500">
                    {result.campaignIdeas.map((idea, index) => (
                      <Card key={index} className="shadow-md">
                        <CardContent className="p-6">
                          <p className="text-foreground">{idea}</p>
                        </CardContent>
                        <CardFooter className="justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleFeedback(index, 'up')}
                            className={cn(feedback[index] === 'up' && 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400')}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleFeedback(index, 'down')}
                             className={cn(feedback[index] === 'down' && 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400')}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(idea, index)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </CardFooter>
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
