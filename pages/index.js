import * as fs from "fs";
import Head from "next/head";
import Link from "next/link";
import matter from "gray-matter";

export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>1984.pro</title>
        <meta name="description" content="1984.pro" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-4">
        <h1 className="text-4xl font-bold mb-4">1984.pro</h1>
        <div className="post-container">
          <ul className="flex list-disc px-4">
            {posts.map(({ slug, frontmatter }) => (
              <li key={slug}>
                <Link href={`/p/${slug}`}>
                  <a className="hover:underline text-blue-700	text-1xl font-bold">
                    {frontmatter.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  // Get all our posts
  const files = fs.readdirSync("posts");
  const posts = files.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const readFile = fs.readFileSync(`posts/${fileName}`, "utf-8");
    const { data: frontmatter } = matter(readFile);

    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      posts,
    },
  };
}
