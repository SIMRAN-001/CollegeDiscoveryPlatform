"use client";
import { useEffect, useState } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getColleges, getStates, College } from "@/lib/api";
import CollegeCard from "@/components/CollegeCard";
import { useRouter } from "next/navigation";

const COURSES = ["B.Tech", "M.Tech", "MBA", "MCA", "PhD"];
const FEE_RANGES = [
  { label: "Any", min: "", max: "" },
  { label: "Under ₹1L", min: "", max: "100000" },
  { label: "₹1L–₹3L", min: "100000", max: "300000" },
  { label: "₹3L–₹5L", min: "300000", max: "500000" },
  { label: "Above ₹5L", min: "500000", max: "" },
];

export default function CollegesPage() {
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedFee, setSelectedFee] = useState(0);
  const [compareList, setCompareList] = useState<College[]>([]);

  useEffect(() => {
    getStates().then(setStates);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, selectedState, selectedCourse, selectedFee]);

  useEffect(() => {
    setLoading(true);
    const fee = FEE_RANGES[selectedFee];
    const params: Record<string, string> = { page: String(page), limit: "9" };
    if (search) params.search = search;
    if (selectedState) params.location = selectedState;
    if (selectedCourse) params.course = selectedCourse;
    if (fee.min) params.min_fees = fee.min;
    if (fee.max) params.max_fees = fee.max;

    getColleges(params).then((data) => {
      setColleges(data.colleges);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setLoading(false);
    });
  }, [search, selectedState, selectedCourse, selectedFee, page]);

  const toggleCompare = (college: College) => {
    setCompareList((prev) => {
      if (prev.find((c) => c.id === college.id)) return prev.filter((c) => c.id !== college.id);
      if (prev.length >= 3) return prev;
      return [...prev, college];
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-slate-900 mb-1">Explore Colleges</h1>
        <p className="text-slate-500">{total} colleges found</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-8">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search college or city..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">All States</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">All Courses</option>
            {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={selectedFee} onChange={(e) => setSelectedFee(Number(e.target.value))} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {FEE_RANGES.map((f, i) => <option key={i} value={i}>{f.label}</option>)}
          </select>
          {(search || selectedState || selectedCourse || selectedFee !== 0) && (
            <button onClick={() => { setSearch(""); setSelectedState(""); setSelectedCourse(""); setSelectedFee(0); }} className="flex items-center gap-1.5 px-4 py-2.5 text-slate-500 hover:text-red-500 text-sm border border-slate-200 rounded-xl hover:border-red-200 transition-colors">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100" />)}
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎓</p>
          <h3 className="font-display text-2xl font-bold text-slate-700 mb-2">No colleges found</h3>
          <p className="text-slate-400">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <CollegeCard key={college.id} college={college} onCompare={toggleCompare} isSelected={!!compareList.find((c) => c.id === college.id)} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronLeft size={18} /></button>
          <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronRight size={18} /></button>
        </div>
      )}

      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4">
          <div className="flex gap-2">
            {compareList.map((c) => (
              <div key={c.id} className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5 text-sm">
                <span className="max-w-[100px] truncate">{c.name}</span>
                <button onClick={() => toggleCompare(c)}><X size={13} className="text-slate-400 hover:text-white" /></button>
              </div>
            ))}
            {compareList.length < 3 && (
              <div className="flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg px-3 py-1.5 text-sm text-slate-400">
                + Add {3 - compareList.length} more
              </div>
            )}
          </div>
          <button onClick={() => router.push(`/compare?ids=${compareList.map((c) => c.id).join(",")}`)} disabled={compareList.length < 2} className="bg-blue-500 hover:bg-blue-400 disabled:opacity-40 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors">
            Compare →
          </button>
        </div>
      )}
    </div>
  );
}