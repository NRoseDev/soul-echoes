import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Heart, Sparkles, Users, Star, Shield, Leaf, HandHeart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const INDIVIDUAL_TIERS = [
  {
    name: "Free Forever",
    price: 0,
    label: "$0",
    description: "Brain Dump always unlimited, AI navigator always available, all other rooms 1 use every 11 days after 33 day trial.",
    features: [
      "33-day full trial",
      "Brain Dump always unlimited",
      "AI navigator always available",
      "All other rooms 1 use every 11 days after trial",
      "Access every healing room",
    ],
    icon: Leaf,
    accent: "from-green-500/20 to-emerald-600/20",
    border: "border-green-500/30",
  },
  {
    name: "Basic",
    price: 1,
    label: "$1/mo or $11/yr",
    description: "Basic healing support and more sessions.",
    features: [
      "Everything in Free Forever",
      "AI navigator always available",
      "More room sessions",
      "Brain Dump unlimited",
      "Honor system support",
    ],
    icon: Sparkles,
    accent: "from-teal-500/20 to-cyan-600/20",
    border: "border-teal-500/30",
    priceId: "individual_basic",
  },
  {
    name: "More Sessions",
    price: 3,
    label: "$3/mo or $33/yr",
    description: "More session access across rooms.",
    features: [
      "Everything in Basic",
      "AI navigator always available",
      "More room sessions",
      "Priority AI responses",
      "Journal history saved",
    ],
    icon: Heart,
    accent: "from-pink-500/20 to-rose-600/20",
    border: "border-pink-500/30",
    popular: true,
    priceId: "individual_more_sessions",
  },
  {
    name: "Even More",
    price: 5,
    label: "$5/mo or $55/yr",
    description: "Even more room time and tools.",
    features: [
      "Everything in More Sessions",
      "AI navigator always available",
      "Expanded access to healing rooms",
      "Advanced spiritual tools",
      "Shadow work deep dives",
    ],
    icon: Star,
    accent: "from-amber-500/20 to-yellow-600/20",
    border: "border-amber-500/30",
    priceId: "individual_even_more",
  },
  {
    name: "All Inclusive",
    price: 7,
    label: "$7/mo or $77/yr",
    description: "All inclusive healing access.",
    features: [
      "Everything in Even More",
      "AI navigator always available",
      "Unlimited sessions everywhere",
      "1-on-1 practitioner booking",
      "Crisis counselor priority",
    ],
    icon: Shield,
    accent: "from-purple-500/20 to-violet-600/20",
    border: "border-purple-500/30",
    priceId: "individual_all_inclusive",
  },
  {
    name: "Ultimate",
    price: 9,
    label: "$9/mo or $99/yr",
    description: "Ultimate access with beta feature access.",
    features: [
      "Everything in All Inclusive",
      "AI navigator always available",
      "Beta feature access",
      "Exclusive healing circles",
      "Direct feedback channel",
    ],
    icon: Sparkles,
    accent: "from-indigo-500/20 to-blue-600/20",
    border: "border-indigo-500/30",
    priceId: "individual_ultimate",
  },
];

