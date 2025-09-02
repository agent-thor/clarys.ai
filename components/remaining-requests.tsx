"use client";

import { useEffect, useState } from "react";

interface RemainingRequestsProps {
  initialCount?: number | null;
}

export function RemainingRequests({ initialCount = null }: RemainingRequestsProps) {
  const [remainingRequests, setRemainingRequests] = useState<number | null>(initialCount);

  // Update when initialCount changes
  useEffect(() => {
    setRemainingRequests(initialCount);
  }, [initialCount]);

  if (remainingRequests === null) {
    return null;
  }

  return (
    <div className="flex justify-center mb-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm">
        <span className="text-blue-700 font-medium">
          🔢 Remaining Requests: <span className="font-bold">{remainingRequests}</span>
        </span>
      </div>
    </div>
  );
}
