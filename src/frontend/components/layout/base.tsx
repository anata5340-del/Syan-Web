import AdminHeader from "@/frontend/components/header/adminheader";
import Leftsidebar from "@/frontend/components/sidebar/leftsidebar";

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex">
        <div className="border-r border-colorgray">
          <Leftsidebar />
        </div>
        <div className="flex-1 px-10">
          <AdminHeader />
          {children}
        </div>
      </div>
    </>
  );
};
