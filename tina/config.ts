import { defineConfig } from 'tinacms';

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.VITE_TINA_CLIENT_ID || process.env.TINA_CLIENT_ID || '',
  // Get this from tina.io
  token: process.env.TINA_TOKEN || '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'content/blogs',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            options: [
              'Pro Tips & Technique',
              'Game Guides',
              'Lifestyle & Events',
              'Behind The Scenes',
            ],
            required: true,
          },
          {
            type: 'string',
            name: 'excerpt',
            label: 'Excerpt / Summary',
            ui: {
              component: 'textarea',
            },
            required: true,
          },
          {
            type: 'string',
            name: 'readTime',
            label: 'Read Time (e.g. 5 min read)',
          },
          {
            type: 'image',
            name: 'image',
            label: 'Cover Image',
          },
          {
            type: 'boolean',
            name: 'featured',
            label: 'Featured Post',
          },
          {
            type: 'object',
            name: 'author',
            label: 'Author',
            fields: [
              { type: 'string', name: 'name', label: 'Author Name' },
              { type: 'string', name: 'role', label: 'Author Role' },
            ],
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags',
            list: true,
          },
          {
            type: 'string',
            name: 'content',
            label: 'Paragraphs Content',
            list: true,
            ui: {
              component: 'textarea',
            },
          },
        ],
      },
      {
        name: 'product',
        label: 'Products & Store Gear',
        path: 'content/products',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'name',
            label: 'Product Name',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            required: true,
          },
          {
            type: 'number',
            name: 'price',
            label: 'Price (AED)',
            required: true,
          },
          {
            type: 'number',
            name: 'salePrice',
            label: 'Sale Price (AED Optional)',
          },
          {
            type: 'number',
            name: 'quantityInStock',
            label: 'Quantity In Stock',
          },
          {
            type: 'string',
            name: 'stockStatus',
            label: 'Stock Status',
            options: ['In Stock', 'Low Stock', 'Out of Stock'],
          },
          {
            type: 'string',
            name: 'status',
            label: 'Status',
            options: ['Active', 'Inactive'],
          },
          {
            type: 'image',
            name: 'image',
            label: 'Primary Image',
          },
          {
            type: 'image',
            name: 'images',
            label: 'Gallery Images',
            list: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: {
              component: 'textarea',
            },
          },
        ],
      },
    ],
  },
});
