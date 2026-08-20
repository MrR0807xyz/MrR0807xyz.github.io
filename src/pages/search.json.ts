import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts');
  const cheatsheets = await getCollection('cheatsheets');

  const postItems = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    url: `/posts/${post.slug}`,
    pubDate: post.data.pubDate,
    categories: post.data.categories,
    tags: post.data.tags,
    type: 'writeup',
  }));

  const cheatsheetItems = cheatsheets.map((cs) => ({
    title: cs.data.title,
    description: cs.data.description,
    url: `/cheatsheet/${cs.slug}`,
    pubDate: cs.data.pubDate,
    categories: ['Cheatsheet'],
    tags: cs.data.tags,
    type: 'cheatsheet',
  }));

  const allItems = [...postItems, ...cheatsheetItems];

  return new Response(JSON.stringify(allItems), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
