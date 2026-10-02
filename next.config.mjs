import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-mdx-frontmatter"],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  agentRules: false,
};

export default withMDX(nextConfig);
