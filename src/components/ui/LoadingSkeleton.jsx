import React from 'react';

const Skeleton = ({ className, isDark }) => (
  <div className={`animate-pulse rounded-xl ${isDark ? 'bg-white/10' : 'bg-black/5'} ${className}`} />
);

const LoadingSkeleton = ({ isDark }) => {
  return (
    <div className={`min-h-screen pb-20 font-sans transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-[#f4f4f4]'}`}>
      
      {/* 1. Navbar Skeleton */}
      <div className={`sticky top-0 z-50 border-b px-6 py-4 flex justify-between items-center ${isDark ? 'bg-black/60 border-white/5' : 'bg-white/70 border-gray-200/50'}`}>
        <div className="flex items-center gap-3">
           <Skeleton isDark={isDark} className="w-10 h-10 rounded-full" />
           <div className="space-y-2">
             <Skeleton isDark={isDark} className="w-24 h-4" />
             <Skeleton isDark={isDark} className="w-16 h-3" />
           </div>
        </div>
        <div className="flex gap-2">
           <Skeleton isDark={isDark} className="w-12 h-8 rounded-full" />
           <Skeleton isDark={isDark} className="w-8 h-8 rounded-full" />
        </div>
      </div>

      {/* 2. Search Skeleton */}
      <div className="pt-6 px-6">
        <Skeleton isDark={isDark} className="w-full max-w-md mx-auto h-12 rounded-2xl" />
      </div>

      {/* 3. Category Pills Skeleton */}
      <div className="mt-6 px-4 flex gap-3 overflow-hidden">
         {[1,2,3,4,5].map(i => (
           <Skeleton key={i} isDark={isDark} className="w-24 h-10 rounded-xl shrink-0" />
         ))}
      </div>

      {/* 4. Menu Items Grid Skeleton */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {[1,2,3,4,5,6].map(i => (
           <div key={i}>
              <Skeleton isDark={isDark} className="w-full h-[220px] rounded-[24px] mb-4" />
              <div className="space-y-3 px-1">
                 <div className="flex justify-between">
                    <Skeleton isDark={isDark} className="w-32 h-6" />
                    <Skeleton isDark={isDark} className="w-16 h-6" />
                 </div>
                 <Skeleton isDark={isDark} className="w-full h-4" />
                 <Skeleton isDark={isDark} className="w-2/3 h-4" />
              </div>
           </div>
         ))}
      </div>

    </div>
  );
};

export default LoadingSkeleton;