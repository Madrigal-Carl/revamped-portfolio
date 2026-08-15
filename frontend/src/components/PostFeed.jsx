import PostCard from "./PostCard";

function FeedSkeleton() {
  return (
    <section className="space-y-2">
      {[1, 2, 3].map((n) => (
        <div key={n} className="bg-white rounded-lg overflow-hidden">
          <div className="p-3 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-canvas animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-32 bg-canvas rounded animate-pulse" />
              <div className="h-3 w-48 bg-canvas rounded animate-pulse" />
            </div>
          </div>
          <div className="px-3 pb-3 space-y-2">
            <div className="h-3 w-11/12 bg-canvas rounded animate-pulse" />
            <div className="h-3 w-8/12 bg-canvas rounded animate-pulse" />
            <div className="h-3 w-10/12 bg-canvas rounded animate-pulse" />
          </div>
          <div className="aspect-16/10 bg-canvas animate-pulse" />
        </div>
      ))}
    </section>
  );
}

export default function PostFeed({ projects, likedIds, onLike, onAddComment, loading, error }) {
  if (loading) return <FeedSkeleton />;

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 text-sm text-text-secondary">
        Couldn't load projects: {error}
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="bg-white rounded-lg p-4 text-sm text-text-secondary">
        No projects yet.
      </div>
    );
  }

  return (
    <section className="space-y-2">
      {projects.map((project) => (
        <PostCard
          key={project.id}
          project={project}
          liked={likedIds.includes(project.id)}
          onLike={onLike}
          onAddComment={onAddComment}
        />
      ))}
    </section>
  );
}
