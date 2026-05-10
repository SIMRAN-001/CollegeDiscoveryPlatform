import Link from "next/link";
import { Search, GitCompare, TrendingUp, GraduationCap } from "lucide-react";
import { getColleges } from "@/lib/api";
import CollegeCard from "@/components/CollegeCard";

export default async function Home() {
  const data = await getColleges({ limit: "3" }).catch(() => ({
    colleges: [],
  }));

  const colleges = data.colleges || [];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6">
            <GraduationCap size={16} />
            <span>India's smartest college search</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl font-bold mb-5 leading-tight">
            Find Your <span className="text-amber-300">Perfect</span> College
          </h1>

          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            Search, explore, and compare top colleges across India — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/colleges"
              className="bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center"
            >
              <Search size={18} />
              Explore Colleges
            </Link>

            <Link
              href="/compare"
              className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2 justify-center border border-white/30"
            >
              <GitCompare size={18} />
              Compare Colleges
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Colleges Listed", value: "12+", icon: GraduationCap },
            { label: "States Covered", value: "8+", icon: TrendingUp },
            { label: "Avg Package", value: "₹15L", icon: TrendingUp },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white rounded-2xl shadow-lg p-5 text-center border border-slate-100"
            >
              <p className="font-display text-3xl font-bold text-blue-600 mb-1">
                {value}
              </p>
              <p className="text-slate-500 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-slate-900">
              Top Colleges
            </h2>
            <p className="text-slate-500 mt-1">
              Highest rated institutions in India
            </p>
          </div>

          <Link href="/colleges" className="btn-outline text-sm">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college: any) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-6 mb-12">
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl p-10 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Can't decide between colleges?
          </h2>

          <p className="text-amber-100 mb-6">
            Compare fees, placements, ratings side by side
          </p>

          <Link
            href="/compare"
            className="bg-white text-orange-600 font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors inline-flex items-center gap-2"
          >
            <GitCompare size={18} />
            Start Comparing
          </Link>
        </div>
      </section>
    </div>
  );
}