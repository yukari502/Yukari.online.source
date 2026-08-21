import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

const cleanMarkdown = (value: string) => value
  .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]+>/g, ' ')
  .replace(/^[#>*+-]+\s*/gm, '')
  .replace(/[`_*~|]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');
  const records = posts
    .filter((post) => !post.data.draft)
    .map((post) => {
      const body = 'body' in post && typeof post.body === 'string' ? post.body : '';

      return {
        url: `/posts/${post.id}`,
        title: post.data.title || post.id,
        summary: post.data.summary || post.data.description || '',
        categories: post.data.categories || [],
        tags: post.data.tags || [],
        content: cleanMarkdown(body),
      };
    });

  return new Response(JSON.stringify(records), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
