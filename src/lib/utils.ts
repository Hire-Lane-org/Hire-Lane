import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function getDeadlineCountdown(deadlineDate: string | null | undefined): {
  text: string;
  isUrgent: boolean;
  isWarning: boolean;
} {
  if (!deadlineDate) {
    return { text: "-", isUrgent: false, isWarning: false };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(deadlineDate);
  deadline.setHours(0, 0, 0, 0);
  
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { text: "Passed", isUrgent: true, isWarning: false };
  } else if (diffDays === 0) {
    return { text: "Today", isUrgent: true, isWarning: false };
  } else if (diffDays === 1) {
    return { text: "1 day left", isUrgent: true, isWarning: false };
  } else if (diffDays <= 3) {
    return { text: `${diffDays} days left`, isUrgent: true, isWarning: false };
  } else if (diffDays <= 7) {
    return { text: `${diffDays} days left`, isUrgent: false, isWarning: true };
  } else if (diffDays <= 14) {
    return { text: "1 week left", isUrgent: false, isWarning: false };
  } else {
    const weeks = Math.floor(diffDays / 7);
    return { text: `${weeks} weeks left`, isUrgent: false, isWarning: false };
  }
}
