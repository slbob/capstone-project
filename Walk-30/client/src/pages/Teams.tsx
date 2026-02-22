import { useMyTeam, useCreateTeam, useJoinTeam } from "@/hooks/use-teams";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Users, UserPlus, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const createTeamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters").max(30),
});

const joinTeamSchema = z.object({
  code: z.string().min(1, "Code is required"),
});

export default function Teams() {
  const { data: team, isLoading } = useMyTeam();
  const createTeam = useCreateTeam();
  const joinTeam = useJoinTeam();
  const [copied, setCopied] = useState(false);

  const createForm = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: { name: "" },
  });

  const joinForm = useForm<z.infer<typeof joinTeamSchema>>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: { code: "" },
  });

  const onCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 lg:pl-72 px-8">
        <Skeleton className="h-12 w-48 mb-8" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  // HAS TEAM VIEW
  if (team) {
    return (
      <div className="min-h-screen bg-background pb-20 lg:pb-10 pt-20 lg:pt-8 lg:pl-72 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                {team.name}
              </h1>
              <p className="text-muted-foreground mt-2">Manage your team and track progress.</p>
            </div>

            <div className="bg-card border border-primary/20 p-4 rounded-xl shadow-sm flex items-center gap-4">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Team Code</p>
                <code className="text-2xl font-mono font-bold">{team.code}</code>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => onCopy(team.code)}
                className="rounded-lg hover:bg-primary/10 hover:text-primary"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border bg-secondary/30">
                <h3 className="font-heading font-bold text-lg">Team Members ({team.memberCount})</h3>
              </div>
              
              <div className="p-6">
                <p className="text-muted-foreground text-center py-8">
                  Team members list will appear here in the next update.
                  <br/>For now, check the Leaderboard to see your team's stats!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NO TEAM VIEW
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-10 pt-20 lg:pt-8 lg:pl-72 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-4">Join the Community</h1>
          <p className="text-lg text-muted-foreground">
            Walking is better together. Join an existing team or create a new one to compete on the leaderboard!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Team Card */}
          <Card className="rounded-2xl border-border shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <CardTitle className="font-heading text-xl">Create a Team</CardTitle>
              <CardDescription>
                Start your own squad and invite friends to join via a unique code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit((data) => createTeam.mutate(data))} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input placeholder="The Fast Walkers" className="rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full rounded-xl py-6 font-semibold" 
                    disabled={createTeam.isPending}
                  >
                    {createTeam.isPending ? "Creating..." : "Create Team"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Join Team Card */}
          <Card className="rounded-2xl border-border shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6" />
              </div>
              <CardTitle className="font-heading text-xl">Join a Team</CardTitle>
              <CardDescription>
                Have a code? Enter it below to join an existing team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...joinForm}>
                <form onSubmit={joinForm.handleSubmit((data) => joinTeam.mutate(data))} className="space-y-4">
                  <FormField
                    control={joinForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. WALK-1234" className="rounded-xl font-mono uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    variant="secondary"
                    className="w-full rounded-xl py-6 font-semibold" 
                    disabled={joinTeam.isPending}
                  >
                    {joinTeam.isPending ? "Joining..." : "Join Team"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
