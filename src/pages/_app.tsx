import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import "react-calendar/dist/Calendar.css";
import 'react-toastify/dist/ReactToastify.min.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
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
