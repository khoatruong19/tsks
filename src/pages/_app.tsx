import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import "react-calendar/dist/Calendar.css";
import 'react-toastify/dist/ReactToastify.min.css';
import { useEffect } from "react";
import { useAtom } from "jotai";
import { themeMode } from "../store";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [_, setAtom] = useAtom(themeMode)
  useEffect(() => {
    if(!localStorage.getItem('theme')) localStorage.setItem('theme', 'light')
    else{
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
        setAtom('dark')
      } else {
        document.documentElement.classList.remove('dark')
        setAtom('light')
      }
    }
  }, [])
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="colored"
      />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
