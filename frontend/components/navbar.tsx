"use client";

import { Shield, User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const router = useRouter();

  // Note: Callback handling is now done in useAuth hook
  // This keeps the logic centralized and ensures proper polling

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh(); // Force refresh to update auth state
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Get user initials for avatar fallback
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

  return (
    <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xl">S.N.O.S.</span>
        </Link>

        {/* Auth Buttons & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          
          {isLoading ? (
            // Loading state
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : isAuthenticated && user ? (
            // Authenticated: Show user avatar with dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.avatarUrl}
                      alt={user.name || user.email}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-400 text-white text-xs font-semibold">
                      {getUserInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/chat" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Chat</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Not authenticated: Show sign in button
            <>
              <Link href="/auth/login">
                <Button variant="outline" className="rounded-full px-4 sm:px-6">
                  Sign In
                </Button>
              </Link>
              <Link href="/chat">
                <Button className="rounded-full px-4 sm:px-6">Try Free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

