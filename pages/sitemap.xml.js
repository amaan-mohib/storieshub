import dynamicPaths from "../src/getPaths/dynamicPaths";
import staticPaths from "../src/getPaths/staticPaths";

const Sitemap = () => {
  return null;
};

export const getServerSideProps = async ({ res }) => {
  const { bookDynamicPaths, profileDynamicPaths } = await dynamicPaths();
  const allPaths = [
    ...staticPaths,
    ...bookDynamicPaths,
    ...profileDynamicPaths,
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPaths
        .map((url) => {
          return `
          <url>
          <loc>${url.route}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>${url.freq}</changefreq>
          <priority>1.0</priority>
          </url>
          `;
        })
        .join("")}
    </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
