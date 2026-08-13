import {
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
  Link as LinkIcon,
  Mail,
  Phone,
} from "lucide-react";
export function ContactCard() {
  return (
    <div className="bg-white rounded-lg p-3">
      <h2 className="font-poppins font-bold text-xl mb-3">Details</h2>
      <div className="space-y-2 text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">Carl Salido Madrigal</p>
        <p>Full-Stack Developer</p>
        <p className="flex gap-2 items-center">
          <Mail size={15} /> carlsalido.madrigal@gmail.com
        </p>
        <p className="flex gap-2 items-center">
          <Phone size={15} /> 0964 178 7140
        </p>
        <a
          className="flex gap-2 items-center text-fb-blue"
          href="https://portfolio-tan.vercel.app"
          target="_blank"
        >
          <LinkIcon size={15} /> portfolio-tan.vercel.app
        </a>
        <p className="flex gap-2 items-center">
          <MapPin size={15} /> Marinduque, PH
        </p>
      </div>
    </div>
  );
}
export function ExperienceCard() {
  return (
    <InfoCard title="Experience" Icon={BriefcaseBusiness}>
      <Item
        title="Freelance Full Stack Developer"
        meta="Self-Employed, Marinduque · Jan 2024 – Present"
        lines={[
          "Delivered web and mobile applications using Laravel, React.js, Flutter, and MySQL.",
          "Designed and optimized database structures and RESTful APIs.",
          "Collaborated with clients on requirements gathering, prototyping, testing, and deployment.",
        ]}
      />
      <Item
        title="OJT Intern / Full Stack Developer"
        meta="Informatics College, Recto, Manila · Jan 2026 – April 2026"
        lines={[
          "Led a student team in developing two web applications and two Power Automate solutions.",
          "Contributed to frontend, backend, testing, and deployment throughout the development lifecycle.",
          "Coordinated project execution to ensure timely and successful delivery.",
        ]}
      />
    </InfoCard>
  );
}
export function EducationCard() {
  return (
    <InfoCard title="Education" Icon={GraduationCap}>
      <Item
        title="Bachelor of Science in Information Technology, Major in Software Development"
        meta="Marinduque State University — Cum Laude"
        lines={["2022 – 2026"]}
      />
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
