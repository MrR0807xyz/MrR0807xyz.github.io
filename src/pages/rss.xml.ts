import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_CONFIG } from '../config';

export async function GET(context: any) {
  const posts = await getCollection('posts');
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  return rss({
    title: SITE_CONFIG.title + ' | Cybersecurity Research & Writeups',
    description: SITE_CONFIG.description,
    site: context.site || SITE_CONFIG.siteUrl,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.pubDate),
      description: post.data.description,
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
