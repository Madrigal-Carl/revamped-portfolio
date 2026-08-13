import BioCard from "./BioCard";
import SkillsCard from "./SkillsCard";
import { ContactCard, ExperienceCard, EducationCard } from "./InfoCards";
export default function Sidebar() {
  return (
    <aside className="space-y-2">
      <BioCard />
      <ContactCard />
      <SkillsCard />
      <ExperienceCard />
      <EducationCard />
    </aside>
  );
}
