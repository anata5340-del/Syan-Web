import AdminHeader from "@/frontend/components/header/adminheader";
import Leftsidebar from "@/frontend/components/sidebar/leftsidebar";
import { useQuizContext } from "@/frontend/contexts/QuizContext";

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  const { isQuizActive } = useQuizContext();

  return (
    <>
      <div className="flex">
        {!isQuizActive && (
          <div className="border-r border-colorgray">
            <Leftsidebar />
          </div>
        )}
        <div className="flex-1 px-10">
          <AdminHeader />
          {children}
        </div>
      </div>
    </>
  );
};
