import { Link } from "react-router-dom";
import { IconMathTg } from '@tabler/icons-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <IconMathTg className="h-8 w-8 text-primary" />
            <span className="font-semibold text-lg">Tangent</span>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/notes" className="text-sm font-medium hover:text-primary transition-colors">
            Notes
          </Link>
          <Link to="/networks" className="text-sm font-medium hover:text-primary transition-colors">
            Networks
          </Link>
          <Link to="/charts" className="text-sm font-medium hover:text-primary transition-colors">
            Charts
          </Link>
        </nav>

        {/* Auth and theme toggle */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8",
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
