import { Hero } from '@/components/Hero'
import { EditorPicks } from '@/components/EditorPicks'
import { CategoryGrid } from '@/components/CategoryGrid'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <EditorPicks />
      {/* The new section must be directly below Editor's Picks */}
      <CategoryGrid />
    </main>
  )
}
