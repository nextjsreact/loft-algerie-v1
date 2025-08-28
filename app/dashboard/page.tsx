import { requireAuth } from "@/lib/auth"
import { ErrorBoundary } from "@/components/error-boundary"
import { ModernDashboard } from "@/components/dashboard/modern-dashboard"

export default async function DashboardPage() {
  // Temporarily bypass requireAuth for debugging purposes
  // const session = await requireAuth();
  // console.log('DashboardPage: requireAuth() returned, session:', session ? 'Session found' : 'No session');

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <ModernDashboard />
      </div>
    </ErrorBoundary>
  )
}
