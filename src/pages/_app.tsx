import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Poppins } from "next/font/google";
import { BaseLayout } from "@/frontend/components/layout/base";
import { Toaster } from "react-hot-toast";
import Cookies from "cookies";
import { useEffect, useState } from "react";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const [token, setToken] = useState<string | null>(null)
  useEffect(()=>{
    
  },[])
  return (
    <div className={poppins.className}>
      <AntdRegistry>
        <BaseLayout>
          <Toaster />
          <Component {...pageProps} />
        </BaseLayout>
      </AntdRegistry>
    </div>
  );
}
