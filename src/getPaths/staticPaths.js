import * as fs from "fs";
import { webUrl } from "../config";

const dirents = fs.readdirSync(
  {
    development: "pages",
    production: "./",
  }[process.env.NODE_ENV],
  { withFileTypes: true }
);
const fileNames = dirents
  .filter((dirent) => dirent.isFile())
  .map((dirent) => dirent.name);
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
    const path = staticPagePath.replace(".js", "");
    const route = webUrl + `${path === "index" ? "" : "/" + path}`;
    return route;
  });

export default staticPaths;
