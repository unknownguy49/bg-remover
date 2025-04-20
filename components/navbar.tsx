"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/context/auth-context"
import { LoginDialog } from "@/components/login-dialog"
import { SignupDialog } from "@/components/signup-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, User, LogOut, ImageIcon } from "lucide-react"

export function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showSignupDialog, setShowSignupDialog] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <ImageIcon className="h-6 w-6" />
          <span>BG Remover</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link href="#features" className="text-sm font-medium hover:text-primary">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
        </nav>

        {/* Auth & Theme Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setShowLoginDialog(true)}>
                Log in
              </Button>
              <Button onClick={() => setShowSignupDialog(true)}>Sign up</Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {showMobileMenu ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>
              Home
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setShowMobileMenu(false)}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setShowMobileMenu(false)}
            >
              Pricing
            </Link>

            <div className="pt-2 flex items-center justify-between">
              <ModeToggle />

              {isAuthenticated ? (
                <Button onClick={logout} variant="outline" size="sm">
                  Log out
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowLoginDialog(true)
                      setShowMobileMenu(false)
                    }}
                  >
                    Log in
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setShowSignupDialog(true)
                      setShowMobileMenu(false)
                    }}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      <SignupDialog open={showSignupDialog} onOpenChange={setShowSignupDialog} />
    </header>
  )
}
