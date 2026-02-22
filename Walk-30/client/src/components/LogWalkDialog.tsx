import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLogActivity } from "@/hooks/use-activities";
import { useState } from "react";
import { Plus } from "lucide-react";
import { format } from "date-fns";

const formSchema = z.object({
  minutes: z.coerce.number().min(1, "Every minute counts! Enter at least 1.").max(1440, "Are you sure you walked for 24 hours?"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  notes: z.string().optional(),
});

export function LogWalkDialog() {
  const [open, setOpen] = useState(false);
  const logActivity = useLogActivity();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minutes: 30,
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    logActivity.mutate(
      {
        minutes: values.minutes,
        date: new Date(values.date),
        notes: values.notes,
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <Plus className="w-5 h-5 mr-2" />
          Log Walk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Log Activity</DialogTitle>
          <DialogDescription>
            Record your walk to keep your streak alive!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (min)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="rounded-xl" autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Morning walk with the dog..." 
                      className="rounded-xl resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full rounded-xl py-6 text-lg font-semibold" 
              disabled={logActivity.isPending}
            >
              {logActivity.isPending ? "Saving..." : "Save Activity"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
