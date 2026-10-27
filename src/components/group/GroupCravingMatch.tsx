"use client";

import React, { useMemo, useState } from "react";
import { Sparkles, Vote, CheckCircle2, AlertTriangle, ArrowRight, Leaf } from "lucide-react";
import { MENU_ITEMS } from "@/data/menuData";
import { MenuItem } from "@/types";

export interface MatchParticipant {
  id: string;
  name: string;
  avatarColor: string;
}

interface ParticipantVote {
  cuisine: string;
  vegOnly: boolean;
  maxBudget: number;
}

export interface MatchAssignment {
  participantId: string;
  menuItem: MenuItem;
}

interface GroupCravingMatchProps {
  participants: MatchParticipant[];
  /** Replaces every participant's tray with their matched dish. */
  onApplyMatch: (assignments: MatchAssignment[]) => void;
}

const CUISINES = Array.from(new Set(MENU_ITEMS.map((m) => m.cuisine)));
const BUDGET_OPTIONS = [250, 350, 450, 650];
const VEG_DIETS = new Set(["veg", "vegan"]);

const defaultVote = (): ParticipantVote => ({
  cuisine: CUISINES[0],
  vegOnly: false,
  maxBudget: 450
});

function isEligible(item: MenuItem, vote: ParticipantVote): boolean {
  if (item.price > vote.maxBudget) return false;
  if (vote.vegOnly && !VEG_DIETS.has(item.dietary)) return false;
  return true;
}

