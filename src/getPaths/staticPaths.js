import * as fs from "fs";
import { webUrl } from "../config";

const staticPaths = fs
  .readdirSync("pages")
  .filter((staticPage) => {
    return ![
      "api",
      "_app.js",
      "_document.js",
      "404.js",
      "sitemap.xml.js",
    ].includes(staticPage);
  })
  .filter((staticPagePath) => staticPagePath.includes(".js"))
  .map((staticPagePath) => {
    const path = staticPagePath.replace(".js", "");
    const route = webUrl + `${path === "index" ? "" : "/" + path}`;
    return route;
  });

export default staticPaths;
