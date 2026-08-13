import { Download, Mail, Phone } from "lucide-react";
export default function ProfileHeader() {
  const download = () => {
    const blob = new Blob(
      [
        "Carl Salido Madrigal\nFull-Stack Developer\ncarlsalido.madrigal@gmail.com",
      ],
      { type: "text/plain" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Carl-Salido-Madrigal-CV.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section className="bg-white border-b border-divider">
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
        <button
          onClick={download}
          className="pressable mt-4 inline-flex items-center gap-2 rounded-lg bg-fb-blue hover:bg-fb-blue-pressed text-white px-5 py-2.5 text-[17px] font-semibold"
        >
          <Download size={18} /> Download CV
        </button>
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
