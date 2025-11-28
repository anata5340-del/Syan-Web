import { SubSection } from "@/backend/types";
import Link from "next/link";

interface Props {
  subSection: SubSection;
  link: string;
}

const SubSectionCard = ({ subSection, link }: Props) => {
  const { name, color, image, topic } = subSection;
  return (
    <Link href={link} className="w-1/4">
      <div
        style={{ backgroundColor: color }}
        className="flex gap-x-3 rounded-xl h-36 pl-4 justify-between"
      >
        <div className="flex flex-col justify-around w-1/2">
          <h2 className="text-black text-2xl font-semibold">{name}</h2>
          <div className="bg-colororange rounded-xl text-center text-white">
            Topic: {topic}
          </div>
        </div>
        <div className="flex items-end p-3">
          {/* <img src={image} alt="image" /> */}
          <img
            src={image}
            alt="image"
            style={{ height: "50px", width: "200px" }}
          />
        </div>
      </div>
    </Link>
  );
};

export default SubSectionCard;
