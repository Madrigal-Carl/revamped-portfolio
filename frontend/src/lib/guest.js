// Guest identity: a UUID stored in localStorage, generated once per browser.
// Used to identify the anonymous guest on likes and comments (no Supabase Auth).

const KEY = "portfolio-guest-id";

export const getGuestId = () => {
  let id = localStorage.getItem(KEY);

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }

  return id;
};
