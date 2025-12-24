import ReactMarkdown from 'react-markdown';

export default function Intro({ children }) {
  const textArray = Array.isArray(children) ? children : [children];
  return (
    <section className="mx-auto text-justify space-y-4 prose prose-neutral intro-section">
      {textArray.map((block, i) => (
        <ReactMarkdown key={i}>{block}</ReactMarkdown>
      ))}
    </section>
  );
}
