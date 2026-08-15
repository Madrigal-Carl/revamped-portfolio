import BioCard from "./BioCard";
import SkillsCard from "./SkillsCard";
import GalleryCard from "./GalleryCard";
import { ContactCard, ExperienceCard, EducationCard } from "./InfoCards";
export default function Sidebar({ projects }) {
  return (
    <aside className="space-y-2">
      <BioCard />
      <ContactCard />
      <SkillsCard />
      <ExperienceCard />
      <EducationCard />
      <GalleryCard projects={projects} />
    </aside>
  );
}
