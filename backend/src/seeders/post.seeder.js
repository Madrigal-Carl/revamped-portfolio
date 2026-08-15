import "../config/env.js";
import { supabase } from "../config/supabase.js";

// Seed data mirroring the projects shown in the frontend feed.
const seedProjects = [
  {
    title: "AgriCentral – Agricultural Resource Management Platform",
    description:
      "A centralized platform for managing farmers, farms, crops, livestock, and equipment, with resource requests, incident reporting, and real-time analytics.",
    features: [
      "Centralized management of farmers, farms, crops, livestock, and equipment",
      "Resource requests, incident reporting, and exportable reports",
      "Real-time analytics, audit trails, and centralized data",
    ],
    tech_stack: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "TanStack Query",
      "Tailwind CSS",
    ],
    image_urls: [
      "https://picsum.photos/seed/agricentral1/800/500",
      "https://picsum.photos/seed/agricentral2/800/500",
      "https://picsum.photos/seed/agricentral3/800/500",
      "https://picsum.photos/seed/agricentral4/800/500",
      "https://picsum.photos/seed/agricentral5/800/500",
    ],
    project_url: "https://portfolio-tan.vercel.app",
    repo_url: null,
  },
  {
    title: "SwiftDocs – Online Document Request System",
    description:
      "A centralized platform for student document requests, tracking, and reporting, helping staff prioritize pending requests.",
    features: [
      "Student document requests, tracking, and reporting",
      "Prioritized request monitoring for staff",
      "Request visibility and status tracking for students and administrators",
    ],
    tech_stack: [
      "React",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Sequelize ORM",
      "MySQL",
      "Docker",
    ],
    image_urls: [
      "https://picsum.photos/seed/swiftdocs1/800/500",
      "https://picsum.photos/seed/swiftdocs2/800/500",
      "https://picsum.photos/seed/swiftdocs3/800/500",
    ],
    project_url: "https://github.com",
    repo_url: "https://github.com",
  },
  {
    title: "Tableo – Event Tabulation System",
    description:
      "A digital judging and tabulation system for events and competitions with automated scoring and ranking.",
    features: [
      "Digital judging and tabulation for events and competitions",
      "Automated score computation and ranking generation",
      "Elimination-stage calculations with reduced human error",
    ],
    tech_stack: [
      "React.js",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "Sequelize ORM",
      "MySQL",
    ],
    image_urls: [
      "https://picsum.photos/seed/tableo1/800/500",
      "https://picsum.photos/seed/tableo2/800/500",
    ],
    project_url: "https://github.com",
    repo_url: "https://github.com",
  },
  {
    title: "S.H.A.P.E. – Learning Management Platform",
    description:
      "A mobile learning platform designed for special needs students with interactive activities and progress tracking.",
    features: [
      "Mobile learning platform for special needs students",
      "Interactive learning activities",
      "Progress tracking and student engagement",
    ],
    tech_stack: ["Flutter", "Laravel", "Livewire", "Tailwind CSS", "MySQL"],
    image_urls: ["https://picsum.photos/seed/shape1/800/500"],
    project_url: "https://github.com",
    repo_url: "https://github.com",
  },
  {
    title: "CHL SmartSolutions – Inventory & E-Commerce System",
    description:
      "An inventory management and e-commerce system with low-stock monitoring and automated alerts.",
    features: [
      "Inventory management and e-commerce functionalities",
      "Low-stock monitoring and automated alerts",
      "Optimized inventory visibility and task tracking",
    ],
    tech_stack: ["Laravel", "Livewire", "Tailwind CSS", "MySQL"],
    image_urls: [
      "https://picsum.photos/seed/chlsmart1/800/500",
      "https://picsum.photos/seed/chlsmart2/800/500",
      "https://picsum.photos/seed/chlsmart3/800/500",
      "https://picsum.photos/seed/chlsmart4/800/500",
    ],
    project_url: "https://github.com",
    repo_url: "https://github.com",
  },
];

const run = async () => {
  const { count, error: countError } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  if (countError) throw countError;

  if (count > 0) {
    console.log(`Projects table already has ${count} row(s). Skipping seed.`);
    return;
  }

  const { data, error } = await supabase
    .from("projects")
    .insert(seedProjects)
    .select("id, title");

  if (error) throw error;

  console.log(`Seeded ${data.length} projects:`);
  data.forEach((project) => console.log(`  - ${project.title}`));
};

run().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
