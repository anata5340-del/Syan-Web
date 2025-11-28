import { userStore } from "@/store/user/user";
import { useRouter } from "next/router";

const Pages = () => {
  const router = useRouter();
  const isAdmin = userStore((state) => state.isAdmin);
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-[#EF6A77]">Oops!</h1>
          <h2 className="text-2xl font-semibold mb-4 text-[#3DA397]">
            Unauthorized Access
          </h2>
          <p className="text-gray-600 mb-6">
            Sorry, you don't have permission to access this page. Please log in
            or contact an administrator if you believe this is an error.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => {
                if (isAdmin) {
                  router.push("/admin");
                } else {
                  router.push("/user");
                }
              }}
              className="w-full bg-[#3DA397] text-white py-2 px-4 rounded-md hover:bg-[#2C7A6E] transition duration-300"
            >
              Go to Homepage
            </button>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-[#EF6A77] text-white py-2 px-4 rounded-md hover:bg-[#D85563] transition duration-300"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pages;
