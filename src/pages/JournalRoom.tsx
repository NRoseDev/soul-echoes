import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JOURNAL_SECTIONS } from "@/lib/journal";

export default function JournalRoom() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-violet-950 via-indigo-950 to-sky-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-4 mb-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/90 shadow-lg shadow-black/20">
            <span>📓</span>
            <span>Journal room — eight focused sections to hold your thoughts, healing, and growth.</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-display font-bold">Journal Room</h1>
            <p className="max-w-3xl text-muted-foreground leading-relaxed text-sm sm:text-base">
              Choose a section to open a full-screen journal page. Your writing saves to the cloud and resumes where you left off.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {JOURNAL_SECTIONS.map((section) => (
            <Card
              key={section.id}
              onClick={() => navigate(`/journal/${section.id}`)}
              className="group cursor-pointer overflow-hidden border border-white/10 bg-white/10 text-left transition hover:-translate-y-1 hover:bg-white/15"
            >
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="rounded-2xl bg-white/10 px-3 py-2 text-xl">{section.emoji}</div>
                  <Button variant="outline" size="sm" className="opacity-0 transition group-hover:opacity-100">
                    Open
                  </Button>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg text-white">{section.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
