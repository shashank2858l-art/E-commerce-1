'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How does the swapping process work?",
    answer: "When you find an item you want to swap, simply send a swap request specifying what you're willing to trade. If the owner accepts, you proceed to exchange items either locally or via post."
  },
  {
    question: "Is there a fee for renting tools?",
    answer: "Rental prices are set by the owners. We charge a minimal platform fee to maintain the service and guarantee secure transactions."
  },
  {
    question: "How is food safety ensured in Food Rescue?",
    answer: "All donors must abide by local food safety regulations. Consumers are advised to inspect items upon pickup. Only verified businesses and individuals can post rescued food."
  },
  {
    question: "What are Eco Points?",
    answer: "You earn Eco Points for every transaction that saves carbon emissions. These points can be used for discounts on future purchases or to boost your listings."
  }
];

export default function FAQHelpline() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="border-t border-white/5 bg-surface-low/50 py-16 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="section-container">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
          
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-3xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-muted mb-8">Everything you need to know about Reuse_Mart.</p>
            
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-white/10 rounded-xl bg-surface-high/30 overflow-hidden">
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors focus:outline-none text-left"
                  >
                    <span className="font-heading font-semibold text-sm lg:text-base pr-4">{faq.question}</span>
                    <span className={`text-neon-green transition-transform duration-300 flex-shrink-0 ${openIndex === idx ? 'rotate-180' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence>
                    {openIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-4 text-sm text-muted-dim leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Helpline Section */}
          <div className="lg:col-span-1 border border-white/10 rounded-2xl bg-surface-mid p-8 relative overflow-hidden flex flex-col justify-center h-full shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-transparent opacity-50 -z-10" />
            
            <h3 className="font-heading text-2xl font-bold mb-2 text-white flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-green">
                <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Helpline 24/7
            </h3>
            <p className="text-sm text-muted mb-8 leading-relaxed">
              Need immediate assistance or have a question? Our support team is here to help you round the clock.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/5 hover:border-neon-green/30 transition-colors group">
                <div className="bg-neon-green/20 p-2.5 rounded-lg text-neon-green group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-heading font-bold uppercase tracking-widest text-muted-dim mb-1">Phone Support</div>
                  <a href="tel:+917019650179" className="text-white hover:text-neon-green font-medium transition-colors text-lg tracking-wide">
                    +91 70196 50179
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/5 hover:border-neon-green/30 transition-colors group">
                <div className="bg-neon-green/20 p-2.5 rounded-lg text-neon-green group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="truncate">
                  <div className="text-xs font-heading font-bold uppercase tracking-widest text-muted-dim mb-1">Email Support</div>
                  <a href="mailto:shreyas@gmail.com" className="text-white hover:text-neon-green font-medium transition-colors truncate block">
                    shreyas@gmail.com
                  </a>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
