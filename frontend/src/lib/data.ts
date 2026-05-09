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
export const COLLEGES = [
  { id: 1, name: "IIT Bombay", location: "Mumbai", state: "Maharashtra", fees_per_year: 250000, rating: 4.9, courses: ["B.Tech","M.Tech","MBA","PhD"], placement_percentage: 98, avg_package_lpa: 24.5, top_recruiter: "Google", established: 1958, type: "Public", description: "Premier engineering institute and one of India's top technical universities with world-class research facilities.", image_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800" },
  { id: 2, name: "IIT Delhi", location: "New Delhi", state: "Delhi", fees_per_year: 230000, rating: 4.8, courses: ["B.Tech","M.Tech","MBA","PhD"], placement_percentage: 97, avg_package_lpa: 22.3, top_recruiter: "Microsoft", established: 1961, type: "Public", description: "Top-ranked IIT known for research excellence and strong industry connections in the capital city.", image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800" },
  { id: 3, name: "IIT Madras", location: "Chennai", state: "Tamil Nadu", fees_per_year: 240000, rating: 4.9, courses: ["B.Tech","M.Tech","MBA","PhD"], placement_percentage: 98, avg_package_lpa: 26.2, top_recruiter: "Apple", established: 1959, type: "Public", description: "Ranked #1 in India consistently by NIRF, known for innovation, research and entrepreneurship.", image_url: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800" },
  { id: 4, name: "BITS Pilani", location: "Pilani", state: "Rajasthan", fees_per_year: 550000, rating: 4.7, courses: ["B.Tech","M.Tech","MBA"], placement_percentage: 95, avg_package_lpa: 18.5, top_recruiter: "Amazon", established: 1964, type: "Private", description: "Pioneering private institute with industry-integrated education and a strong alumni network worldwide.", image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800" },
  { id: 5, name: "NIT Trichy", location: "Tiruchirappalli", state: "Tamil Nadu", fees_per_year: 145000, rating: 4.5, courses: ["B.Tech","M.Tech","MCA"], placement_percentage: 92, avg_package_lpa: 14.2, top_recruiter: "TCS", established: 1964, type: "Public", description: "Premier NIT in South India with strong placement record, research output, and industry partnerships.", image_url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800" },
  { id: 6, name: "VIT Vellore", location: "Vellore", state: "Tamil Nadu", fees_per_year: 200000, rating: 4.2, courses: ["B.Tech","M.Tech","MBA","MCA"], placement_percentage: 90, avg_package_lpa: 12.8, top_recruiter: "Wipro", established: 1984, type: "Private", description: "Large private university with global industry connections and a diverse student community.", image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800" },
  { id: 7, name: "IIIT Hyderabad", location: "Hyderabad", state: "Telangana", fees_per_year: 300000, rating: 4.6, courses: ["B.Tech","M.Tech","PhD"], placement_percentage: 96, avg_package_lpa: 20.1, top_recruiter: "Meta", established: 1998, type: "Public", description: "Specialized in IT and CS with cutting-edge research programs and exceptional placement records.", image_url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800" },
  { id: 8, name: "Manipal Institute of Technology", location: "Manipal", state: "Karnataka", fees_per_year: 400000, rating: 4.1, courses: ["B.Tech","M.Tech","MBA"], placement_percentage: 85, avg_package_lpa: 10.5, top_recruiter: "Infosys", established: 1957, type: "Private", description: "One of India's oldest private engineering institutes with a vibrant campus and strong global alumni.", image_url: "https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=800" },
  { id: 9, name: "DTU Delhi", location: "New Delhi", state: "Delhi", fees_per_year: 160000, rating: 4.3, courses: ["B.Tech","M.Tech","MBA","PhD"], placement_percentage: 91, avg_package_lpa: 15.6, top_recruiter: "Samsung", established: 1941, type: "Public", description: "Delhi's top state university with an excellent placement record and strong industry exposure.", image_url: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800" },
  { id: 10, name: "Jadavpur University", location: "Kolkata", state: "West Bengal", fees_per_year: 50000, rating: 4.4, courses: ["B.Tech","M.Tech","MBA","PhD"], placement_percentage: 88, avg_package_lpa: 13.4, top_recruiter: "IBM", established: 1955, type: "Public", description: "Premier engineering college of Eastern India offering affordable quality education and strong research.", image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800" },
  { id: 11, name: "SRM Institute of Science and Technology", location: "Chennai", state: "Tamil Nadu", fees_per_year: 350000, rating: 3.9, courses: ["B.Tech","M.Tech","MBA","PhD"], placement_percentage: 83, avg_package_lpa: 9.8, top_recruiter: "HCL", established: 1985, type: "Private", description: "Large multi-campus university with diverse program offerings and strong industry connections.", image_url: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800" },
  { id: 12, name: "PSG College of Technology", location: "Coimbatore", state: "Tamil Nadu", fees_per_year: 180000, rating: 4.0, courses: ["B.Tech","M.Tech","MBA"], placement_percentage: 87, avg_package_lpa: 11.2, top_recruiter: "Cognizant", established: 1951, type: "Private", description: "Reputed South Indian engineering college with strong industry ties and consistent placement performance.", image_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800" },
];


export function formatFees(fees: number) {
  if (fees >= 100000) return `₹${(fees / 100000).toFixed(1)}L/yr`;
  return `₹${(fees / 1000).toFixed(0)}K/yr`;
}