import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import Link from "next/link";
import Image from "next/image";
import { userStore } from "@/store/user/user";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const adminItems: MenuItem[] = [
  getItem(
    <Link href={"/admin"}>Overview</Link>,
    "Overview",
    <Image src="/assets/img/icon1.png" width={20} height={20} alt="" />
  ),
  getItem(
    <Link href="/admin/library">Library </Link>,
    "Library",
    <Image src="/assets/img/icon26.png" width={20} height={20} alt="" />
  ),
  getItem(
    <Link href="/admin/users">Users </Link>,
    "Users",
    <Image
      src="/assets/img/icon5.png"
      width={20}
      height={20}
      style={{
        filter: "brightness(0) invert(0.2)", // This will make the image white
      }}
      alt=""
    />
  ),
  getItem(
    <Link href="/admin/videoCourses">Video</Link>,
    "Video",
    <Image src="/assets/img/icon2.png" width={20} height={20} alt="" />
  ),
  getItem(
    <Link href="/admin/quiz">Quiz </Link>,
    "Quiz",
    <Image src="/assets/img/icon3.png" width={20} height={20} alt="" />
  ),
  getItem(
    <Link href="/admin/packages">Packages </Link>,
    "Packages",
    <Image
      className="bg-transparent"
      src="/assets/img/icon65.png"
      width={20}
      height={20}
      alt=""
    />
  ),
  getItem(
    <Link href={"/admin/settings"}>Settings</Link>,
    "Settings",
    <Image src="/assets/img/icon4.png" width={20} height={20} alt="" />
  ),
];

const userItems: MenuItem[] = [
  getItem(
    <Link href={"/user"}>Overview</Link>,
    "Overview",
    <Image src="/assets/img/icon1.png" width={20} height={20} alt="" />
  ),
  getItem(
    <Link href="/user/videoCourses">Video</Link>,
    "Video",
    <Image src="/assets/img/icon2.png" width={20} height={20} alt="" />
  ),
  getItem(
    <Link href="/user/quiz">Quiz </Link>,
    "Quiz",
    <Image src="/assets/img/icon3.png" width={20} height={20} alt="" />
  ),
  getItem(
    <Link href="/user/favourites">Favourites </Link>,
    "Favourites",
    <Image src="/assets/img/icon46.png" width={20} height={20} alt="" />
  ),
  getItem(
    "Settings",
    "sub2",
    <Image src="/assets/img/icon4.png" width={20} height={20} alt="" />,
    [
      getItem(
        <Link href={"/user/settings/profile"}>Edit Profile</Link>,
        "EditProfile",
        <Image src="/assets/img/icon5.png" width={20} height={20} alt="" />
      ),
      getItem(
        <Link href={"/user/settings/security"}>Security</Link>,
        "Security",
        <Image src="/assets/img/icon6.png" width={20} height={20} alt="" />
      ),
      getItem(
        <Link href={"/user/settings/subscription"}>My Subscription</Link>,
        "Subscription",
        <Image src="/assets/img/icon7.png" width={20} height={20} alt="" />
      ),
      getItem(
        <Link href={"/user/settings/invoice"}>Invoice</Link>,
        "Invoice",
        <Image src="/assets/img/icon8.png" width={20} height={20} alt="" />
      ),
    ]
  ),
];

const App: React.FC = () => {
  const userState = userStore((state) => state);

  if (!userState.user && !userState.admin) {
    return null;
  }

  const filteredAdminItems = userState.admin
    ? adminItems.filter(
        (item) =>
          !userState.admin.excludedModules.includes(item.key as string) &&
          !(userState.admin.role === "subadmin" && item.key === "Overview")
      )
    : [];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={{ background: "#fff" }}>
        <Link href={"/"} className="flex justify-center my-8">
          <Image src="/assets/img/logo.png" height={60} width={150} alt="" />
        </Link>
        <Menu items={userState.admin ? filteredAdminItems : userItems} />
      </Sider>
    </Layout>
  );
};

export default App;
