import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Map, MessageSquare, Menu, X, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onClearChat: () => void;
}

const Header = ({ onClearChat }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                <span className="text-xl font-bold text-primary-foreground">D</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-secondary border-2 border-background" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-none">
                <span className="text-primary">DSA</span>{" "}
                <span className="text-secondary">Dost</span>
              </h1>
              <p className="text-[10px] text-muted-foreground">AI Mentor</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </Link>
            <Link
              to="/roadmap"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive("/roadmap")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Roadmap</span>
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* AI Status badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span>AI Active</span>
            </div>

            {/* Settings dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass-card border-border/50">
                <DropdownMenuItem
                  onClick={onClearChat}
                  className="flex items-center gap-3 cursor-pointer py-3 text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive("/")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat with DSA Dost</span>
              </Link>
              <Link
                to="/roadmap"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive("/roadmap")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Map className="w-5 h-5" />
                <span>Build Your Roadmap</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
