export default function LoadingState() {
  return (
    <section>
      <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold hindi-text">कुंडली तैयार की जा रही है...</h3>
              <p className="text-muted-foreground hindi-text">कृपया प्रतीक्षा करें, आपकी व्यक्तिगत कुंडली बनाई जा रही है।</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="loading-skeleton h-4 rounded w-3/4"></div>
            <div className="loading-skeleton h-4 rounded w-full"></div>
            <div className="loading-skeleton h-4 rounded w-5/6"></div>
            <div className="space-y-2">
              <div className="loading-skeleton h-6 rounded w-1/2"></div>
              <div className="loading-skeleton h-3 rounded w-full"></div>
              <div className="loading-skeleton h-3 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
