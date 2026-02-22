import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Footprints, 
  LayoutDashboard, 
  Trophy, 
  Users, 
  LogOut,
  Menu
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/team", label: "My Team", icon: Users },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Footprints className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-xl tracking-tight">WALK30</h1>
          <p className="text-xs text-muted-foreground font-medium">Daily Challenge</p>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <div 
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 translate-x-1" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-1"
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          {user.profileImageUrl ? (
            <img src={user.profileImageUrl} alt={user.firstName || "User"} className="w-8 h-8 rounded-full border border-border" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
              {(user.firstName?.[0] || "U").toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 border-r border-border bg-card/50 backdrop-blur-xl p-6 z-50">
        <NavContent />
      </aside>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <Footprints className="w-6 h-6 text-primary" />
          <span className="font-heading font-bold text-lg">WALK30</span>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
