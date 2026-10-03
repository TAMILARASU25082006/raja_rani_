'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../App').then((mod) => mod.App), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#F5EBDD] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-[#B58A42] border-t-[#B94738] rounded-full animate-spin" />
      <h2 className="font-serif font-black text-xl text-[#352820] tracking-widest animate-pulse">
        OPENING PALACE GATES...
      </h2>
    </div>
  ),
});

export default function HomePage() {
  return <App />;
}
