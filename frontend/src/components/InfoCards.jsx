import {
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
  Link as LinkIcon,
  Mail,
  Phone,
} from "lucide-react";
import { profile, experience, education } from "../data/profile";

export function ContactCard() {
  return (
    <div className="bg-white rounded-lg p-3">
      <h2 className="font-poppins font-bold text-xl mb-3">Details</h2>
      <div className="space-y-2 text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">{profile.name}</p>
        <p>{profile.title}</p>
        <p className="flex gap-2 items-center">
          <Mail size={15} /> {profile.email}
        </p>
        <p className="flex gap-2 items-center">
          <Phone size={15} /> {profile.phone}
        </p>
        <a
          className="flex gap-2 items-center text-fb-blue"
          href={profile.portfolioUrl}
          target="_blank"
        >
          <LinkIcon size={15} /> {profile.portfolioLabel}
        </a>
        <p className="flex gap-2 items-center">
          <MapPin size={15} /> {profile.location}
        </p>
      </div>
    </div>
  );
}

export function ExperienceCard() {
  return (
    <InfoCard title="Experience" Icon={BriefcaseBusiness}>
      {experience.map((item) => (
        <Item key={item.title} {...item} />
      ))}
    </InfoCard>
  );
}

export function EducationCard() {
  return (
    <InfoCard title="Education" Icon={GraduationCap}>
      {education.map((item) => (
        <Item key={item.title} {...item} />
      ))}
    </InfoCard>
  );
}

function InfoCard({ title, Icon, children }) {
  return (
    <div className="bg-white rounded-lg p-3">
      <h2 className="font-poppins font-bold text-xl flex gap-2 items-center mb-3">
        <Icon size={21} /> {title}
      </h2>
      {children}
    </div>
  );
}

function Item({ title, meta, lines }) {
  return (
    <div className="mb-4 last:mb-0">
      <h3 className="font-poppins font-semibold text-[15px] leading-snug">
        {title}
      </h3>
      <p className="text-[13px] text-text-secondary mt-0.5">{meta}</p>
      <ul className="list-disc ml-5 mt-2 text-sm text-text-secondary space-y-1">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
