"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getColleges, compareColleges, College, formatFees } from "@/lib/api";
import { Star, MapPin, IndianRupee, TrendingUp, Users, GitCompare, X, Plus, Check } from "lucide-react";
import Link from "next/link";

const COMPARE_FIELDS = [
  { key: "rating", label: "Rating", format: (v: number) => `${v} / 5`, icon: Star },
  { key: "fees_per_year", label: "Fees / Year", format: (v: number) => formatFees(v), icon: IndianRupee },
  { key: "placement_percentage", label: "Placement %", format: (v: number) => `${v}%`, icon: TrendingUp },
  { key: "avg_package_lpa", label: "Avg Package", format: (v: number) => `₹${v}L`, icon: Users },
  { key: "location", label: "Location", format: (v: string) => v, icon: MapPin },
  { key: "state", label: "State", format: (v: string) => v, icon: null },
  { key: "type", label: "Type", format: (v: string) => v, icon: null },
  { key: "established", label: "Established", format: (v: number) => String(v), icon: null },
  { key: "top_recruiter", label: "Top Recruiter", format: (v: string) => v, icon: null },
];

function getBest(colleges: College[], key: string): number | null {
  const higherBetter = ["rating", "placement_percentage", "avg_package_lpa"];
  const lowerBetter = ["fees_per_year"];
  if (higherBetter.includes(key)) {
    const vals = colleges.map((c) => (c as never)[key] as number);
    return vals.indexOf(Math.max(...vals));
  }
  if (lowerBetter.includes(key)) {
    const vals = colleges.map((c) => (c as never)[key] as number);
    return vals.indexOf(Math.min(...vals));
  }
  return null;
}

const COLORS = ["bg-blue-600", "bg-violet-600", "bg-emerald-600"];
const LIGHT = ["bg-blue-50 border-blue-200", "bg-violet-50 border-violet-200", "bg-emerald-50 border-emerald-200"];
const TEXT = ["text-blue-700", "text-violet-700", "text-emerald-700"];

