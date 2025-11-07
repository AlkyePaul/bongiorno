export default function PostMeta({ author, date, category }) {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 text-base text-gray-500">
            <span>✍️ <strong>da {author}</strong></span>
            <span>📅 {date}</span>
            <span>📂 {category}</span>
        </div>
    )
}