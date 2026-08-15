import { intro } from "../data/profile";
export default function BioCard() {
  return (
    <div className="bg-white rounded-lg p-3">
      <h2 className="font-poppins font-bold text-xl mb-2">Intro</h2>
      <p className="text-sm leading-[1.45] text-text-primary">{intro}</p>
    </div>
  );
}
