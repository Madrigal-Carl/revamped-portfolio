import { projects } from "../data/projects";
import PostCard from "./PostCard";
export default function PostFeed({ postState, setPostState }) {
  return (
    <section className="space-y-2">
      {projects.map((project, i) => (
        <PostCard
          key={project.id}
          project={project}
          number={i}
          postState={postState[project.id]}
          setPostState={(value) => setPostState(project.id, value)}
        />
      ))}
    </section>
  );
}
