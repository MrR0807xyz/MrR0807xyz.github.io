import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(''),
    pubDate: z.string().or(z.date()).transform((val) => typeof val === 'string' ? val : val.toISOString().split('T')[0]),
    updatedDate: z.string().optional(),
    author: z.string().default('MrR0807'),
    categories: z.array(z.string()).default(['Security']),
    tags: z.array(z.string()).default([]),
    pin: z.boolean().default(false),
    image: z.string().optional(),
    bounty: z.string().optional(),
    cve: z.string().optional(),
    cvss: z.string().optional(),
    severity: z.enum(['Critical', 'High', 'Medium', 'Low', 'Info']).optional(),
  }),
});

const cheatsheetsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(''),
    category: z.string().default('Cheatsheet'),
    pubDate: z.string().optional().default('2024-01-10'),
    tags: z.array(z.string()).default(['cheatsheet']),
  }),
});

export const collections = {
  posts: postsCollection,
  cheatsheets: cheatsheetsCollection,
};
