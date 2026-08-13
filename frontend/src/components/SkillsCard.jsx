import { Code2 } from "lucide-react";
import { skills } from "../data/skills";
export default function SkillsCard() {
  return (
    <div className="bg-white rounded-lg p-3">
      <h2 className="font-poppins font-bold text-xl flex items-center gap-2 mb-3">
        <Code2 size={21} /> Skills
      </h2>
      {skills.map(([category, CategoryIcon, rows], i) => (
        <div
          key={category}
          className={`pb-2 mb-2 ${i < skills.length - 1 ? "border-b border-divider" : ""}`}
        >
          <div className="flex items-center gap-2 text-sm font-semibold mb-1">
            <CategoryIcon size={18} className="text-text-secondary" />{" "}
            {category}
          </div>
          {rows.map(([name, Icon, level]) => (
            <div key={name} className="h-8 flex items-center gap-2 text-sm">
              <Icon size={18} />
              <span className="flex-1">{name}</span>
              <span
                className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${level === "Basic" ? "bg-canvas text-text-secondary" : level === "Intermediate" ? "bg-fb-blue-tint text-fb-blue" : level === "Advanced" ? "bg-fb-blue-tint-2 text-fb-blue-pressed" : "bg-fb-blue text-white"}`}
              >
                {level}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
