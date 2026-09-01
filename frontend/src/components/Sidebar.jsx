import BioCard from "./BioCard";
import SkillsCard from "./SkillsCard";
import GalleryCard from "./GalleryCard";
import { ContactCard, ExperienceCard, EducationCard } from "./InfoCards";
export default function Sidebar({ projects }) {
  return (
    <aside className="space-y-2 lg:sticky lg:top-2 lg:self-start">
      <BioCard />
      <ContactCard />
      <ExperienceCard />
      <SkillsCard />
      <EducationCard />
      <GalleryCard projects={projects} />
    </aside>
  );
}
