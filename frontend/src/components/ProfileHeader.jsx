import { Heart, Eye, Mail, Phone } from "lucide-react";
import { profile } from "../data/profile";
export default function ProfileHeader({ visits, likes, liked, onLike, sectionRef }) {
  return (
    <section ref={sectionRef} className="bg-white border-b border-divider">
      <div
        className="h-50 bg-cover bg-center"
        style={{ backgroundImage: `url(${profile.cover})` }}
      />
      <div className="px-3 pb-4 text-center">
        <img
          className="w-42 h-42 object-cover rounded-full border-4 border-white mx-auto -mt-21 relative"
          src={profile.avatar}
          alt={profile.name}
        />
        <h1 className="font-poppins font-bold text-2xl mt-2">{profile.name}</h1>
        <p className="text-[15px] text-text-secondary mt-1">{profile.title}</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-fb-blue px-3 py-1.5 font-semibold text-white">
            <Eye size={15} /> {visits.toLocaleString()} views
          </span>
          <button
            onClick={onLike}
            className={`pressable inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold ${liked ? "bg-heart-pink text-white" : "bg-white ring-2 ring-inset ring-heart-pink text-heart-pink"}`}
          >
            <Heart size={15} fill={liked ? "currentColor" : "none"} />{" "}
            {likes} likes
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-[13px] text-text-secondary">
          <span className="inline-flex items-center gap-1">
            <Mail size={14} /> {profile.email}
          </span>
          <span className="inline-flex items-center gap-1">
            <Phone size={14} /> {profile.phone}
          </span>
        </div>
      </div>
    </section>
  );
}
