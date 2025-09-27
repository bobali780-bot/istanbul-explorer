interface BlogParams { slug: string }
export default async function BlogPostPage({ params }: { params: Promise<BlogParams> }) {
  const { slug } = await params
  return (
    <main className="mx-auto max-w-3xl px-5 py-28">
      <h1 className="text-3xl font-extrabold">{decodeURIComponent(slug)}</h1>
      <article className="prose prose-slate mt-4 max-w-none">
        <p>Post content coming soon.</p>
      </article>
    </main>
  )
}
