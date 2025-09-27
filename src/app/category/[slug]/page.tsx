interface Params { slug: string }
export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const title = decodeURIComponent(slug)
  return (
    <main className="mx-auto max-w-6xl px-5 py-28">
      <h1 className="text-3xl font-extrabold capitalize">{title.replace(/-/g, ' ')}</h1>
      <p className="mt-2 text-slate-600">Discover the best {title.replace(/-/g, ' ')} in Istanbul.</p>

      {/* Listing grid placeholder */}
      <section className="mt-6">
        <p className="text-slate-600">Listing grid will go here.</p>
      </section>
    </main>
  )
}
