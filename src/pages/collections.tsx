import { NextPage } from "next";
import Head from "next/head";
import React from "react";
import MainLayout from "../components/layout/MainLayout";

const Collections: NextPage = () => {
  return (
    <>
      <Head>
        <title>Collections</title>
      </Head>
      <MainLayout>
        <div>Collections</div>
      </MainLayout>
    </>
  );
};

export default Collections;
