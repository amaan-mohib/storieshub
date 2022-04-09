import Head from "next/head";
import React from "react";
import { appName } from "../config";

const SEO = ({ description = "", title = "" }) => {
  description =
    description || "Create and share stories with a team or individually.";
  title = title ? `${title} - ${appName}` : appName;
  return (
    <Head>
      <meta name="theme-color" content="#fff8e5" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:url" content="https://storieshub.web.app/" />
      <meta property="og:image" content="/apple-touch-icon.png" />
      <meta property="og:image:width" content="180" />
      <meta property="og:image:height" content="110" />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={appName} />
      <meta property="twitter:card" content={description} />
      <meta property="twitter:creator" content={appName} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <link rel="apple-touch-icon" href="/android-chrome-192x192.png" />
    </Head>
  );
};

export default SEO;
