export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          안녕하세요! 👋
        </h1>
        <p className="text-gray-600">
          오늘은 어떤 위스키를 마셔볼까요?
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">최근 리뷰</h2>
        <p className="text-gray-500 text-center py-8">
          아직 리뷰가 없습니다.<br />
          첫 번째 위스키를 리뷰해보세요!
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">인기 위스키</h2>
        <p className="text-gray-500 text-center py-8">
          곧 인기 위스키 목록이<br />
          여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
