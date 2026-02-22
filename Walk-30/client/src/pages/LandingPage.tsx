import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Footprints, 
  Trophy, 
  Users, 
  ArrowRight,
  Activity
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Footprints className="h-6 w-6 text-primary" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">WALK30</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/api/login">
                <Button className="rounded-full px-6 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                  Sign In
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="space-y-8 animate-in opacity-0 fill-mode-forwards" style={{ animationDelay: '100ms' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm">
                <Trophy className="w-4 h-4" />
                <span>Join the 30-Day Challenge</span>
              </div>
              
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Make Every <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Step Count</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Track your daily walks, compete with friends, and build healthy habits that last. The journey of a thousand miles begins with a single step.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/api/login">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                    Start Walking Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-8 pt-8 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Free to join
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  No credit card required
                </div>
              </div>
            </div>

            <div className="relative animate-in opacity-0 fill-mode-forwards" style={{ animationDelay: '300ms' }}>
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[2rem] blur-3xl opacity-50" />
              {/* Unsplash image: Person walking/running in nature, uplifting */}
              <img 
                src="https://images.unsplash.com/photo-1552674605-469523254d5d?q=80&w=2000&auto=format&fit=crop" 
                alt="Person walking in nature" 
                className="relative rounded-[2rem] shadow-2xl border border-white/20 w-full object-cover aspect-[4/3] transform hover:scale-[1.02] transition-transform duration-500"
              />
              
              {/* Floating Stat Card */}
              <div className="absolute -bottom-8 -left-8 bg-card p-4 rounded-2xl shadow-xl border border-border/50 hidden sm:block animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Daily Average</p>
                    <p className="text-2xl font-heading font-bold">45 mins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-secondary/30 py-24 border-t border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Everything you need to keep moving</h2>
              <p className="text-muted-foreground text-lg">Simple tools to help you stay consistent and motivated.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Activity,
                  title: "Track Progress",
                  desc: "Log your daily minutes and visualize your consistency with beautiful charts.",
                  color: "text-blue-500 bg-blue-500/10"
                },
                {
                  icon: Users,
                  title: "Team Challenges",
                  desc: "Create or join a team. Push each other to reach new heights on the leaderboard.",
                  color: "text-purple-500 bg-purple-500/10"
                },
                {
                  icon: Trophy,
                  title: "Earn Achievements",
                  desc: "Maintain streaks and hit milestones. Celebrate every victory along the way.",
                  color: "text-amber-500 bg-amber-500/10"
                }
              ].map((feature, i) => (
                <div key={i} className="bg-card p-8 rounded-3xl border border-border/50 hover:border-border hover:shadow-xl transition-all duration-300 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Footprints className="h-5 w-5 text-muted-foreground" />
            <span className="font-heading font-bold text-muted-foreground">WALK30</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Walk30 Challenge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
