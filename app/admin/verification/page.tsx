"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PendingProvider {
  id: string;
  business_name: string;
  description: string;
  created_at: string;
  user: {
    email: string;
    full_name: string;
  };
}

export default function AdminVerificationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [providers, setProviders] = useState<PendingProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/unauthorized");
    }
  }, [user, router]);

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const fetchPendingProviders = async () => {
    try {
      const res = await fetch("/api/admin/verification");
      const data = await res.json();
      setProviders(data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (providerId: string, action: "approve" | "reject") => {
    setProcessing(providerId);
    try {
      const res = await fetch("/api/admin/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, providerId }),
      });

      if (res.ok) {
        setProviders(providers.filter(p => p.id !== providerId));
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setProcessing(null);
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Provider Verification</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : providers.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No pending verifications</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {providers.map((provider) => (
            <Card key={provider.id}>
              <CardHeader>
                <CardTitle>{provider.business_name}</CardTitle>
                <CardDescription>
                  Owner: {provider.user.full_name} ({provider.user.email})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{provider.description}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Submitted: {new Date(provider.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAction(provider.id, "approve")}
                    disabled={processing === provider.id}
                    variant="default"
                  >
                    {processing === provider.id ? "Processing..." : "Approve"}
                  </Button>
                  <Button
                    onClick={() => handleAction(provider.id, "reject")}
                    disabled={processing === provider.id}
                    variant="destructive"
                  >
                    {processing === provider.id ? "Processing..." : "Reject"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
