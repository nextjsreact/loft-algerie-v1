import { requireAuth } from "@/lib/auth"
import { ErrorBoundary } from "@/components/error-boundary"
import { ModernDashboard } from "@/components/dashboard/modern-dashboard"

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <ModernDashboard userRole={session.user.role} />
      </div>
    </ErrorBoundary>
  )
}
