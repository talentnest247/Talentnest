import { AuthGuard } from "@/components/auth/auth-guard"
import { ProviderDashboard } from "@/components/providers"

export default function ProviderDashboardPage() {
  return (
    <AuthGuard allowedRoles={["artisan"]}>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Provider Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your profile, services, and view verification status.
          </p>
        </div>
        
        <ProviderDashboard />
      </div>
    </AuthGuard>
  )
}
