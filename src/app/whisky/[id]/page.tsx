import { createClient } from '@/lib/supabase/server'
import { Wine, ChevronLeft, Star } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function WhiskyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: whisky } = await supabase
    .from('whiskies')
    .select('*')
    .eq('id', id)
    .single()

  if (!whisky) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles(username)')
    .eq('whisky_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  const avgRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <Link href="/search" className="inline-flex items-center text-gray-600 mb-4 hover:text-gray-900">
        <ChevronLeft size={20} />
        <span>검색으로 돌아가기</span>
      </Link>

      {/* Whisky Info */}
      <div className="bg-white rounded-xl p-6 border mb-6">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Wine className="text-amber-600" size={40} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{whisky.name}</h1>
            {whisky.name_kr && <p className="text-gray-500">{whisky.name_kr}</p>}
            {whisky.distillery && <p className="text-sm text-gray-400 mt-1">{whisky.distillery}</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {whisky.type && <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">{whisky.type}</span>}
          {whisky.region && <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{whisky.region}</span>}
          {whisky.country && <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{whisky.country}</span>}
          {whisky.age && <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{whisky.age}년</span>}
          {whisky.abv && <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{whisky.abv}%</span>}
        </div>

        {avgRating && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <Star className="text-amber-500 fill-amber-500" size={20} />
            <span className="text-xl font-bold">{avgRating}</span>
            <span className="text-gray-400 text-sm">/ 5 ({reviews?.length}개 리뷰)</span>
          </div>
        )}
      </div>

      {/* Write Review Button */}
      <Link
        href={`/review/new?whisky=${id}`}
        className="block w-full py-4 bg-amber-600 text-white text-center font-semibold rounded-xl hover:bg-amber-700 transition-colors mb-6"
      >
        리뷰 작성하기
      </Link>

      {/* Reviews */}
      <h2 className="text-lg font-bold mb-4">리뷰 ({reviews?.length || 0})</h2>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{review.profiles?.username || '익명'}</span>
                <div className="flex items-center gap-1">
                  <Star className="text-amber-500 fill-amber-500" size={16} />
                  <span className="font-semibold">{review.rating?.toFixed(1)}</span>
                </div>
              </div>
              {review.nose && <p className="text-sm text-gray-600"><strong>Nose:</strong> {review.nose}</p>}
              {review.palate && <p className="text-sm text-gray-600"><strong>Palate:</strong> {review.palate}</p>}
              {review.finish && <p className="text-sm text-gray-600"><strong>Finish:</strong> {review.finish}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-8">아직 리뷰가 없습니다</p>
      )}
    </div>
  )
}
