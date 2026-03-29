import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Phone, Bell, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DistressSignal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Discreet button — always visible */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full bg-destructive/20 hover:bg-destructive/40 flex items-center justify-center transition-colors border border-destructive/30"
        aria-label="Distress signal — get help now"
        title="Need help?"
      >
        <ShieldAlert className="h-4 w-4 text-destructive" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-foreground">
                  You are not alone
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <a
                  href="tel:988"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 transition-colors"
                >
                  <Phone className="h-6 w-6 text-destructive shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Crisis Counselor</p>
                    <p className="text-sm text-muted-foreground">Call or text 988 now</p>
                  </div>
                </a>

                <button
                  onClick={() => {
                    // In future: send silent alert to trusted contact
                    alert("Silent alert feature coming soon. If you are in danger, please call 988.");
                    setOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-accent/10 border border-accent/30 hover:bg-accent/20 transition-colors w-full text-left"
                >
                  <Bell className="h-6 w-6 text-accent shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Silent Alert</p>
                    <p className="text-sm text-muted-foreground">Send alert to trusted contact</p>
                  </div>
                </button>

                <a
                  href="https://988lifeline.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/10 border border-secondary/30 hover:bg-secondary/20 transition-colors"
                >
                  <BookOpen className="h-6 w-6 text-secondary shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Emergency Resources</p>
                    <p className="text-sm text-muted-foreground">988 Suicide & Crisis Lifeline</p>
                  </div>
                </a>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                You are seen. You are heard. Help is here.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
