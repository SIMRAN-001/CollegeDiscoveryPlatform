"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Star, IndianRupee, TrendingUp, Users, Calendar, Building, ArrowLeft, GitCompare, BookOpen, MessageCircle } from "lucide-react";
import { getCollege, College, formatFees } from "@/lib/api";
import Link from "next/link";

export default function CollegeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview"|"courses"|"placements"|"reviews">("overview");

  useEffect(() => {
    getCollege(id as string)
      .then(setCollege)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-pulse">
      <div className="h-72 bg-slate-200 rounded-3xl mb-8" />
      <div className="h-10 bg-slate-200 rounded-xl w-2/3 mb-4" />
      <div className="h-5 bg-slate-100 rounded-xl w-1/3" />
    </div>
  );

  if (error || !college) return (
    <div className="text-center py-32">
      <p className="text-5xl mb-4">😕</p>
      <h2 className="font-display text-2xl font-bold text-slate-700 mb-4">College not found</h2>
      <Link href="/colleges" className="btn-primary">Back to Colleges</Link>
    </div>
  );

  const stats = [
    { label: "Fees / Year", value: formatFees(college.fees_per_year), icon: IndianRupee, color: "bg-blue-50 text-blue-600" },
    { label: "Rating", value: `${college.rating} / 5`, icon: Star, color: "bg-amber-50 text-amber-600" },
    { label: "Placement", value: `${college.placement_percentage}%`, icon: TrendingUp, color: "bg-green-50 text-green-600" },
    { label: "Avg Package", value: `₹${college.avg_package_lpa}L`, icon: Users, color: "bg-purple-50 text-purple-600" },
    { label: "Established", value: String(college.established), icon: Calendar, color: "bg-rose-50 text-rose-600" },
    { label: "Type", value: college.type, icon: Building, color: "bg-slate-50 text-slate-600" },
  ];

  const mockReviews = [
    { name: "Rahul M.", rating: 5, text: "Excellent faculty and research opportunities. Campus life is vibrant and engaging.", year: "2023" },
    { name: "Priya S.", rating: 4, text: "Great placements and industry exposure. Infrastructure could be better in some departments.", year: "2022" },
    { name: "Arjun K.", rating: 5, text: "Top-notch curriculum. The peer environment is extremely competitive and motivating.", year: "2023" },
  ];

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "courses", label: "Courses" },
    { key: "placements", label: "Placements" },
    { key: "reviews", label: "Reviews" },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Hero Image */}
      <div className="relative h-72 rounded-3xl overflow-hidden mb-8 shadow-lg">
        <img
          src={college.image_url}
          alt={college.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=800"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">{college.type}</span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">Est. {college.established}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">{college.name}</h1>
          <div className="flex items-center gap-1.5 text-white/80 text-sm">
            <MapPin size={14} />
            <span>{college.location}, {college.state}</span>
          </div>
        </div>
        <div className="absolute top-5 right-5 bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-md">
          <Star size={15} className="text-amber-500 fill-amber-500" />
          <span className="font-bold text-slate-800">{college.rating}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-slate-400 text-xs mb-1">{label}</p>
            <p className="font-display font-bold text-slate-900 text-lg">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl mb-6 overflow-x-auto">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === key ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="sm:col-span-2">

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3">About {college.name}</h2>
              <p className="text-slate-600 leading-relaxed mb-4">{college.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Location</p>
                  <p className="font-semibold text-slate-700">{college.location}, {college.state}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">College Type</p>
                  <p className="font-semibold text-slate-700">{college.type}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Established</p>
                  <p className="font-semibold text-slate-700">{college.established}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Top Recruiter</p>
                  <p className="font-semibold text-slate-700">{college.top_recruiter}</p>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-blue-500" /> Courses Offered
              </h2>
              <div className="flex flex-wrap gap-3">
                {college.courses.map((course) => (
                  <div key={course} className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3 text-center">
                    <p className="font-semibold text-blue-700">{course}</p>
                    <p className="text-blue-400 text-xs mt-0.5">4 Year Program</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placements Tab */}
          {activeTab === "placements" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-500" /> Placement Statistics
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-green-600 text-xs font-medium mb-1">Placement Rate</p>
                    <p className="font-display font-bold text-3xl text-green-700">{college.placement_percentage}%</p>
                    <div className="w-full bg-green-100 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${college.placement_percentage}%` }} />
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <p className="text-emerald-600 text-xs font-medium mb-1">Average Package</p>
                    <p className="font-display font-bold text-3xl text-emerald-700">₹{college.avg_package_lpa}L</p>
                    <p className="text-emerald-400 text-xs mt-1">per annum</p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-3">Top Recruiting Companies</p>
                  <div className="flex flex-wrap gap-2">
                    {[college.top_recruiter, "Deloitte", "Accenture", "KPMG", "McKinsey", "Adobe"].map((r) => (
                      <span key={r} className="bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2 rounded-xl font-medium shadow-sm">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-display font-bold text-slate-800 mb-3">Year-wise Placement Trend</h3>
                <div className="space-y-3">
                  {[
                    { year: "2024", percent: college.placement_percentage, pkg: college.avg_package_lpa },
                    { year: "2023", percent: Math.max(80, college.placement_percentage - 3), pkg: Math.max(8, college.avg_package_lpa - 1.5) },
                    { year: "2022", percent: Math.max(75, college.placement_percentage - 7), pkg: Math.max(7, college.avg_package_lpa - 3) },
                  ].map(({ year, percent, pkg }) => (
                    <div key={year} className="flex items-center gap-4">
                      <span className="text-slate-500 text-sm w-10">{year}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-3">
                        <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-slate-700 text-sm font-semibold w-16 text-right">{percent}% | ₹{pkg.toFixed(1)}L</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MessageCircle size={18} className="text-purple-500" /> Student Reviews
              </h2>
              <div className="space-y-1">
                {mockReviews.map((r) => (
                  <div key={r.name} className="border-b border-slate-100 last:border-0 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">{r.name[0]}</div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{r.name}</p>
                          <p className="text-slate-400 text-xs">Batch of {r.year}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
            <h3 className="font-display font-bold text-slate-800 mb-1">Top Recruiter</h3>
            <p className="text-2xl font-bold text-green-600">{college.top_recruiter}</p>
            <p className="text-slate-500 text-sm mt-1">Highest placement offer</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
            <h3 className="font-display font-bold text-slate-800 mb-2">Placement Stats</h3>
            <div className="w-full bg-blue-100 rounded-full h-3 mb-2">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-700"
                style={{ width: `${college.placement_percentage}%` }}
              />
            </div>
            <p className="text-blue-700 font-bold text-lg">{college.placement_percentage}%</p>
            <p className="text-slate-500 text-sm">Students placed</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="font-display font-bold text-slate-800 mb-3">Quick Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Fees/Year</span>
                <span className="font-semibold text-slate-800">{formatFees(college.fees_per_year)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rating</span>
                <span className="font-semibold text-slate-800">⭐ {college.rating}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Avg Package</span>
                <span className="font-semibold text-slate-800">₹{college.avg_package_lpa}L</span>
              </div>
            </div>
          </div>

          <Link
            href={`/compare?ids=${college.id}`}
            className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3.5 rounded-2xl font-semibold hover:bg-slate-700 transition-colors"
          >
            <GitCompare size={18} /> Compare This College
          </Link>
        </div>
      </div>
    </div>
  );
}
