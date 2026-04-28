import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Mic, Image as ImageIcon, Upload, Play, Pause, Square,
  ArrowLeft, Sparkles, Clock, Loader2, LogIn, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

type ShareMode = "face" | "voice_only" | "voice_with_image";
type View = "hub" | "record" | "browse";

// Angel-number durations in minutes (1, 3, 5, 7, 9, 11). 11 max.
const ANGEL_DURATIONS = [1, 3, 5, 7, 9, 11] as const;

interface Journey {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  share_mode: ShareMode;
  duration_seconds: number;
  video_path: string;
  background_image_path: string | null;
  is_practitioner: boolean;
  created_at: string;
}

const SHARE_MODES: { id: ShareMode; label: string; desc: string; icon: any }[] = [
  { id: "face", label: "Show face on camera", desc: "Full video of you sharing", icon: Video },
  { id: "voice_only", label: "Voice only", desc: "Audio-only with a soft glowing orb", icon: Mic },
  { id: "voice_with_image", label: "Voice with background image", desc: "Your voice over a chosen still image", icon: ImageIcon },
];

export default function HealingJourneys({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [view, setView] = useState<View>("hub");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!authChecked) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
      </div>
    );
  }

  // Header
  const Header = (
    <div className="flex items-center gap-3 px-4 pt-4 pb-3">
      <button
        onClick={onBack}
        className="h-9 w-9 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/10 hover:bg-white/[0.1]"
        aria-label="Back to Portal"
      >
        <ArrowLeft className="h-4 w-4 text-foreground" />
      </button>
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-teal-300" />
        <h2 className="font-display text-lg font-bold text-foreground">Healing Journeys</h2>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="flex-1 flex flex-col">
        {Header}
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm text-center space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Sign in to enter</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Healing Journeys are sacred. Videos are only visible to logged-in members of the Soul Echoes circle.
              </p>
            </div>
            <Button
              onClick={() => navigate("/auth")}
              className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0"
            >
              Sign in or create account <ArrowLeft className="h-4 w-4 ml-1.5 rotate-180" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {Header}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {view === "hub" && <HubView key="hub" onRecord={() => setView("record")} onBrowse={() => setView("browse")} />}
          {view === "record" && (
            <RecordView
              key="record"
              user={user}
              onDone={() => { setView("browse"); toast({ title: "Journey shared 🌿", description: "Your testimony is now in the circle." }); }}
              onCancel={() => setView("hub")}
            />
          )}
          {view === "browse" && <BrowseView key="browse" currentUserId={user.id} onBack={() => setView("hub")} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Hub ─────────────────────────────────────────────────────────────── */
function HubView({ onRecord, onBrowse }: { onRecord: () => void; onBrowse: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-4"
    >
      <div className="rounded-2xl bg-gradient-to-r from-teal-500/15 to-emerald-500/15 border border-teal-400/30 p-4 space-y-1.5">
        <p className="text-sm font-semibold text-foreground">Witness & be witnessed</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Share a phase of your healing journey — or witness another's. All videos stay inside the Soul Echoes circle, only visible to logged-in members.
        </p>
      </div>

      <button
        onClick={onRecord}
        className="w-full rounded-2xl border border-teal-400/40 bg-gradient-to-br from-teal-600/30 to-emerald-600/30 p-5 text-left hover:from-teal-600/40 hover:to-emerald-600/40 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/30 border border-teal-400/40 flex items-center justify-center">
            <Video className="h-5 w-5 text-teal-200" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Record Your Journey</p>
            <p className="text-xs text-muted-foreground mt-0.5">Camera, voice-only, or voice with a background image</p>
          </div>
        </div>
      </button>

      <button
        onClick={onBrowse}
        className="w-full rounded-2xl border border-white/15 bg-white/[0.04] p-5 text-left hover:bg-white/[0.07] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
            <Play className="h-5 w-5 text-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Browse Journeys</p>
            <p className="text-xs text-muted-foreground mt-0.5">Witness testimonies from the circle</p>
          </div>
        </div>
      </button>

      <p className="text-[11px] text-center text-muted-foreground/60 italic px-4">
        Choose any duration that feels right — 1, 3, 5, 7, 9, or 11 minutes. Break a longer testimony into phases.
      </p>
    </motion.div>
  );
}

/* ─── Record ──────────────────────────────────────────────────────────── */
function RecordView({
  user, onDone, onCancel,
}: { user: User; onDone: () => void; onCancel: () => void }) {
  const { toast } = useToast();
  const [shareMode, setShareMode] = useState<ShareMode>("face");
  const [maxMinutes, setMaxMinutes] = useState<number>(3);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bgImageFile, setBgImageFile] = useState<File | null>(null);
  const [bgImagePreview, setBgImagePreview] = useState<string | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const maxSeconds = maxMinutes * 60;

  // Cleanup
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startStream = async () => {
    try {
      const wantsVideo = shareMode === "face";
      const ms = await navigator.mediaDevices.getUserMedia({
        video: wantsVideo ? { facingMode: "user" } : false,
        audio: true,
      });
      setStream(ms);
      if (videoRef.current && wantsVideo) {
        videoRef.current.srcObject = ms;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      toast({ title: "Microphone / camera blocked", description: err.message, variant: "destructive" });
    }
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    setElapsed(0);
    setRecordedBlob(null);
    const mimeCandidates = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "audio/webm"];
    const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m));
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" });
      setRecordedBlob(blob);
    };
    recorder.start(1000);
    recorderRef.current = recorder;
    setRecording(true);
    setPaused(false);
    timerRef.current = window.setInterval(() => {
      setElapsed((s) => {
        const next = s + 1;
        if (next >= maxSeconds) { stopRecording(); }
        return next;
      });
    }, 1000);
  };

  const togglePause = () => {
    if (!recorderRef.current) return;
    if (paused) {
      recorderRef.current.resume();
      setPaused(false);
    } else {
      recorderRef.current.pause();
      setPaused(true);
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
    setPaused(false);
    if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null; }
  };

  const handleBgImage = (file: File) => {
    setBgImageFile(file);
    setBgImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const blobOrFile: Blob | File | null = uploadFile ?? recordedBlob;
    if (!blobOrFile) {
      toast({ title: "No video yet", description: "Record or upload a video to share.", variant: "destructive" });
      return;
    }
    if (!title.trim()) {
      toast({ title: "Add a title", description: "Give your journey a name.", variant: "destructive" });
      return;
    }
    if (shareMode === "voice_with_image" && !bgImageFile) {
      toast({ title: "Add a background image", description: "Choose an image to play behind your voice.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = uploadFile
        ? uploadFile.name.split(".").pop() || "mp4"
        : (blobOrFile as Blob).type.includes("audio") ? "webm" : "webm";
      const ts = Date.now();
      const videoPath = `${user.id}/${ts}-journey.${ext}`;
      const { error: vErr } = await supabase.storage
        .from("healing-journeys")
        .upload(videoPath, blobOrFile, {
          contentType: (blobOrFile as Blob).type || "video/webm",
          upsert: false,
        });
      if (vErr) throw vErr;

      let bgPath: string | null = null;
      if (bgImageFile) {
        const bgExt = bgImageFile.name.split(".").pop() || "jpg";
        bgPath = `${user.id}/${ts}-bg.${bgExt}`;
        const { error: iErr } = await supabase.storage
          .from("healing-journeys")
          .upload(bgPath, bgImageFile, { contentType: bgImageFile.type, upsert: false });
        if (iErr) throw iErr;
      }

      const { error: dbErr } = await supabase.from("healing_journeys").insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        share_mode: shareMode,
        duration_seconds: elapsed || Math.round(maxSeconds),
        video_path: videoPath,
        background_image_path: bgPath,
        is_practitioner: false,
      });
      if (dbErr) throw dbErr;

      stream?.getTracks().forEach((t) => t.stop());
      onDone();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-4 pb-8"
    >
      {/* Share mode */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">How would you like to share?</p>
        <div className="space-y-2">
          {SHARE_MODES.map((m) => {
            const active = shareMode === m.id;
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => { setShareMode(m.id); stream?.getTracks().forEach((t) => t.stop()); setStream(null); setRecordedBlob(null); }}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                  active
                    ? "bg-teal-500/15 border-teal-400/50"
                    : "bg-white/[0.03] border-white/10 hover:border-white/20"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? "bg-teal-500/30" : "bg-white/[0.06]"}`}>
                  <Icon className={`h-4 w-4 ${active ? "text-teal-300" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Background image picker (voice_with_image) */}
      {shareMode === "voice_with_image" && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">Background image</p>
          <label className="block">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleBgImage(e.target.files[0])}
            />
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-4 text-center cursor-pointer hover:border-teal-400/40">
              {bgImagePreview ? (
                <img src={bgImagePreview} alt="Background" className="mx-auto max-h-40 rounded-xl" />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-muted-foreground text-sm">
                  <ImageIcon className="h-5 w-5" />
                  Tap to choose an image
                </div>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Duration picker */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground/80 uppercase tracking-wide flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> Maximum length
        </p>
        <div className="flex flex-wrap gap-2">
          {ANGEL_DURATIONS.map((min) => {
            const active = maxMinutes === min;
            return (
              <button
                key={min}
                onClick={() => setMaxMinutes(min)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                  active
                    ? "bg-teal-500/25 border-teal-400/60 text-teal-200"
                    : "bg-white/[0.04] border-white/10 text-muted-foreground hover:border-teal-400/30"
                }`}
              >
                {min} min
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground/60 italic">
          Angel-number durations. Break longer testimonies into phases.
        </p>
      </div>

      {/* Recorder */}
      <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
        {shareMode === "face" ? (
          <video ref={videoRef} className="w-full aspect-video bg-black" playsInline muted />
        ) : (
          <div className="w-full aspect-video flex items-center justify-center relative bg-black">
            {shareMode === "voice_with_image" && bgImagePreview && (
              <img src={bgImagePreview} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            )}
            <motion.div
              animate={{ scale: recording && !paused ? [1, 1.15, 1] : 1, opacity: recording && !paused ? [0.6, 1, 0.6] : 0.5 }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="relative w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 shadow-[0_0_40px_rgba(45,212,191,0.6)] flex items-center justify-center"
            >
              <Mic className="h-8 w-8 text-white" />
            </motion.div>
          </div>
        )}
        <div className="flex items-center justify-between px-3 py-2.5 bg-black/60 border-t border-white/10">
          <span className="text-xs font-mono text-teal-300">
            {fmt(elapsed)} / {fmt(maxSeconds)}
          </span>
          <div className="flex items-center gap-2">
            {!stream && !recordedBlob && (
              <Button size="sm" onClick={startStream} className="rounded-xl bg-teal-600 hover:bg-teal-500 border-0 text-xs">
                Enable {shareMode === "face" ? "camera & mic" : "mic"}
              </Button>
            )}
            {stream && !recording && !recordedBlob && (
              <Button size="sm" onClick={startRecording} className="rounded-xl bg-rose-600 hover:bg-rose-500 border-0 text-xs">
                <span className="w-2 h-2 rounded-full bg-white mr-1.5" /> Record
              </Button>
            )}
            {recording && (
              <>
                <Button size="sm" variant="outline" onClick={togglePause} className="rounded-xl border-white/20 text-xs">
                  {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                </Button>
                <Button size="sm" onClick={stopRecording} className="rounded-xl bg-white/10 hover:bg-white/20 border-0 text-xs">
                  <Square className="h-3 w-3 mr-1" /> Stop
                </Button>
              </>
            )}
            {recordedBlob && (
              <Button size="sm" variant="outline" onClick={() => { setRecordedBlob(null); setElapsed(0); }} className="rounded-xl border-white/20 text-xs">
                Re-record
              </Button>
            )}
          </div>
        </div>
        {recordedBlob && (
          <div className="p-3 bg-black/40">
            <video src={URL.createObjectURL(recordedBlob)} controls className="w-full rounded-xl" />
          </div>
        )}
      </div>

      {/* Or upload */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">Or upload a file</p>
        <label className="block">
          <input
            type="file"
            accept="video/*,audio/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { setUploadFile(f); setRecordedBlob(null); } }}
          />
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-4 text-center cursor-pointer hover:border-teal-400/40 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Upload className="h-4 w-4" />
            {uploadFile ? uploadFile.name : "Tap to choose a video or audio file"}
          </div>
        </label>
      </div>

      {/* Title + description */}
      <div className="space-y-2">
        <Input
          placeholder="Title your journey…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-xl bg-white/[0.04] border-white/10"
          maxLength={120}
        />
        <Textarea
          placeholder="What phase of healing is this? (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-xl bg-white/[0.04] border-white/10 min-h-[80px]"
          maxLength={500}
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1 rounded-xl border-white/20">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={uploading}
          className="flex-1 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0"
        >
          {uploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sharing…</> : "Share Journey"}
        </Button>
      </div>
    </motion.div>
  );
}

/* ─── Browse ──────────────────────────────────────────────────────────── */
function BrowseView({ currentUserId, onBack }: { currentUserId: string; onBack: () => void }) {
  const { toast } = useToast();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedUrls, setSignedUrls] = useState<Record<string, { video?: string; bg?: string }>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("healing_journeys")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Couldn't load journeys", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    setJourneys((data ?? []) as Journey[]);
    // Signed URLs (1h)
    const urls: Record<string, { video?: string; bg?: string }> = {};
    await Promise.all(
      (data ?? []).map(async (j: any) => {
        const v = await supabase.storage.from("healing-journeys").createSignedUrl(j.video_path, 3600);
        urls[j.id] = { video: v.data?.signedUrl };
        if (j.background_image_path) {
          const b = await supabase.storage.from("healing-journeys").createSignedUrl(j.background_image_path, 3600);
          urls[j.id].bg = b.data?.signedUrl;
        }
      })
    );
    setSignedUrls(urls);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const handleDelete = async (j: Journey) => {
    if (!confirm("Delete this journey? This can't be undone.")) return;
    await supabase.storage.from("healing-journeys").remove([j.video_path, ...(j.background_image_path ? [j.background_image_path] : [])]);
    const { error } = await supabase.from("healing_journeys").delete().eq("id", j.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    setJourneys((prev) => prev.filter((x) => x.id !== j.id));
  };

  const fmtDur = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-3"
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
        </div>
      ) : journeys.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <Sparkles className="h-10 w-10 text-teal-400/40 mx-auto" />
          <p className="text-sm text-muted-foreground">No journeys shared yet.</p>
          <p className="text-xs text-muted-foreground/60">Be the first to plant a seed.</p>
        </div>
      ) : (
        journeys.map((j) => {
          const urls = signedUrls[j.id] ?? {};
          const mode = SHARE_MODES.find((m) => m.id === j.share_mode);
          return (
            <div key={j.id} className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
              {j.share_mode === "face" ? (
                urls.video && <video src={urls.video} controls className="w-full aspect-video bg-black" playsInline />
              ) : (
                <div className="relative w-full aspect-video bg-black">
                  {urls.bg && <img src={urls.bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(45,212,191,0.5)]">
                      <Mic className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  {urls.video && <audio src={urls.video} controls className="absolute bottom-2 left-2 right-2 w-[calc(100%-1rem)]" />}
                </div>
              )}
              <div className="p-3 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{j.title}</p>
                    {j.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{j.description}</p>}
                  </div>
                  {j.user_id === currentUserId && (
                    <button onClick={() => handleDelete(j)} aria-label="Delete journey" className="h-7 w-7 rounded-full hover:bg-rose-500/20 flex items-center justify-center">
                      <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  {mode && <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10">{mode.label}</span>}
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{fmtDur(j.duration_seconds)}</span>
                  {j.is_practitioner && <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">Practitioner</span>}
                </div>
              </div>
            </div>
          );
        })
      )}
    </motion.div>
  );
}
