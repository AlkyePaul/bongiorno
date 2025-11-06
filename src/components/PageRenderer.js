export default function PageRenderer({ blocks, variables }) {
  return (
    <>
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          const Tag = `h${block.level}`;
          return <Tag key={idx}>{replaceVars(block.content, variables)}</Tag>;
        }
        if (block.type === "paragraph") {
          return <p key={idx}>{replaceVars(block.content, variables)}</p>;
        }
        if (block.type === "image") {
          return (
            <img
              key={idx}
              src={block.src}
              alt={block.alt}
              style={{ maxWidth: "100%" }}
            />
          );
        }
        return null;
      })}
    </>
  );
}

function replaceVars(text, variables) {
  return text.replace(/\{(\w+)\}/g, (_, name) => variables[name] || "");
}
