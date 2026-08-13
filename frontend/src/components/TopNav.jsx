import { Eye } from "lucide-react";
import logo from "../assets/logo.png";
export default function TopNav({ visits }) {
  return (
    <nav className="h-14 bg-white border-b border-divider flex items-center justify-between px-3 sm:px-5 sticky top-0 z-30">
      <img className="w-9 h-9 rounded-lg object-cover" src={logo} alt="Carl Salido Madrigal logo" />
      <div className="flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5 text-xs text-text-secondary">
        <Eye size={14} /> {visits.toLocaleString()} profile views
      </div>
    </nav>
  );
}
