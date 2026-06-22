import React, { useEffect, useState } from "react";
import { DisciplinaryRecord } from "@/types/compliance";
import { DisciplinaryLedger } from "@/services/compliance/DisciplinaryLedger";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Public Disciplinary Ledger
 * Displays all banned practitioners and violations
 * Helps users avoid predatory actors
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
    if (violationType.includes("fraud")) return "bg-red-100 text-red-900";
    if (violationType.includes("payment")) return "bg-orange-100 text-orange-900";
    if (violationType.includes("predatory")) return "bg-rose-100 text-rose-900";
    return "bg-amber-100 text-amber-900";
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
          Platform Safety: Disciplinary Ledger
        </h1>
        <p className="mt-2 text-slate-600">
          Transparent record of practitioners banned for violating platform policies.
          Check here before working with anyone.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by practitioner name or business..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Records */}
      {filteredRecords.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          {searchQuery ? (
            <p className="text-slate-600">No records found for "{searchQuery}"</p>
          ) : (
            <p className="text-slate-600">✓ No disciplinary records at this time</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card
              key={record.id}
              className="border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 p-6"
            >
              {/* Practitioner Info */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-rose-900">
                    {record.practitionerName}
                  </h3>
                  {record.businessEntity && (
                    <p className="text-sm text-rose-700">Business: {record.businessEntity}</p>
                  )}
                </div>
                <Badge className="bg-red-500 text-white">BANNED PERMANENTLY</Badge>
              </div>

              {/* Violation Details */}
              <div className="grid gap-3 text-sm">
                <div>
                  <label className="font-semibold text-rose-900">Violation Type:</label>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        getViolationColor(record.violationType)
                      }`}
                    >
                      {record.violationType
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-rose-900">Reason:</label>
                  <p className="mt-1 text-slate-700">{record.reason}</p>
                </div>

                <div>
                  <label className="font-semibold text-rose-900">Ban Date:</label>
                  <p className="mt-1 text-slate-700">
                    {new Date(record.banDate).toLocaleDateString()}
                  </p>
                </div>

                {record.victimCount && record.victimCount > 0 && (
                  <div className="mt-3 rounded-lg bg-red-100 p-3 border border-red-300">
                    <p className="text-red-900 font-semibold">
                      ⚠️ {record.victimCount} user(s) were affected by this practitioner
                    </p>
                  </div>
                )}
              </div>

              {/* Warning */}
              <div className="mt-4 border-t border-rose-200 pt-4">
                <p className="text-xs text-rose-700 font-semibold">
                  ⛔ DO NOT ENGAGE with this practitioner. They are permanently banned
                  from the Soul Echoes platform.
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-semibold mb-2">📋 About This Ledger</p>
        <ul className="space-y-1 text-xs list-disc list-inside">
          <li>Records are verified before public listing</li>
          <li>Bans are permanent and non-negotiable</li>
          <li>Users can report violations anonymously via the platform</li>
          <li>All names listed have been given opportunity to appeal</li>
        </ul>
      </div>
    </div>
  );
};
