import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/campaign-brainstormer');
  return null;
}
