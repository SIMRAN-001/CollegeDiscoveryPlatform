"use client";
import Link from "next/link";
import { MapPin, Star, IndianRupee, TrendingUp, GitCompare } from "lucide-react";
import { College, formatFees } from "@/lib/api";

interface Props {
  college: College;
  onCompare?: (college: College) => void;
  isSelected?: boolean;
}

export default function CollegeCard({ college, onCompare, isSelected }: Props) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
      isSelected ? "border-blue-500" : "border-transparent"
    }`}>
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={college.image_url}
          alt={college.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=800";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
          <Star size={13} className="text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-slate-800">{college.rating}</span>
        </div>
        <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-medium">
          {college.type}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display font-semibold text-slate-900 text-lg leading-tight mb-1">{college.name}</h3>
        <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
          <MapPin size={13} />
          <span>{college.location}, {college.state}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
              <IndianRupee size={11} />
              <span>Fees/Year</span>
            </div>
            <p className="font-semibold text-slate-800 text-sm">{formatFees(college.fees_per_year)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
              <TrendingUp size={11} />
              <span>Avg Package</span>
            </div>
            <p className="font-semibold text-slate-800 text-sm">₹{college.avg_package_lpa}L</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 text-center bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          {onCompare && (
            <button
              onClick={() => onCompare(college)}
              className={`px-3 py-2.5 rounded-xl border-2 transition-colors ${
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-slate-200 text-slate-500 hover:border-blue-300"
              }`}
              title="Add to compare"
            >
              <GitCompare size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
