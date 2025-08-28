import { getSession } from '@/lib/auth';
import HomePageClient from './home-page-client'; // Corrected import path
import { redirect } from 'next/navigation';

export default async function HomePageServer() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Rediriger les executives vers leur dashboard spécialisé
  if (session.user.role === 'executive') {
    redirect('/executive');
  }

  // Pass the entire session object, or just the user and their role
  return <HomePageClient userRole={session.user.role} />;
}