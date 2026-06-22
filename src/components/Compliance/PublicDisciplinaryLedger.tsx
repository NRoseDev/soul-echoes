import React, { useEffect, useState } from "react";
import { DisciplinaryRecord } from "@/types/compliance";
import { DisciplinaryLedger } from "@/services/compliance/DisciplinaryLedger";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Search, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Public Disciplinary Ledger
 * Transparent, public-facing system displaying all banned practitioners
 * Accessible from community portal as a warning system
 */
export const PublicDisciplinaryLedger: React.FC = () => {
  const [records, setRecords] = useState<DisciplinaryRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<DisciplinaryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const ledger = new DisciplinaryLedger();

  useEffect(() => {
    const loadRecords = async () => {
      const publicRecords = await ledger.getPublicDisciplinaryLedger();
      setRecords(publicRecords);
      setFilteredRecords(publicRecords);
      setLoading(false);
    };

    loadRecords();
  }, [ledger]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecords(records);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = records.filter(
        (record) =>
          record.practitionerName.toLowerCase().includes(query) ||
          (record.businessEntity?.toLowerCase().includes(query) ?? false)
      );
      setFilteredRecords(filtered);
    }
  }, [searchQuery, records]);

  const getViolationColor = (violationType: string) => {
    if (violationType.includes("fraud")) return "bg-red-100 text-red-900 border-red-300";
    if (violationType.includes("payment")) return "bg-orange-100 text-orange-900 border-orange-300";
    if (violationType.includes("predatory")) return "bg-rose-100 text-rose-900 border-rose-300";
    return "bg-amber-100 text-amber-900 border-amber-300";
  };

  const getViolationLabel = (type: string) => {
    const labels: Record<string, string> = {
      external_payment_link: "��� External Payment Links",
      off_platform_solicitation: "🔗 Off-Platform Solicitation",
      price_gouging: "💰 Price Gouging",
      predatory_messaging: "⚠️ Predatory Messaging",
      fraud: "🚨 Fraud",
      shady_business_practice: "❌ Shady Business Practices",
    };
    return labels[type] || type.replace(/_/g, " ");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-600">Loading disciplinary records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="border-b-2 border-rose-200 pb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-rose-900">
          <AlertTriangle className="h-8 w-8" />
          Platform Safety: Community Warning System
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Transparent record of practitioners permanently banned for violating Soul Echoes policies
          and ethical standards. This public ledger protects our community from predatory actors.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search banned practitioners..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          aria-label="Search disciplinary records"
        />
      </div>

      {/* Records */}
      {filteredRecords.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          {searchQuery ? (
            <p className="text-slate-600">No records found for "{searchQuery}"</p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-8 w-8 text-green-600" />
              <p className="text-slate-600 font-semibold">✓ No disciplinary records at this time</p>
              <p className="text-sm text-slate-500">Soul Echoes has not issued any permanent bans.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card
              key={record.id}
              className="border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Practitioner Info & Ban Badge */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-rose-900">
                    {record.practitionerName}
                  </h3>
                  {record.businessEntity && (
                    <p className="text-sm text-rose-700 mt-1">
                      Business: <strong>{record.businessEntity}</strong>
                    </p>
                  )}
                </div>
                <Badge className="bg-red-600 text-white whitespace-nowrap flex-shrink-0 ml-4">
                  🚫 BANNED
                </Badge>
              </div>

              {/* Violation Details */}
              <div className="grid gap-4 text-sm mb-4">
                <div>
                  <label className="font-semibold text-rose-900 block mb-2">Violation Type:</label>
                  <div
                    className={`inline-block px-3 py-2 rounded-lg font-semibold text-xs border ${getViolationColor(
                      record.violationType
                    )}`}
                  >
                    {getViolationLabel(record.violationType)}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-rose-900">Reason for Ban:</label>
                  <p className="mt-1 text-slate-700 leading-relaxed">{record.reason}</p>
                </div>

                <div>
                  <label className="font-semibold text-rose-900">Ban Date:</label>
                  <p className="mt-1 text-slate-700">
                    {new Date(record.banDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {record.victimCount && record.victimCount > 0 && (
                  <div className="mt-2 rounded-lg bg-red-100 border border-red-300 p-3">
                    <p className="text-red-900 font-semibold text-sm">
                      ⚠️ <strong>{record.victimCount} user(s)</strong> were affected by this
                      practitioner's violations
                    </p>
                  </div>
                )}
              </div>

              {/* Warning */}
              <div className="border-t border-rose-200 pt-4 mt-4">
                <p className="text-xs text-rose-700 font-semibold">
                  🚫 DO NOT ENGAGE with this practitioner. They are permanently banned from Soul
                  Echoes for policy violations.
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-bold mb-2">📋 How Our Safety System Works</p>
        <ul className="space-y-1 text-xs list-disc list-inside">
          <li>All reports are investigated by our admin team within 48 hours</li>
          <li>Bans are permanent and non-negotiable after verification</li>
          <li>Users can report violations anonymously via the Reporting Portal</li>
          <li>Affected users are notified when their practitioner is banned</li>
          <li>This ledger is public to protect all Soul Echoes members</li>
        </ul>
      </div>

      {/* Report Portal Link */}
      <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold mb-2">🚨 Have evidence of a shady practitioner?</p>
        <p className="text-xs">
          Use the anonymous Reporting Portal to submit evidence. All reports are confidential and
          thoroughly investigated.
        </p>
      </div>
    </div>
  );
};
