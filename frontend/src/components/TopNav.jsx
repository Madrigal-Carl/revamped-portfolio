import { Eye } from "lucide-react";
export default function TopNav({ visits }) {
  return (
    <nav className="h-14 bg-white border-b border-divider flex items-center justify-between px-3 sm:px-5 sticky top-0 z-30">
      <div className="w-9 h-9 rounded-lg bg-fb-blue text-white flex items-center justify-center text-2xl font-poppins font-extrabold leading-none">
        C
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5 text-xs text-text-secondary">
        <Eye size={14} /> {visits.toLocaleString()} profile views
      </div>
    </nav>
  );
}
