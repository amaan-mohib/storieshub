import Head from "next/head";
import React from "react";
import { appName, webUrl } from "../config";

const SEO = ({ description = "", title = "", route = "" }) => {
  description =
    description || "Create and share stories with a team or individually.";
  title = title ? `${title} | ${appName}` : appName;
  let url = route ? `${webUrl}${route}` : webUrl;
  return (
    <Head>
      <meta charSet="utf-8" key="charset" />
      <link rel="icon" href="/favicon.ico" key="icon" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
        key="viewport"
      />
      <meta name="theme-color" content="#fff8e5" key="theme-color" />
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:url" content={url} key="og:url" />
      <meta
        property="og:image"
        content={webUrl + "/apple-touch-icon.png"}
        key="og:image"
      />
      <meta property="og:image:width" content="180" />
      <meta property="og:image:height" content="110" />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />
      <meta property="og:site_name" content={appName} key="og:site_name" />
      <meta property="twitter:card" content={description} key="twitter:card" />
      <meta
        property="twitter:creator"
        content={appName}
        key="twitter:creator"
      />
      <meta property="twitter:title" content={title} key="twitter:title" />
      <meta
        property="twitter:description"
        content={description}
        key="twitter:description"
      />
      <link
        rel="apple-touch-icon"
        href={webUrl + "/android-chrome-192x192.png"}
        key="touch-icon"
      />
      <link rel="manifest" href={webUrl + "/manifest.json"} key="manifest" />
    </Head>
  );
};

export default SEO;
