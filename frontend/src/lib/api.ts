const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface College {
  id: number;
  name: string;
  location: string;
  state: string;
  fees_per_year: number;
  rating: number;
  courses: string[];
  placement_percentage: number;
  avg_package_lpa: number;
  top_recruiter: string;
  established: number;
  type: string;
  description: string;
  image_url: string;
}

export interface CollegesResponse {
  colleges: College[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getColleges(params: Record<string, string> = {}): Promise<CollegesResponse> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/colleges?${qs}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch colleges");
  }

  return res.json();
}

export async function getCollege(id: string): Promise<College> {
  const res = await fetch(`${API}/colleges/${id}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("College not found");
  }

  return res.json();
}

export async function compareColleges(ids: number[]): Promise<College[]> {
  const res = await fetch(`${API}/compare?ids=${ids.join(",")}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to compare colleges");
  }

  return res.json();
}

export async function getStates(): Promise<string[]> {
  const res = await fetch(`${API}/states`, { cache: "no-store" });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export function formatFees(fees: number) {
  if (fees >= 100000) {
    return `₹${(fees / 100000).toFixed(1)}L/yr`;
  }

  return `₹${(fees / 1000).toFixed(0)}K/yr`;
}