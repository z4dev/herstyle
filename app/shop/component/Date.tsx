import React from "react";

// Add this helper function at the top of the file
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} دقيقة`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `منذ ${hours} ساعة`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `منذ ${days} يوم`;
  }
}

function DateOfComment({ date }: { date: any }) {
  return <span className="text-gray-500 text-sm">{formatTimeAgo(date)}</span>;
}

export default DateOfComment;
