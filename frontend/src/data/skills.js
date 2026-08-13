import {
  MdWeb,
  MdDns,
  MdLayers,
  MdSmartphone,
  MdStorage,
  MdBuild,
} from "react-icons/md";
import {
  SiHtml5,
  SiReact,
  SiCss,
  SiTailwindcss,
  SiJavascript,
  SiNodedotjs,
  SiPhp,
  SiLaravel,
  SiLivewire,
  SiExpress,
  SiFlutter,
  SiDart,
  SiMysql,
  SiMongodb,
  SiSqlite,
  SiSequelize,
  SiMongoose,
  SiGit,
  SiPostman,
  SiAndroidstudio,
  SiVercel,
  SiRender,
  SiDocker,
} from "react-icons/si";

export const skills = [
  [
    "Frontend",
    MdWeb,
    [
      ["ReactJS", SiReact, "Advanced"],
      ["HTML", SiHtml5, "Proficient"],
      ["CSS", SiCss, "Proficient"],
      ["TailwindCSS", SiTailwindcss, "Advanced"],
      ["JavaScript", SiJavascript, "Intermediate"],
    ],
  ],
  [
    "Backend",
    MdDns,
    [
      ["NodeJS", SiNodedotjs, "Intermediate"],
      ["PHP", SiPhp, "Intermediate"],
    ],
  ],
  [
    "Frameworks",
    MdLayers,
    [
      ["Laravel", SiLaravel, "Advanced"],
      ["Livewire", SiLivewire, "Intermediate"],
      ["ExpressJS", SiExpress, "Advanced"],
      ["Flutter", SiFlutter, "Intermediate"],
    ],
  ],
  ["Mobile", MdSmartphone, [["Dart", SiDart, "Intermediate"]]],
  [
    "Database",
    MdStorage,
    [
      ["MySQL", SiMysql, "Advanced"],
      ["MongoDB", SiMongodb, "Intermediate"],
      ["SQLite", SiSqlite, "Basic"],
      ["Sequelize ORM", SiSequelize, "Intermediate"],
      ["Mongoose", SiMongoose, "Intermediate"],
    ],
  ],
  [
    "Tools & Deployment",
    MdBuild,
    [
      ["Git & GitHub", SiGit, "Proficient"],
      ["Postman", SiPostman, "Proficient"],
      ["Docker", SiDocker, "Basic"],
      ["Android Studio", SiAndroidstudio, "Basic"],
      ["Vercel", SiVercel, "Basic"],
      ["Render", SiRender, "Basic"],
    ],
  ],
];
