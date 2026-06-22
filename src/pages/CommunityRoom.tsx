import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Heart, Lock, Users, Zap } from "lucide-react";
import { PublicDisciplinaryLedger } from "@/components/Compliance/PublicDisciplinaryLedger";
import { ShadyBusinessReportingPortal } from "@/components/Compliance/ShadyBusinessReportingPortal";

interface CommunityRoomProps {
  activeTab?: "overview" | "ledger" | "report";
}

/**
 * Community & Portal Spaces
 * Features: 4 Group Healing Circles, Collaborative Business Incubator,
 * Public Disciplinary Ledger, and Safety Systems
 */
export const CommunityRoom: React.FC<CommunityRoomProps> = ({
  activeTab = "overview",
}) => {
  const [currentTab, setCurrentTab] = React.useState(activeTab);

  const healingCircles = [
    {
      id: "physical",
      name: "Physical Healing Circle",
      emoji: "💪",
      description: "Connect with others on physical wellness journeys",
      members: 234,
    },
    {
      id: "mental-emotional",
      name: "Mental & Emotional Wellness",
      emoji: "💭",
      description: "Support for mental health, emotional release, and processing",
      members: 567,
    },
    {
      id: "spiritual",
      name: "Spiritual Awakening Circle",
      emoji: "✨",
      description: "Explore spiritual practices, beliefs, and personal growth",
      members: 345,
    },
    {
      id: "energy",
      name: "Energy & Spirit",
      emoji: "🌀",
      description: "Work with energy, chakras, aura, and spiritual tools",
      members: 289,
    },
  ];

  const incubatorFeatures = [
    "Collaborative Projects for Healers",
    "Business Resources & Templates",
    "Revenue Sharing Partnerships",
    "Peer Mentorship",
    "Marketing Support",
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="border-b-2 border-purple-200 pb-6">
        <h1 className="text-4xl font-bold text-slate-900">👥 Community & Healing Circles</h1>
        <p className="mt-2 text-slate-600 text-lg">
          Connect with others, share experiences, and grow together in a safe space.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        <Button
          variant={currentTab === "overview" ? "default" : "ghost"}
          onClick={() => setCurrentTab("overview")}
          className="rounded-b-none"
        >
          Overview
        </Button>
        <Button
          variant={currentTab === "ledger" ? "default" : "ghost"}
          onClick={() => setCurrentTab("ledger")}
          className="rounded-b-none flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          Safety Ledger
        </Button>
        <Button
          variant={currentTab === "report" ? "default" : "ghost"}
          onClick={() => setCurrentTab("report")}
          className="rounded-b-none flex items-center gap-2"
        >
          <AlertTriangle className="h-4 w-4" />
          Report Issue
        </Button>
      </div>

      {/* Overview Tab */}
      {currentTab === "overview" && (
        <div className="space-y-8">
          {/* Healing Circles */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">🌀 Healing Circles</h2>
            <p className="text-slate-600 mb-6">
              Join group discussions, support others, and find community around your healing journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healingCircles.map((circle) => (
                <Card
                  key={circle.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{circle.emoji}</span>
                    <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      {circle.members} members
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{circle.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{circle.description}</p>
                  <Button variant="outline" className="w-full">
                    Join Circle
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Business Incubator */}
          <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6" />
              Collaborative Business Incubator
            </h2>
            <p className="text-amber-800 mb-6">
              For healers, coaches, and practitioners: Build your practice with peer support,
              shared resources, and collaborative opportunities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {incubatorFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <span className="text-amber-900 font-semibold">{feature}</span>
                </div>
              ))}
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Learn About Incubator
            </Button>
          </div>

          {/* Safety & Transparency */}
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8">
            <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Our Commitment to Safety
            </h2>
            <p className="text-green-800 mb-4">
              Soul Echoes maintains strict ethical standards. We have transparent systems to protect
              all members:
            </p>
            <ul className="space-y-2 text-sm text-green-900 mb-6">
              <li>
                ✓ <strong>Pricing Enforcement:</strong> $55/hour hard cap on all practitioners
              </li>
              <li>
                ✓ <strong>Platform Compliance:</strong> Automated detection of off-platform
                solicitation
              </li>
              <li>
                ✓ <strong>Public Disciplinary Ledger:</strong> Transparent record of banned members
              </li>
              <li>
                ✓ <strong>Anonymous Reporting:</strong> Safe channels to report violations
              </li>
              <li>
                ✓ <strong>3% Nonprofit Fund:</strong> All platform revenue supports Rise Up Healing
              </li>
            </ul>
            <Button variant="outline" onClick={() => setCurrentTab("ledger")}>
              View Safety Ledger
            </Button>
          </div>
        </div>
      )}

      {/* Safety Ledger Tab */}
      {currentTab === "ledger" && <PublicDisciplinaryLedger />}

      {/* Report Issue Tab */}
      {currentTab === "report" && <ShadyBusinessReportingPortal />}
    </div>
  );
};

export default CommunityRoom;
