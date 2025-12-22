import { Wine, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CellarPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          내 술장 🍷
        </h1>
        <p className="text-gray-600">
          내가 마신 위스키들을 모아보세요
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">내 컬렉션</h2>
        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
          <Plus size={16} className="mr-1" />
          추가
        </Button>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center py-12">
          <Wine size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">
            아직 컬렉션이 비어있습니다
          </p>
          <p className="text-sm text-gray-400">
            첫 번째 위스키를 추가해보세요!
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold mb-3">통계</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-amber-600">0</div>
            <div className="text-sm text-gray-500">총 리뷰</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">0</div>
            <div className="text-sm text-gray-500">평균 평점</div>
          </div>
        </div>
      </div>
    </div>
  );
}