const PROFESSIONAL_TIERS = [
  {
    name: "Under $33k",
    price: 2,
    label: "$2/mo",
    income: "Under $33k income",
    clients: "Up to 7 clients",
    features: [
      "Full practitioner dashboard",
      "Up to 7 active clients",
      "Session notes & tracking",
      "$55 max per client session",
    ],
    icon: Leaf,
    accent: "from-green-500/20 to-emerald-600/20",
    border: "border-green-500/30",
    priceId: "pro_under_33k",
  },
  {
    name: "Under $55k",
    price: 4,
    label: "$4/mo",
    income: "Under $55k income",
    clients: "Up to 22 clients",
    features: [
      "Everything in Under $33k",
      "Up to 22 active clients",
      "Group session tools",
      "Client progress insights",
    ],
    icon: Heart,
    accent: "from-teal-500/20 to-cyan-600/20",
    border: "border-teal-500/30",
    priceId: "pro_under_55k",
  },
  {
    name: "Under $77k",
    price: 6,
    label: "$6/mo",
    income: "Under $77k income",
    clients: "Up to 44 clients",
    features: [
      "Everything in Under $55k",
      "Up to 44 active clients",
      "Advanced analytics",
      "Custom healing protocols",
    ],
    icon: Sparkles,
    accent: "from-pink-500/20 to-rose-600/20",
    border: "border-pink-500/30",
    popular: true,
    priceId: "pro_under_77k",
  },
  {
    name: "Under $99k",
    price: 8,
    label: "$8/mo",
    income: "Under $99k income",
    clients: "Up to 88 clients",
    features: [
      "Everything in Under $77k",
      "Up to 88 active clients",
      "Priority support",
      "Workshop hosting tools",
    ],
    icon: Star,
    accent: "from-amber-500/20 to-yellow-600/20",
    border: "border-amber-500/30",
    priceId: "pro_under_99k",
  },
  {
    name: "Over $99k",
    price: 10,
    label: "$10/mo",
    income: "Over $99k income",
    clients: "Unlimited clients",
    features: [
      "Everything in Under $99k",
      "Unlimited active clients",
      "Equity share potential",
      "Shape the platform's future",
    ],
    icon: Shield,
    accent: "from-purple-500/20 to-violet-600/20",
    border: "border-purple-500/30",
    priceId: "pro_over_99k",
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [energyExchange, setEnergyExchange] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tierName: string, priceId?: string) => {
    if (!priceId) {
      toast.success("Welcome to the Free tier! You're all set. 💚");
      return;
    }

    setLoadingTier(tierName);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const resp = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/stripe-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            priceId,
            energyExchange,
            donationAmount,
          }),
        }
      );

      const result = await resp.json();
      if (result.url) {
        window.location.href = result.url;
      } else {
        toast.error(result.error || "Could not start checkout. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-amber-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
            Pricing for Individual Users and Professionals + Healers
          </h1>
        </div>

        {/* Honor System Banner */}
        <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <CardContent className="p-5 flex gap-4 items-start">
            <HandHeart className="text-amber-400 shrink-0 mt-1" size={28} />
            <div className="space-y-2">
              <p className="text-foreground font-semibold text-lg">Built on Trust &amp; Honor 🙏</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We believe in the goodness of people. Choose the tier that honestly reflects your situation.
                There are no gates, no verification — just your word. If your circumstances change, you can
                always adjust your plan. We trust you. 💛
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Energy Exchange Agreement */}
        <Card className="border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="text-purple-400" size={22} />
                <span className="font-semibold text-foreground">Energy Exchange Agreement</span>
              </div>
              <Switch checked={energyExchange} onCheckedChange={setEnergyExchange} />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Instead of — or in addition to — monetary payment, I agree to give back through acts of
              kindness, volunteering, or sharing healing energy with others. This is a sacred agreement
              between you and the universe. ✨
            </p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="individual" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted/50">
            <TabsTrigger value="individual" className="text-sm">Individual Users</TabsTrigger>
            <TabsTrigger value="professional" className="text-sm">Professionals and Healers</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-4">
            <p className="text-center text-muted-foreground text-sm">
              Two tracks: Individual Users and Professionals and Healers. Brain Dump is always free and unlimited.
            </p>
            <p className="text-center text-xs text-muted-foreground">
              Yearly options for individual tiers are $11, $33, $55, $77, and $99.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INDIVIDUAL_TIERS.map((tier) => (
                <Card
                  key={tier.name}
                  className={`relative bg-gradient-to-br ${tier.accent} ${tier.border} transition-all hover:scale-[1.02]`}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-2 right-4 bg-pink-500 text-white text-xs">
                      Most Loved
                    </Badge>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <tier.icon size={20} className="text-foreground/80" />
                      <CardTitle className="text-lg">{tier.name}</CardTitle>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{tier.label}</p>
                    <p className="text-xs text-muted-foreground">{tier.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-1.5">
                      {tier.features.map((f) => (
                        <li key={f} className="text-sm text-foreground/80 flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                      onClick={() => handleSubscribe(tier.name, tier.priceId)}
                      disabled={loadingTier === tier.name}
                    >
                      {loadingTier === tier.name ? "Loading..." : tier.price === 0 ? "Start Free" : "Choose Plan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="professional" className="space-y-4">
            <div className="text-center space-y-1">
              <p className="text-muted-foreground text-sm">
                Income-based pricing for healers, therapists, and practitioners. 🌿
              </p>
              <p className="text-xs text-muted-foreground">
                Practitioner tiers are income based: $2 under $33k up to 7 clients, $4 under $55k up to 22 clients, $6 under $77k up to 44 clients, $8 under $99k up to 88 clients, $10 over $99k unlimited clients.
              </p>
              <p className="text-xs text-muted-foreground">
                Session rate cap $55 per hour.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PROFESSIONAL_TIERS.map((tier) => (
                <Card
                  key={tier.name}
                  className={`relative bg-gradient-to-br ${tier.accent} ${tier.border} transition-all hover:scale-[1.02]`}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-2 right-4 bg-pink-500 text-white text-xs">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <tier.icon size={20} className="text-foreground/80" />
                      <CardTitle className="text-lg">{tier.name}</CardTitle>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{tier.label}</p>
                    <div className="space-y-0.5">
                      <p className="text-xs text-amber-400 font-medium">{tier.income}</p>
                      <p className="text-xs text-muted-foreground">{tier.clients}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-1.5">
                      {tier.features.map((f) => (
                        <li key={f} className="text-sm text-foreground/80 flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                      onClick={() => handleSubscribe(tier.name, tier.priceId)}
                      disabled={loadingTier === tier.name}
                    >
                      {loadingTier === tier.name ? "Loading..." : "Choose Plan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Pay It Forward */}
        <Card className="border-green-500/30 bg-gradient-to-r from-green-500/10 to-teal-500/10">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Heart className="text-green-400" size={22} />
              <span className="font-semibold text-foreground">Pay It Forward 💚</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Add a donation at checkout to fund someone else's healing journey. Every dollar
              goes directly to keeping Soul Echoes accessible for those who can't afford it.
            </p>
            <div className="flex gap-2 flex-wrap">
              {[0, 1, 3, 5, 11].map((amt) => (
                <Button
                  key={amt}
                  size="sm"
                  variant={donationAmount === amt ? "default" : "outline"}
                  onClick={() => setDonationAmount(amt)}
                  className="text-xs"
                >
                  {amt === 0 ? "None" : `+$${amt}`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Where Your Payment Goes */}
        <Card className="border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Users className="text-indigo-400" size={24} />
              <span className="font-display font-bold text-xl text-foreground">
                Where Your Payment Goes 🌍
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              100% of every payment funds <strong className="text-foreground">Rise Up Healing</strong>, a nonprofit
              dedicated to making spiritual and emotional healing accessible to all — regardless of income,
              ability, or background.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: "🏗️", title: "Platform Development", desc: "Keeping Soul Echoes free and evolving" },
                { icon: "🤝", title: "Practitioner Support", desc: "Fair pay for healers and therapists" },
                { icon: "🌱", title: "Community Programs", desc: "Free healing circles and workshops" },
                { icon: "♿", title: "Accessibility", desc: "ASL, AAC, screen reader, and more" },
                { icon: "🆘", title: "Crisis Services", desc: "24/7 crisis counselor availability" },
                { icon: "💎", title: "Practitioner Store Share", desc: "Practitioners keep 97% of store sales and 3% supports Rise Up Healing." },
                { icon: "🛍️", title: "Store Discount", desc: "Users receive 33% off all store products." },
                { icon: "🌍", title: "Global Reach", desc: "Multilingual support and outreach" },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 items-start p-3 rounded-lg bg-card/50">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground italic">
              Soul Echoes is a project of Rise Up Healing — a 501(c)(3) nonprofit organization.
              All proceeds go toward our mission of universal healing access. 🙏
            </p>
            <p className="text-xs text-center text-muted-foreground italic">
              Honor system pricing means you are trusted to choose the tier that best matches your means and your healing work.
            </p>
          </CardContent>
        </Card>

        <div className="h-8" />
      </div>
    </div>
  );
}
