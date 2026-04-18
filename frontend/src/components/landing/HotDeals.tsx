'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Deal {
  id: string;
  title: string;
  price: string;
  image: string;
  link: string;
}

export default function HotDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hot-deals')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setDeals(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-[500px] bg-accent-orange/5 blur-[150px] pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-heading font-semibold tracking-[4px] uppercase text-white mb-4 px-4 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-orange" />
            </span>
            Hot Deals
          </span>
          <h2 className="font-heading text-4xl lg:text-6xl font-bold mt-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            Today&apos;s{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-neon-green">
              Top Picks
            </span>
          </h2>
          <p className="text-muted-dim mt-4 max-w-2xl mx-auto text-lg">
            Handpicked deals on pre-loved items — grab them before they&apos;re gone.
          </p>
        </motion.div>

        {/* Deal Cards */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass rounded-3xl h-[420px] animate-pulse border border-white/10"
              />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {deals.map((deal, i) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 100 }}
              >
                <div style={{ perspective: '1200px' }} className="h-[420px]">
                  <Link
                    href={deal.link}
                    className="group block relative w-full h-full transform-style-3d"
                  >
                    {/* Background Card that tilts backwards */}
                    <div className="absolute inset-x-0 bottom-0 top-16 glass rounded-3xl border border-white/10 group-hover:border-accent-orange/40 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_10px_40px_rgba(0,0,0,0.5)] group-hover:[transform:rotateX(20deg)] group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] origin-bottom overflow-hidden">
                      {/* Hover glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(255,149,0,1),transparent_70%)]" />
                      
                      {/* Top accent line */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-accent-orange to-transparent" />

                      {/* Info (kept inside the tilted card) */}
                      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-heading text-lg font-bold text-white group-hover:text-neon-green transition-colors duration-300">
                            {deal.title}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-black text-2xl text-neon-green drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]">
                            {deal.price}
                          </span>
                          <span className="text-sm font-heading font-bold uppercase tracking-wider text-accent-orange group-hover:translate-x-1 transition-transform duration-300">
                            View →
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Popping Image Foreground (overlaps the card top) */}
                    <div className="absolute inset-x-4 bottom-[80px] top-0 z-20 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-8 group-hover:scale-[1.25] drop-shadow-[0_15px_15px_rgba(0,0,0,0.7)] group-hover:drop-shadow-[0_40px_40px_rgba(0,0,0,0.9)] opacity-90 group-hover:opacity-100">
                      <Image
                        src={deal.image}
                        alt={deal.title}
                        fill
                        className="object-contain object-bottom mix-blend-screen"
                      />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
