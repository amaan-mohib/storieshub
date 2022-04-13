// import * as fs from "fs";
import { webUrl } from "../config";

const fileNames = ["browse", "create", "index", "policies", "teams", "terms"];
const staticPaths = fileNames
  .filter((staticPage) => {
    return ![
      "api",
      "_app.js",
      "_document.js",
      "404.js",
      "sitemap.xml.js",
    ].includes(staticPage);
  })
  .map((staticPagePath) => {
    const path = staticPagePath;
    // .replace(".js", "");
    const route = webUrl + `${path === "index" ? "" : "/" + path}`;
    return { route, freq: "yearly" };
  });

export default staticPaths;
