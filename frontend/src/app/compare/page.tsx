import { Suspense } from "react";
import CompareClient from "./CompareClient";

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"/></div>}>
      <CompareClient />
    </Suspense>
  );
}
