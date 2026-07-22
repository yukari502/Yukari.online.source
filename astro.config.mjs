// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

function rehypePublicPath() {
  return (tree) => {
    function visitNode(node) {
      if (node && typeof node === 'object') {
        if (node.type === 'element' && node.properties) {
          ['src', 'href', 'poster'].forEach((attr) => {
            if (typeof node.properties[attr] === 'string' && /^\/Public\//i.test(node.properties[attr])) {
              node.properties[attr] = node.properties[attr].replace(/^\/Public/i, '');
            }
          });
        }
        if (Array.isArray(node.children)) {
          node.children.forEach(visitNode);
        }
      }
    }
    visitNode(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://yukari.online',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypePublicPath],
  }
});

