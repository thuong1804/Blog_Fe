const http = require("http");
const fs = require("fs");
const path = require("path");

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const API_URL = "http://localhost:3005/graphql";
const AUTHOR_ID = 10; // Thương Lê (as requested: userID 10)
const CATEGORY_ID = 9; // Python (child of "Programming")
const TAG_IDS = [3, 23, 20, 4]; // Python, Backend, Data Science, AI

// Read the markdown content
const contentFilePath = path.join(__dirname, "python-content.md");
const contentMarkdown = fs.readFileSync(contentFilePath, "utf-8");

const CREATE_POST_MUTATION = `
  mutation CreatePost(
    $title: String!
    $description: String!
    $excerpt: String
    $image: String!
    $categoryId: Int!
    $content: String!
    $authorId: Int!
    $tagIds: [Int!]!
  ) {
    createPost(
      title: $title
      description: $description
      excerpt: $excerpt
      image: $image
      content: $content
      categoryId: $categoryId
      authorId: $authorId
      tagIds: $tagIds
    ) {
      id
      title
      slug
      description
      excerpt
      image
      tags { id name }
      category { 
        id 
        name 
        slug
        parent { id name slug }
      }
      author { id name handle email }
    }
  }
`;

const variables = {
  title: "Mastering Python for Modern Software Development",
  description:
    "Master modern Python development with practical insights into type annotations, async/await, FastAPI architecture, dependency management, and production-ready best practices.",
  excerpt:
    "An in-depth guide exploring modern Python techniques — from clean syntax and asynchronous programming to building high-performance APIs and scalable architectures.",
  image:
    "https://res.cloudinary.com/deq5l7fn1/image/upload/v1750234769/python-la-gi-1_cibk9b.jpg",
  categoryId: CATEGORY_ID,
  content: contentMarkdown,
  authorId: AUTHOR_ID,
  tagIds: TAG_IDS,
};

function sendGraphQL(query, vars) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables: vars });
    const url = new URL(API_URL);

    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error("Invalid JSON: " + data));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  console.log("Creating new Python post via GraphQL API for userID:", AUTHOR_ID);

  try {
    const result = await sendGraphQL(CREATE_POST_MUTATION, variables);

    if (result.errors) {
      console.error("GraphQL Errors:", JSON.stringify(result.errors, null, 2));
      process.exit(1);
    }

    const post = result.data?.createPost;
    if (!post) {
      console.error("No post data returned:", result);
      process.exit(1);
    }

    console.log("\n=================================");
    console.log("🎉 Post Created Successfully!");
    console.log("=================================");
    console.log(`ID       : ${post.id}`);
    console.log(`Title    : ${post.title}`);
    console.log(`Slug     : ${post.slug}`);
    console.log(`Author   : ${post.author?.name} (ID: ${post.author?.id}, handle: ${post.author?.handle})`);
    console.log(`Category : ${post.category?.name} (Parent: ${post.category?.parent?.name})`);
    console.log(`Tags     : ${post.tags?.map((t) => t.name).join(", ")}`);
    console.log(`Image    : ${post.image}`);
    
    const parentSlug = post.category?.parent?.slug || "programming";
    const childSlug = post.category?.slug || "python";
    console.log(`\nView URL : http://localhost:5000/${parentSlug}/${childSlug}/${post.slug}`);
    console.log(`Direct   : http://localhost:5000/blog/${post.slug}`);
  } catch (error) {
    console.error("Request failed:", error.message);
    process.exit(1);
  }
})();
