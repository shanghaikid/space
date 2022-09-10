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

      <main>
        <h1>1984.pro</h1>
        <div className="post-container">
          {posts.map(({ slug, frontmatter }) => (
            <div
              key={slug}
              className="border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col"
            >
              <Link href={`/p/${slug}`}>
                <a>
                  <h2 className="p-4">{frontmatter.title}</h2>
                </a>
              </Link>
            </div>
          ))}
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
