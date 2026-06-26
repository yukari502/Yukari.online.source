import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    date: z.union([z.string(), z.date()]).optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean().optional().default(false),
  })
});

export const collections = {
  'posts': postsCollection,
};
