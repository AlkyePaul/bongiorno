import { JSDOM } from "jsdom";
import DOMPurify from "isomorphic-dompurify";

export function extractBlocks(html) {
  if (!html) return [];

  // 1. Rimuove SOLO i tag shortcode (apertura/chiusura/selfclosing)
  // Esempi: [et_pb_section ...], [/et_pb_row], [et_pb_image ... /]
  const noShortcodes = html
    .replace(/\[\/?et_pb[^\]]*\]/g, " "); 

  // 2. Sanitize (manteniamo solo i tag utili)
  const clean = DOMPurify.sanitize(noShortcodes, {
    ALLOWED_TAGS: [
      "p", "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "a", "img", "strong", "em", "blockquote", "br"
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title"]
  });

  // 3. Parse in DOM
  const dom = new JSDOM(`<body>${clean}</body>`);
  const body = dom.window.document.body;

  const blocks = [];
  body.childNodes.forEach(node => {
    if (node.tagName?.match(/^H[1-6]$/)) {
      blocks.push({
        type: "heading",
        level: parseInt(node.tagName[1]),
        content: node.textContent.trim()
      });
    } else if (node.tagName === "P") {
      const text = node.textContent.trim();
      if (text) {
        blocks.push({ type: "paragraph", content: text });
      }
    } else if (node.tagName === "IMG") {
      blocks.push({
        type: "image",
        src: node.getAttribute("src"),
        alt: node.getAttribute("alt") || ""
      });
    }
  });

  return blocks;
}
