import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getGuestId } from "../lib/guest";

// Site-wide likes and views, tracked in Supabase keyed by guest_id.
// - viewCount: number of unique guest visits (site_views)
// - likeCount: number of guest likes (site_likes)
// - liked: whether the current guest has liked the site (like once)
export function useSiteStats() {
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const guestId = getGuestId();

      // Register this guest's visit (unique per guest; ignore duplicates).
      await supabase
        .from("site_views")
        .upsert({ guest_id: guestId }, { onConflict: "guest_id", ignoreDuplicates: true });

      const [viewsRes, likesRes, myLikeRes] = await Promise.all([
        supabase.from("site_views").select("*", { count: "exact", head: true }),
        supabase.from("site_likes").select("*", { count: "exact", head: true }),
        supabase.from("site_likes").select("id").eq("guest_id", guestId).maybeSingle(),
      ]);

      if (cancelled) return;

      setViewCount(viewsRes.count ?? 0);
      setLikeCount(likesRes.count ?? 0);
      setLiked(Boolean(myLikeRes.data));
      setError(
        viewsRes.error?.message || likesRes.error?.message || myLikeRes.error?.message || null,
      );
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const likeSite = async () => {
    if (liked) return;

    const { error } = await supabase
      .from("site_likes")
      .insert({ guest_id: getGuestId() });

    // Duplicate like (unique guest_id) — silently ignore.
    if (error) return;

    setLiked(true);
    setLikeCount((current) => current + 1);
  };

  return { viewCount, likeCount, liked, loading, error, likeSite };
}
