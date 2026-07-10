import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WISDOM_CONTENT } from "@/data/wisdomContent";

export default function WisdomDetail() {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();

  const data = section ? WISDOM_CONTENT[section] : null;

  if (!data) {
    return (
      <div
        className="flex-1 overflow-y-auto p-6 pb-24"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, hsl(25,80%,5%) 0%, hsl(25,90%,14%) 45%, hsl(25,60%,26%) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center py-16 text-foreground">
          <BookOpen className="mx-auto mb-4 text-primary" size={40} />
          <h1 className="font-display text-2xl font-bold mb-2">Teaching not found</h1>
          <p className="text-muted-foreground mb-6">
            This wisdom teaching is being prepared. Please return to the library.
          </p>
          <Button onClick={() => navigate("/wisdom")} variant="secondary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wisdom
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-4 pb-24"
      style={{
        background:
          "radial-gradient(ellipse at 20% 20%, hsl(25,80%,5%) 0%, hsl(25,90%,14%) 45%, hsl(25,60%,26%) 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <Button
          onClick={() => navigate("/wisdom")}
          variant="ghost"
          size="sm"
          className="mb-4 text-foreground/80 hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wisdom
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center"
        >
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/15 text-primary mb-3">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {data.title}
          </h1>
          <p className="text-muted-foreground mt-2 italic">{data.subtitle}</p>
        </motion.div>

        <Card className="bg-card/80 backdrop-blur-sm p-6 sm:p-8">
          <div className="space-y-5 leading-relaxed text-foreground/90">
            {data.body.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className="text-base"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Button onClick={() => navigate("/wisdom")} variant="secondary">
            Explore More Teachings
          </Button>
        </div>
      </div>
    </div>
  );
}
