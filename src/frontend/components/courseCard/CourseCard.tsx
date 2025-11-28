import { useRouter } from "next/router";


interface CourseCardProps {
  id: string;
  title: string;
  isQuiz: boolean;
  imageUrl?: string;
  overlayColor: string;
  isAccessible?: boolean;
  totalEnrolled: number;
  duration?: string;
}

export default function CoursesCard({
  id,
  title,
  isQuiz,
  imageUrl,
  overlayColor,
  isAccessible,
  totalEnrolled,
  duration,
}: CourseCardProps) {
  const router = useRouter()
  return (
    <div
    onClick={()=>{
      if(isAccessible){
        router.push(isQuiz ? `/user/quiz/${id}` : `/user/videoCourses/${id}/modules`)
      }
    }}
      className="relative w-full h-48 cursor-pointer rounded-lg overflow-hidden group"
    >
      <img src={imageUrl} className="w-full h-full object-cover" />
      <div
        className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-4 hover:brightness-150"
        style={{ backgroundColor: overlayColor, mixBlendMode: "hard-light" }}
      >
        <div className="flex justify-end">
          <div className="w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isAccessible ? (
              <img src="/assets/img/icon37.png" />
            ) : (
              <img src="/assets/img/icon38.png" />
            )}
          </div>
        </div>
        <div className="text-center">
          <span className="text-white text-3xl font-bold">{title}</span>
        </div>
        <div className="flex justify-center items-center gap-x-5 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-x-2">
            <img src="/assets/img/icon39.png" />
            {totalEnrolled}
          </div>
          <div className="flex items-center gap-x-2">
            <img src="/assets/img/icon40.png" />
            {duration}
          </div>
        </div>
      </div>
    </div>
  );
}
