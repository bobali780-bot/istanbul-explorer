interface Params { slug: string }
export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  return (
    <main className="mx-auto max-w-6xl px-5 py-28">
      <h1 className="text-3xl font-extrabold">Category: {decodeURIComponent(slug)}</h1>
      <p className="mt-2 text-slate-600">Listing grid will go here.</p>
    </main>
  )
}
