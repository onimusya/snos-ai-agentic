"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Navbar } from "@/components/navbar";
import {
  User,
  Mail,
  Shield,
  Calendar,
  BarChart3,
  Globe,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const updateUser = useMutation(api.users.updateUser);

  const [name, setName] = useState("");
  const [language, setLanguage] = useState<"en" | "ms" | "zh">("en");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with user data
  useEffect(() => {
    if (user && !authLoading) {
      setName(user.name || "");
      setLanguage(user.language || "en");
    }
  }, [user, authLoading]);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push("/auth/login?redirect=/profile");
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      await updateUser({
        name: name.trim() || undefined,
        language: language,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getSubscriptionBadgeVariant = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "default";
      case "pro":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getSubscriptionBadgeText = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "Enterprise";
      case "pro":
        return "Pro";
      default:
        return "Free";
    }
  };

  const getLanguageName = (lang: string) => {
    switch (lang) {
      case "en":
        return "English";
      case "ms":
        return "Bahasa Malaysia";
      case "zh":
        return "简体中文";
      default:
        return lang;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatarUrl} alt={user.name || user.email} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-400 text-white text-xl font-semibold">
                    {getUserInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">
                    {user.name || "User"}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive text-destructive text-sm">
                    {error}
                  </div>
                )}
                {saveSuccess && (
                  <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Profile updated successfully!
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if you need to update it.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Language Preference
                  </Label>
                  <Select
                    value={language}
                    onValueChange={(value) =>
                      setLanguage(value as "en" | "ms" | "zh")
                    }
                    disabled={isSaving}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ms">Bahasa Malaysia</SelectItem>
                      <SelectItem value="zh">简体中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="submit"
                    className="rounded-full"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Subscription Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Subscription Details
              </CardTitle>
              <CardDescription>
                Your current subscription plan and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Plan</p>
                  <Badge
                    variant={getSubscriptionBadgeVariant(user.subscriptionPlan)}
                    className="rounded-full"
                  >
                    {getSubscriptionBadgeText(user.subscriptionPlan)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge
                    variant={
                      user.subscriptionStatus === "active"
                        ? "default"
                        : "outline"
                    }
                    className="rounded-full"
                  >
                    {user.subscriptionStatus.charAt(0).toUpperCase() +
                      user.subscriptionStatus.slice(1)}
                  </Badge>
                </div>
              </div>

              {user.subscriptionStatus === "active" && (
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="rounded-full w-full"
                    onClick={() => router.push("/pricing")}
                  >
                    Upgrade Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Usage Statistics
              </CardTitle>
              <CardDescription>
                Your account activity and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Total Investigations</p>
                      <p className="text-sm text-muted-foreground">
                        Conversations analyzed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {user.usageCount || 0}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Plan Limits</span>
                    <span className="font-medium">
                      {user.subscriptionPlan === "free"
                        ? "10 investigations/month"
                        : user.subscriptionPlan === "pro"
                        ? "Unlimited"
                        : "Unlimited + Priority"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Additional account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant="outline" className="rounded-full">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Language Preference
                </span>
                <span className="text-sm font-medium">
                  {getLanguageName(user.language || "en")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

