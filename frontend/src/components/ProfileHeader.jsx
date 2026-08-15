import { Heart, Eye, Mail, Phone } from "lucide-react";
export default function ProfileHeader({ visits, likes, liked, onLike, sectionRef }) {
  return (
    <section ref={sectionRef} className="bg-white border-b border-divider">
      <div
        className="h-50 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://picsum.photos/seed/devcover/1600/500)",
        }}
      />
      <div className="px-3 pb-4 text-center">
        <img
          className="w-42 h-42 object-cover rounded-full border-4 border-white mx-auto -mt-21 relative"
          src="https://picsum.photos/seed/carlavatar/300/300"
          alt="Carl Salido Madrigal"
        />
        <h1 className="font-poppins font-bold text-2xl mt-2">
          Carl Salido Madrigal
        </h1>
        <p className="text-[15px] text-text-secondary mt-1">
          Full-Stack Developer | MERN · Laravel · Flutter
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-fb-blue px-3 py-1.5 font-semibold text-white">
            <Eye size={15} /> {visits.toLocaleString()} views
          </span>
          <button
            onClick={onLike}
            className={`pressable inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold ${liked ? "bg-heart-pink text-white" : "bg-white ring-2 ring-inset ring-heart-pink text-heart-pink"}`}
          >
            <Heart size={15} fill={liked ? "currentColor" : "none"} />{" "}
            {liked ? likes + 1 : likes} likes
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-[13px] text-text-secondary">
          <span className="inline-flex items-center gap-1">
            <Mail size={14} /> carlsalido.madrigal@gmail.com
          </span>
          <span className="inline-flex items-center gap-1">
            <Phone size={14} /> 0964 178 7140
          </span>
        </div>
      </div>
    </section>
  );
}
