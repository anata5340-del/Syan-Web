import { Section as SectionType } from "@/backend/types";

type Section = SectionType & { _id: string };
interface Props {
  section: Section;
  selectedSectionId: string;
  setSelectedSection: (section: Section) => void;
}

const SectionCard = ({
  section,
  setSelectedSection,
  selectedSectionId,
}: Props) => {
  const { name, color, subSections } = section;
  return (
    <div
      onClick={() => setSelectedSection(section)}
      className="w-2/6 h-28 cursor-pointer"
    >
      <div
        style={{
          backgroundColor: color,
          border: section?._id === selectedSectionId ? "2px solid #01B067" : "",
        }}
        className=" rounded-xl h-28 flex flex-col justify-center items-center text-[#3E3E3E]"
      >
        <h2 className="text-2xl font-semibold">{name}</h2>
        <p>Topic: {subSections.length}</p>
      </div>
    </div>
  );
};

export default SectionCard;
