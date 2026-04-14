import { BookOpen, Sparkles, Trophy, Users, ArrowRight, Zap, Code2, Brain } from "lucide-react";

interface WelcomeHeroProps {
  onGetStarted: () => void;
}

const WelcomeHero = ({ onGetStarted }: WelcomeHeroProps) => {
  const features = [
    { icon: BookOpen, label: "Zero to Advanced", desc: "Complete DSA journey" },
    { icon: Brain, label: "AI Mentor", desc: "24/7 personal guide" },
    { icon: Code2, label: "Interview Ready", desc: "Crack top companies" },
    { icon: Zap, label: "Free Forever", desc: "No hidden costs" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">100% Free • No Login Required</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <span className="gradient-text">DSA</span>{" "}
          <span className="gradient-text-green">Dost</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Your AI-Powered DSA Mentor
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
          From complete beginner to interview-ready — learn Data Structures & Algorithms 
          with your personal AI friend. <span className="text-primary font-medium">Hinglish mein!</span> 🚀
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {features.map((feature, index) => (
            <div
              key={feature.label}
              className="group relative glass-card p-6 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 hover:border-primary/50"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <span className="block text-sm font-semibold text-foreground">
                  {feature.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {feature.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button 
          onClick={onGetStarted} 
          className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          <span>Shuru Karte Hain!</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>Powered by Gemini AI</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Works Offline Too</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>Hindi + English</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHero;
