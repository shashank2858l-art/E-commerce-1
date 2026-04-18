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
                <Link
                  href={deal.link}
                  className="group block glass rounded-3xl overflow-hidden border border-white/10 hover:border-accent-orange/40 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_80%,rgba(255,149,0,0.8),transparent_70%)]" />

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-accent-orange to-transparent" />

                  {/* Image */}
                  <div className="relative w-full aspect-square bg-surface-high/50 overflow-hidden">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {/* Price badge */}
                    <div className="absolute bottom-4 right-4 glass px-4 py-2 rounded-xl border border-white/20 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      <span className="font-heading font-black text-lg text-neon-green drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]">
                        {deal.price}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 flex items-center justify-between">
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-neon-green transition-colors duration-300">
                      {deal.title}
                    </h3>
                    <span className="text-sm font-heading font-bold uppercase tracking-wider text-accent-orange group-hover:translate-x-1 transition-transform duration-300">
                      View →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
