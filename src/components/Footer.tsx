import { Heart, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 bg-card/30 backdrop-blur-sm py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Developed with</span>
          <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" />
          <span>by</span>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline inline-flex items-center gap-1 transition-colors"
          >
            Aman, Wazir, Yusuf
            <Instagram className="w-3 h-3" />
          </a>
        </div>
        <span className="hidden sm:inline text-border">•</span>
        <span className="flex items-center gap-1">
          INTEGRAL{" "}
          <span className="font-semibold gradient-text-green">
            UNIVERSITY
          </span>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