export default function CompareClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [search, setSearch] = useState("");

  const idsParam = searchParams.get("ids");

  useEffect(() => {
  getColleges({ limit: "50" })
    .then((d) => {
      if (Array.isArray(d)) {
        setAllColleges(d);
      } else if (Array.isArray(d?.colleges)) {
        setAllColleges(d.colleges);
      } else {
        setAllColleges([]);
      }
    })
    .catch(() => {
      setAllColleges([]);
    });
}, []);

  useEffect(() => {
    if (!idsParam) return;
    const ids = idsParam.split(",").map(Number).filter(Boolean).slice(0, 3);
    if (!ids.length) return;
    compareColleges(ids).then(setColleges).catch(() => {});
  }, [idsParam]);

  const addCollege = (college: College) => {
    if (colleges.find((c) => c.id === college.id) || colleges.length >= 3) return;
    const newList = [...colleges, college];
    setColleges(newList);
    router.replace(`/compare?ids=${newList.map((c) => c.id).join(",")}`);
    setSearch("");
  };

  const removeCollege = (id: number) => {
    const newList = colleges.filter((c) => c.id !== id);
    setColleges(newList);
    router.replace(newList.length ? `/compare?ids=${newList.map((c) => c.id).join(",")}` : "/compare");
  };

  const filtered = allColleges.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) && !colleges.find((s) => s.id === c.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-slate-900 mb-1 flex items-center gap-3">
          <GitCompare className="text-blue-600" /> Compare Colleges
        </h1>
        <p className="text-slate-500">Select up to 3 colleges to compare side by side</p>
      </div>

      {/* College Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[0, 1, 2].map((slot) => {
          const college = colleges[slot];
          return (
            <div key={slot}>
              {college ? (
                <div className={`relative rounded-2xl border-2 p-5 ${LIGHT[slot]}`}>
                  <button
                    onClick={() => removeCollege(college.id)}
                    className="absolute top-3 right-3 bg-white rounded-full p-1 shadow hover:bg-red-50 transition-colors"
                  >
                    <X size={14} className="text-slate-500" />
                  </button>
                  <div className={`w-8 h-8 rounded-lg ${COLORS[slot]} flex items-center justify-center text-white font-bold text-sm mb-3`}>
                    {slot + 1}
                  </div>
                  <img
                    src={college.image_url}
                    alt={college.name}
                    className="w-full h-28 object-cover rounded-xl mb-3"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=800"; }}
                  />
                  <h3 className={`font-display font-bold ${TEXT[slot]} leading-tight`}>{college.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                    <MapPin size={11} />
                    <span>{college.location}, {college.state}</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-5 min-h-[200px] flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Plus size={20} className="text-slate-400" />
                  </div>
                  <p className="text-slate-400 text-sm text-center">Add College {slot + 1}</p>
                  {slot === colleges.length && (
                    <div className="w-full relative">
                      <input
                        type="text"
                        placeholder="Search college..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      {search && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10 mt-1">
                          {filtered.slice(0, 8).map((c) => (
                            <button
                              key={c.id}
                              onClick={() => addCollege(c)}
                              className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-sm border-b border-slate-50 last:border-0 transition-colors"
                            >
                              <p className="font-medium text-slate-800">{c.name}</p>
                              <p className="text-slate-400 text-xs">{c.location}</p>
                            </button>
                          ))}
                          {filtered.length === 0 && (
                            <p className="text-center text-slate-400 py-4 text-sm">No results</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      {colleges.length >= 2 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-4">
            <h2 className="font-display text-xl font-bold">Side-by-Side Comparison</h2>
            <p className="text-slate-400 text-sm">✓ = Best in this category</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-4 text-slate-500 font-medium text-sm w-1/4">Metric</th>
                  {colleges.map((c, i) => (
                    <th key={c.id} className="px-6 py-4 text-center">
                      <span className={`font-display font-bold ${TEXT[i]}`}>{c.name.split(" ").slice(0, 3).join(" ")}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_FIELDS.map(({ key, label, format, icon: Icon }, rowIdx) => {
                  const bestIdx = getBest(colleges, key);
                  return (
                    <tr key={key} className={rowIdx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          {Icon && <Icon size={15} className="text-slate-400" />}
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                      </td>
                      {colleges.map((c, i) => {
                        const val = (c as never)[key];
                        const isBest = bestIdx === i;
                        return (
                          <td key={c.id} className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <span className={`font-semibold text-sm ${isBest ? TEXT[i] : "text-slate-700"}`}>
                                {format(val)}
                              </span>
                              {isBest && (
                                <span className={`${COLORS[i]} text-white rounded-full p-0.5`}>
                                  <Check size={10} />
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Courses row */}
                <tr className="bg-slate-50/50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600">Courses</span>
                  </td>
                  {colleges.map((c) => (
                    <td key={c.id} className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {c.courses.map((course) => (
                          <span key={course} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-lg">{course}</span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Winner Banner */}
          {(() => {
            const scores = colleges.map((c) => c.rating * 10 + c.placement_percentage / 10 - c.fees_per_year / 100000 + c.avg_package_lpa);
            const winnerIdx = scores.indexOf(Math.max(...scores));
            return (
              <div className={`${LIGHT[winnerIdx]} border-t-2 ${(LIGHT[winnerIdx] || "").split(" ")[1] || ""} px-6 py-5`}>
                <div className="flex items-center gap-3">
                  <div className={`${COLORS[winnerIdx]} text-white rounded-full p-2`}>
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Overall Best Pick</p>
                    <p className={`font-display font-bold text-xl ${TEXT[winnerIdx]}`}>
                      🏆 {colleges[winnerIdx]?.name || "Best College"}                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">Based on rating, placement rate, avg package, and fees</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center">
          <GitCompare size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold text-slate-500 mb-2">Select at least 2 colleges</h3>
          <p className="text-slate-400 mb-6">Use the boxes above to pick colleges, or browse the list</p>
          <Link href="/colleges" className="btn-primary inline-block">Browse Colleges</Link>
        </div>
      )}
    </div>
  );
}
