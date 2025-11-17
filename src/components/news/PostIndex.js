export default function PostIndex({ indice, index }) {
  if (!indice || !Array.isArray(indice)) return null;

  return (
    <nav className=" pt-8 md:pt-12">
      <h2 className="text-2xl font-semibold mb-3 text-white">{index}</h2>
      <ul className="space-y-2">
        {indice.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-white hover:text-brand-accent transition-colors"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
