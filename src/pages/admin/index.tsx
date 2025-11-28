import Dashboard from "@/frontend/modules/admin/dashboard/Dashboard";
import { userStore } from "@/store/user/user";

export default function Pages() {
  const { user } = userStore();
  console.log("user", user);
  return (
    <>
      <Dashboard />
    </>
  );
}
