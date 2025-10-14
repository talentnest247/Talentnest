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
  bio: string | null;
  specialization: string[];
  experience: number;
  location: string;
  verification_status: string;
  verified: boolean;
  verification_evidence: string[];
  certificates: string[];
  whatsapp_number: string | null;
  availability_available_for_learning: boolean;
  availability_available_for_work: boolean;
  pricing_base_rate: number | null;
  pricing_learning_rate: number | null;
  pricing_currency: string;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    student_id: string | null;
    department: string | null;
    level: number | null;
    avatar_url: string | null;
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
        <div className="space-y-6">
          {providers.map((provider) => (
            <Card key={provider.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{provider.business_name}</CardTitle>
                    <CardDescription className="mt-2">
                      Owner: {provider.user.full_name} ({provider.user.email})
                    </CardDescription>
                    {provider.user.student_id && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Student ID: {provider.user.student_id} | {provider.user.department} | Level {provider.user.level}
                      </p>
                    )}
                  </div>
                  {provider.verified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                      ✓ Verified Badge
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                  {provider.bio && (
                    <p className="text-sm text-muted-foreground mt-2">{provider.bio}</p>
                  )}
                </div>

                {/* Specialization & Experience */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Specialization</h3>
                    <div className="flex flex-wrap gap-2">
                      {provider.specialization.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Experience</h3>
                    <p className="text-sm">{provider.experience} years</p>
                  </div>
                </div>

                {/* Location & Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-sm text-muted-foreground">{provider.location || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Contact</h3>
                    <p className="text-sm">{provider.whatsapp_number || provider.user.phone || "No contact info"}</p>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-semibold mb-2">Availability</h3>
                  <div className="flex gap-4 text-sm">
                    <span className={provider.availability_available_for_work ? "text-green-600" : "text-muted-foreground"}>
                      {provider.availability_available_for_work ? "✓" : "✗"} Available for Work
                    </span>
                    <span className={provider.availability_available_for_learning ? "text-blue-600" : "text-muted-foreground"}>
                      {provider.availability_available_for_learning ? "✓" : "✗"} Available for Learning
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  <div className="flex gap-4 text-sm">
                    <span>Base Rate: {provider.pricing_base_rate ? `${provider.pricing_currency} ${provider.pricing_base_rate}` : "Not set"}</span>
                    {provider.pricing_learning_rate && (
                      <span>Learning Rate: {provider.pricing_currency} {provider.pricing_learning_rate}</span>
                    )}
                  </div>
                </div>

                {/* Evidence & Certificates */}
                {(provider.verification_evidence.length > 0 || provider.certificates.length > 0) && (
                  <div>
                    <h3 className="font-semibold mb-2">Portfolio & Certificates</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[...provider.verification_evidence, ...provider.certificates].map((url, idx) => (
                        <a 
                          key={idx} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm truncate"
                        >
                          📎 Document {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                  <span>Rating: {provider.rating.toFixed(1)} ⭐</span>
                  <span>Reviews: {provider.total_reviews}</span>
                  <span>Submitted: {new Date(provider.created_at).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => handleAction(provider.id, "approve")}
                    disabled={processing === provider.id}
                    variant="default"
                    className="flex-1"
                  >
                    {processing === provider.id ? "Processing..." : "✓ Approve & List in Marketplace"}
                  </Button>
                  <Button
                    onClick={() => handleAction(provider.id, "reject")}
                    disabled={processing === provider.id}
                    variant="destructive"
                    className="flex-1"
                  >
                    {processing === provider.id ? "Processing..." : "✗ Reject Application"}
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
