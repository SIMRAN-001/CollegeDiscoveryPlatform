"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, GitCompare, Search } from "lucide-react";

export default function Navbar() {
  const path = usePathname();
  const links = [
    { href: "/", label: "Home", icon: null },
    { href: "/colleges", label: "Colleges", icon: Search },
    { href: "/compare", label: "Compare", icon: GitCompare },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <GraduationCap className="text-white" size={20} />
          </div>
          <span className="font-display font-bold text-xl text-slate-900">CollegeFind</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                path === href
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {Icon && <Icon size={15} />}
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
