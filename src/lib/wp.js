const WP_URL = "https://bongiornotrasporti.it/wp-json/wp/v2";

export async function getFirstPage() {
  const res = await fetch(`${WP_URL}/pages?per_page=1&page=5`);
  const data = await res.json();
  return data[0]; // first page only
}

export async function getPages() {
  const res = await fetch(`${WP_URL}/pages?per_page=100`);
  return res.json();
}

export async function getPageBySlug(slug) {
  const res = await fetch(`${WP_URL}/pages?slug=${slug}`);
  const data = await res.json();
  return data[0];
}

export async function getPosts() {
  const res = await fetch(`${WP_URL}/posts?per_page=100`);
  return res.json();
}