export default function GroupCravingMatch({ participants, onApplyMatch }: GroupCravingMatchProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [votes, setVotes] = useState<Record<string, ParticipantVote>>({});
  const [appliedKey, setAppliedKey] = useState<string | null>(null);

  const voteFor = (pid: string): ParticipantVote => votes[pid] ?? defaultVote();
  const updateVote = (pid: string, patch: Partial<ParticipantVote>) =>
    setVotes((prev) => ({ ...prev, [pid]: { ...(prev[pid] ?? defaultVote()), ...patch } }));

  const result = useMemo(() => {
    const total = participants.length;

    // Real tally of cuisine votes
    const tally: Record<string, number> = {};
    participants.forEach((p) => {
      const c = (votes[p.id] ?? defaultVote()).cuisine;
      tally[c] = (tally[c] ?? 0) + 1;
    });

    // Evaluate every restaurant: can it serve every participant within their own limits?
    const restaurantIds = Array.from(new Set(MENU_ITEMS.map((m) => m.restaurantId)));
    const candidates = restaurantIds
      .map((rid) => {
        const dishes = MENU_ITEMS.filter((m) => m.restaurantId === rid).sort((a, b) => b.rating - a.rating);
        const used = new Set<string>();
        const assignments: MatchAssignment[] = [];
        for (const p of participants) {
          const vote = votes[p.id] ?? defaultVote();
          const eligible = dishes.filter((d) => isEligible(d, vote));
          if (eligible.length === 0) return null;
          // Prefer a dish nobody else has yet, for variety; otherwise reuse the best match.
          const pick = eligible.find((d) => !used.has(d.id)) ?? eligible[0];
          used.add(pick.id);
          assignments.push({ participantId: p.id, menuItem: pick });
        }
        const cuisine = dishes[0].cuisine;
        return {
          restaurantId: rid,
          restaurantName: dishes[0].restaurantName,
          cuisine,
          votes: tally[cuisine] ?? 0,
          assignments
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null)
      .sort((a, b) => b.votes - a.votes);

    const best = candidates[0] ?? null;
    const lowestBudget = Math.min(...participants.map((p) => (votes[p.id] ?? defaultVote()).maxBudget));
    const vegCount = participants.filter((p) => (votes[p.id] ?? defaultVote()).vegOnly).length;

    return { total, tally, best, lowestBudget, vegCount };
  }, [participants, votes]);

  const resultKey = result.best
    ? result.best.assignments.map((a) => `${a.participantId}:${a.menuItem.id}`).join("|")
    : null;
  const isApplied = resultKey !== null && resultKey === appliedKey;

  const handleApply = () => {
    if (!result.best) return;
    onApplyMatch(result.best.assignments);
    setAppliedKey(resultKey);
  };

  const sortedTally = Object.entries(result.tally).sort((a, b) => b[1] - a[1]);

  return (
    <section
      aria-labelledby="group-match-heading"
      className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE5DF] shadow-xs space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3EFEA]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF1EE] text-[#FF4D2D] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 id="group-match-heading" className="text-lg font-black text-[#1A1715]">
              Group Craving Match
            </h2>
            <p className="text-xs text-[#766E65]">
              Each person sets a cuisine, diet and budget. CRAVE finds one restaurant that works for everyone.
            </p>
          </div>
        </div>
        <button
          id="group-match-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="text-xs font-bold text-[#FF4D2D] hover:underline self-start sm:self-auto cursor-pointer"
        >
          {isOpen ? "Collapse" : "Open matcher"}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* Per-participant votes */}
          <div className="space-y-2">
            {participants.map((p) => {
              const vote = voteFor(p.id);
              return (
                <div
                  key={p.id}
                  className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto_auto] gap-3 items-center p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1A1715]">
                    <span className={`w-3 h-3 rounded-full ${p.avatarColor}`} />
                    {p.name}
                  </div>

                  <label className="text-[11px] text-[#766E65] flex items-center gap-2">
                    <Vote className="w-3.5 h-3.5 text-[#FF4D2D] shrink-0" />
                    <span className="sr-only">Cuisine vote for {p.name}</span>
                    <select
                      value={vote.cuisine}
                      onChange={(e) => updateVote(p.id, { cuisine: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-[#E5DDD4] text-xs text-[#1A1715] focus:outline-none focus:border-[#FF4D2D]"
                    >
                      {CUISINES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-[11px] text-[#766E65] flex items-center gap-2">
                    <span className="sr-only">Maximum budget for {p.name}</span>
                    <select
                      value={vote.maxBudget}
                      onChange={(e) => updateVote(p.id, { maxBudget: Number(e.target.value) })}
                      className="px-2 py-1.5 rounded-lg bg-white border border-[#E5DDD4] text-xs text-[#1A1715] focus:outline-none focus:border-[#FF4D2D]"
                    >
                      {BUDGET_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          Up to ₹{b}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    onClick={() => updateVote(p.id, { vegOnly: !vote.vegOnly })}
                    aria-pressed={vote.vegOnly}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                      vote.vegOnly
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-[#766E65] border-[#E5DDD4] hover:border-emerald-600"
                    }`}
                  >
                    <Leaf className="w-3.5 h-3.5" />
                    Veg only
                  </button>
                </div>
              );
            })}
          </div>

          {/* Real vote tally */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#1A1715]">Cuisine votes</span>
            {sortedTally.map(([cuisine, count]) => {
              const pct = Math.round((count / result.total) * 100);
              return (
                <div key={cuisine} className="text-xs">
                  <div className="flex justify-between text-[#1A1715] mb-1">
                    <span>{cuisine}</span>
                    <span className="font-bold">
                      {count}/{result.total} · {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-[#F3EFEA] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#FF4D2D] h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verdict */}
          {result.best ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FFF5F2] to-[#FAF8F5] border border-[#FFD9D1] space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF4D2D]" />
                    <span className="text-xs font-black uppercase tracking-wider text-[#FF4D2D]">
                      Best match · {result.best.votes} of {result.total} voted for this cuisine
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#1A1715]">
                    {result.best.restaurantName} <span className="font-normal text-[#766E65]">({result.best.cuisine})</span>
                  </p>
                  <p className="text-xs text-[#766E65]">
                    Serves {result.vegCount} veg-only {result.vegCount === 1 ? "diner" : "diners"} and keeps every dish within
                    each person&apos;s own budget (lowest cap ₹{result.lowestBudget}).
                    {result.best.votes < result.total &&
                      " A higher-voted cuisine couldn't serve everyone within these limits."}
                  </p>
                </div>
                <button
                  id="group-match-apply"
                  onClick={handleApply}
                  disabled={isApplied}
                  className="px-5 py-3 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1B] disabled:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:cursor-default whitespace-nowrap shrink-0"
                >
                  <span>{isApplied ? "Applied to trays ✓" : "Replace trays with this match"}</span>
                  {!isApplied && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {result.best.assignments.map((a) => {
                  const p = participants.find((x) => x.id === a.participantId);
                  return (
                    <li key={a.participantId} className="flex justify-between gap-2 p-2.5 rounded-xl bg-white border border-[#EBE5DF]">
                      <span className="text-[#766E65]">{p?.name}</span>
                      <span className="font-bold text-[#1A1715] text-right">
                        {a.menuItem.name} · ₹{a.menuItem.price}{" "}
                        <span className={VEG_DIETS.has(a.menuItem.dietary) ? "text-emerald-600" : "text-red-600"}>
                          ({a.menuItem.dietary})
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div role="status" className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-900">
                No single restaurant can serve everyone within these limits. The lowest budget cap is ₹
                {result.lowestBudget}
                {result.vegCount > 0 ? ` and ${result.vegCount} diner(s) are veg-only` : ""}. Try raising a budget or relaxing a
                diet setting.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
