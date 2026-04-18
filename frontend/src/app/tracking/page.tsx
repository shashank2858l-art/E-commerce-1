'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { supabase } from '@/utils/supabase';
import { useCurrency } from '@/context/CurrencyContext';

const TrackingMap = dynamic(() => import('@/components/tracking/TrackingMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] rounded-2xl glass border border-white/10 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-neon-green border-t-transparent rounded-full" />
    </div>
  )
});

// ═════════════════════════════════════════════════════════════════════════
// GEOCODING: Uses Nominatim (OpenStreetMap) for ACCURATE pin code lookup
// Priority: 1) Pin Code via API  2) City name  3) Address text
// ═════════════════════════════════════════════════════════════════════════

const geocodeCache: Record<string, [number, number]> = {};

// CITY coordinates fallback for when API is unavailable
const CITY_COORDS: Record<string, [number, number]> = {
  'mumbai': [19.0760, 72.8777], 'delhi': [28.7041, 77.1025], 'new delhi': [28.6139, 77.2090],
  'bangalore': [12.9716, 77.5946], 'bengaluru': [12.9716, 77.5946],
  'hyderabad': [17.3850, 78.4867], 'chennai': [13.0827, 80.2707],
  'kolkata': [22.5726, 88.3639], 'pune': [18.5204, 73.8567],
  'ahmedabad': [23.0225, 72.5714], 'jaipur': [26.9124, 75.7873],
  'lucknow': [26.8467, 80.9462], 'kanpur': [26.4499, 80.3319],
  'nagpur': [21.1458, 79.0882], 'indore': [22.7196, 75.8577],
  'bhopal': [23.2599, 77.4126], 'patna': [25.6093, 85.1376],
  'vadodara': [22.3072, 73.1812], 'goa': [15.2993, 74.1240],
  'hubli': [15.3647, 75.1240], 'dharwad': [15.4589, 75.0078], 'dharward': [15.4589, 75.0078],
  'hubli-dharwad': [15.3647, 75.1240], 'hubballi': [15.3647, 75.1240],
  'belgaum': [15.8497, 74.4977], 'belagavi': [15.8497, 74.4977],
  'mangalore': [12.9141, 74.8560], 'mangaluru': [12.9141, 74.8560],
  'mysore': [12.2958, 76.6394], 'mysuru': [12.2958, 76.6394],
  'coimbatore': [11.0168, 76.9558], 'kochi': [9.9312, 76.2673],
  'thiruvananthapuram': [8.5241, 76.9366], 'trivandrum': [8.5241, 76.9366],
  'visakhapatnam': [17.6868, 83.2185], 'vizag': [17.6868, 83.2185],
  'surat': [21.1702, 72.8311], 'rajkot': [22.3039, 70.8022],
  'chandigarh': [30.7333, 76.7794], 'dehradun': [30.3165, 78.0322],
  'shimla': [31.1048, 77.1734], 'guwahati': [26.1445, 91.7362],
  'ranchi': [23.3441, 85.3096], 'bhubaneswar': [20.2961, 85.8245],
  'raipur': [21.2514, 81.6296], 'noida': [28.5355, 77.3910],
  'gurgaon': [28.4595, 77.0266], 'gurugram': [28.4595, 77.0266],
  'faridabad': [28.4089, 77.3178], 'agra': [27.1767, 78.0081],
  'varanasi': [25.3176, 82.9739], 'udaipur': [24.5854, 73.7125],
  'jodhpur': [26.2389, 73.0243], 'kota': [25.2138, 75.8648],
  'nashik': [20.0063, 73.7803], 'aurangabad': [19.8762, 75.3433],
  'thane': [19.2183, 72.9781], 'jabalpur': [23.1815, 79.9864],
  'gwalior': [26.2183, 78.1828], 'vijayawada': [16.5062, 80.6480],
  'tirupati': [13.6288, 79.4192], 'madurai': [9.9252, 78.1198],
  'trichy': [10.7905, 78.7047], 'tiruchirappalli': [10.7905, 78.7047],
  'salem': [11.6643, 78.1460], 'warangal': [17.9784, 79.5941],
  'guntur': [16.3067, 80.4365], 'bikaner': [28.0229, 73.3119],
  'amritsar': [31.6340, 74.8723], 'jalandhar': [31.3260, 75.5762],
  'ludhiana': [30.9010, 75.8573], 'meerut': [28.9845, 77.7064],
  'allahabad': [25.4358, 81.8463], 'prayagraj': [25.4358, 81.8463],
  'bareilly': [28.3670, 79.4304], 'aligarh': [27.8974, 78.0880],
  'moradabad': [28.8386, 78.7733], 'gorakhpur': [26.7606, 83.3732],
  'durgapur': [23.5204, 87.3119], 'asansol': [23.6739, 86.9524],
  'siliguri': [26.7271, 88.3953], 'jamshedpur': [22.8046, 86.2029],
  'cuttack': [20.4625, 85.8830], 'rourkela': [22.2604, 84.8536],
  'gulbarga': [17.3297, 76.8343], 'kalaburagi': [17.3297, 76.8343],
  'bellary': [15.1394, 76.9214], 'ballari': [15.1394, 76.9214],
  'davangere': [14.4644, 75.9218], 'shimoga': [13.9299, 75.5681],
  'tumkur': [13.3379, 77.1173],
};

const INDIA_CENTER: [number, number] = [20.5937, 78.9629];

/**
 * Geocode a pin code or city/address to coordinates.
 * PRIORITY: 1) Pin code (via Nominatim API)  2) City name (offline DB)  3) Address text (via API)
 */
async function geocode(pincode: string, locationText: string): Promise<[number, number]> {
  // ── STEP 1: Try Pin Code (highest priority) ──
  if (pincode && pincode.length >= 5) {
    const cacheKey = `pin_${pincode}`;
    if (geocodeCache[cacheKey]) return geocodeCache[cacheKey];
    
    try {
      // Use Nominatim to geocode the Indian pin code
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        geocodeCache[cacheKey] = coords;
        console.log(`📍 Geocoded PIN ${pincode} → [${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}]`);
        return coords;
      }
    } catch (e) {
      console.warn(`Nominatim PIN lookup failed for ${pincode}:`, e);
    }
  }

  // ── STEP 2: Try City Name match (offline, instant) ──
  if (locationText) {
    const lower = locationText.toLowerCase().trim();
    // Check each city — also check multi-word matches
    for (const [city, coords] of Object.entries(CITY_COORDS)) {
      if (lower.includes(city)) {
        const cacheKey = `city_${city}`;
        geocodeCache[cacheKey] = coords;
        console.log(`📍 Matched city "${city}" → [${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}]`);
        return coords;
      }
    }

    // ── STEP 3: Try full address text via Nominatim ──
    const cacheKey = `addr_${lower}`;
    if (geocodeCache[cacheKey]) return geocodeCache[cacheKey];

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationText + ', India')}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        geocodeCache[cacheKey] = coords;
        console.log(`📍 Geocoded address "${locationText}" → [${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}]`);
        return coords;
      }
    } catch (e) {
      console.warn(`Nominatim address lookup failed for "${locationText}":`, e);
    }
  }

  // ── Fallback: India center ──
  return INDIA_CENTER;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateDeliveryDays(distKm: number): { min: number; max: number; label: string } {
  if (distKm < 50) return { min: 1, max: 2, label: 'Same City' };
  if (distKm < 200) return { min: 2, max: 3, label: 'Nearby Region' };
  if (distKm < 500) return { min: 3, max: 5, label: 'State-level' };
  if (distKm < 1500) return { min: 5, max: 7, label: 'Inter-State' };
  return { min: 7, max: 12, label: 'Cross-Country' };
}

interface OrderItem {
  title: string;
  image?: string;
  imageUrl?: string;
  image_url?: string;
  sellerLocation: string;
  sellerName: string;
  sellerPincode?: string;
  buyerPincode?: string;
  purchasedAt: string;
  pricePaid?: number;
  ownerId?: string;
}

interface MapData {
  sellerCoords: [number, number];
  buyerCoords: [number, number];
  distance: number;
  delivery: { min: number; max: number; label: string };
  sellerPin: string;
  buyerPin: string;
}

export default function TrackingPage() {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerPincode, setBuyerPincode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<number>(0);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || 'guest';
      const pKey = `reuse_mart_purchases_${userId}`;
      const items = JSON.parse(localStorage.getItem(pKey) || '[]');
      setOrders(items);

      if (session?.user?.id) {
        const { data: tx } = await supabase
          .from('transactions')
          .select('buyer_address, buyer_pincode')
          .eq('buyer_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (tx?.buyer_address) setBuyerAddress(tx.buyer_address);
        if (tx?.buyer_pincode) setBuyerPincode(tx.buyer_pincode);
      }
    };
    loadOrders();
  }, []);

  const currentOrder = orders[selectedOrder];

  // Run geocoding when order or buyer info changes
  const doGeocode = useCallback(async () => {
    if (!currentOrder) return;
    setIsGeocoding(true);
    try {
      const sellerPin = currentOrder.sellerPincode || '';
      const bPin = currentOrder.buyerPincode || buyerPincode;

      // Geocode both locations — pin code FIRST, then city, then address
      const [sellerCoords, buyerCoords] = await Promise.all([
        geocode(sellerPin, currentOrder.sellerLocation || ''),
        geocode(bPin, buyerAddress || ''),
      ]);

      const distance = haversineDistance(sellerCoords[0], sellerCoords[1], buyerCoords[0], buyerCoords[1]);
      const delivery = estimateDeliveryDays(distance);

      setMapData({ sellerCoords, buyerCoords, distance, delivery, sellerPin, buyerPin: bPin });
    } catch (e) {
      console.error('Geocoding failed:', e);
    } finally {
      setIsGeocoding(false);
    }
  }, [currentOrder, buyerAddress, buyerPincode]);

  useEffect(() => {
    doGeocode();
  }, [doGeocode]);

  // Progress simulation
  const progressPercent = (() => {
    if (!currentOrder || !mapData) return 0;
    const purchaseDate = new Date(currentOrder.purchasedAt);
    const now = new Date();
    const daysPassed = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.min(100, Math.round((daysPassed / mapData.delivery.max) * 100));
  })();

  const statusSteps = [
    { label: 'Order Placed', icon: '📦', done: progressPercent >= 0 },
    { label: 'Seller Notified', icon: '📨', done: progressPercent >= 15 },
    { label: 'Packed & Shipped', icon: '🚚', done: progressPercent >= 40 },
    { label: 'In Transit', icon: '✈️', done: progressPercent >= 65 },
    { label: 'Out for Delivery', icon: '🏍️', done: progressPercent >= 85 },
    { label: 'Delivered', icon: '✅', done: progressPercent >= 100 },
  ];

  // Google Maps URL using pin codes directly (Google understands Indian pin codes natively)
  const googleMapsUrl = (() => {
    if (!currentOrder || !mapData) return '#';
    const origin = mapData.sellerPin 
      ? `${mapData.sellerPin},India`
      : (currentOrder.sellerLocation ? `${currentOrder.sellerLocation},India` : `${mapData.sellerCoords[0]},${mapData.sellerCoords[1]}`);
    const dest = mapData.buyerPin 
      ? `${mapData.buyerPin},India`
      : (buyerAddress ? `${buyerAddress},India` : `${mapData.buyerCoords[0]},${mapData.buyerCoords[1]}`);
    return `https://www.google.com/maps/dir/${encodeURIComponent(origin)}/${encodeURIComponent(dest)}`;
  })();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">📭</span>
          <h2 className="font-heading text-2xl font-bold mb-2">No Orders Yet</h2>
          <p className="text-muted mb-6">Purchase items from the marketplace to track them here.</p>
          <Link href="/marketplace" className="inline-block px-6 py-3 bg-neon-green text-black rounded-xl font-heading font-bold tracking-widest uppercase">
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-accent-gold/5 rounded-full blur-[150px]" />
      </div>

      <div className="section-container relative z-10">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/dashboard" className="text-muted hover:text-white transition-colors text-sm font-heading tracking-widest uppercase mb-4 inline-flex items-center gap-2">
            ← Back to Dashboard
          </Link>
          <h1 className="font-heading text-3xl md:text-4xl font-bold flex items-center gap-3">
            <span>🗺️</span> Order Tracking
          </h1>
          <p className="text-muted mt-2">Track your purchases from seller to your doorstep</p>
        </motion.div>

        {/* Order Selector */}
        {orders.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 overflow-x-auto pb-2">
            <div className="flex gap-3 min-w-max">
              {orders.map((order, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOrder(idx)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all whitespace-nowrap ${
                    selectedOrder === idx 
                      ? 'bg-neon-green/10 border-neon-green/40 text-neon-green shadow-[0_0_15px_rgba(57,255,20,0.1)]' 
                      : 'glass border-white/10 text-muted hover:border-white/20'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={order.image || order.imageUrl || order.image_url || ''} alt="" className="w-8 h-8 rounded-lg object-cover bg-white/5" />
                  <span className="font-heading text-sm font-bold">{order.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Geocoding Loading State */}
        {isGeocoding && (
          <div className="glass rounded-2xl border border-white/10 p-8 text-center mb-6">
            <div className="animate-spin w-8 h-8 border-4 border-neon-green border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-muted text-sm">📍 Resolving locations via pin code & address...</p>
          </div>
        )}

        {currentOrder && mapData && !isGeocoding && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6">
              <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-heading text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                    <span>📍</span> Delivery Route
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-muted-dim">
                      {Math.round(mapData.distance)} km • {mapData.delivery.label}
                    </span>
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-heading font-bold tracking-widest uppercase hover:bg-blue-500/30 transition-all">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                      Open in Google Maps
                    </a>
                  </div>
                </div>
                <TrackingMap 
                  sellerCoords={mapData.sellerCoords}
                  buyerCoords={mapData.buyerCoords}
                  sellerLocation={currentOrder.sellerLocation || 'Seller'}
                  buyerLocation={buyerAddress || 'Your Location'}
                  progressPercent={progressPercent}
                  googleMapsUrl={googleMapsUrl}
                />
              </div>

              {/* Delivery Timeline */}
              <div className="glass rounded-2xl border border-white/10 p-6">
                <h3 className="font-heading text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                  <span>🚚</span> Delivery Status
                </h3>
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-white/10" />
                  <div className="absolute left-5 top-0 w-0.5 bg-neon-green transition-all duration-1000" style={{ height: `${Math.min(100, (progressPercent / 100) * 100)}%` }} />
                  <div className="space-y-6">
                    {statusSteps.map((step, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + idx * 0.1 }}
                        className="flex items-center gap-4 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 transition-all ${step.done ? 'bg-neon-green/20 border-2 border-neon-green shadow-[0_0_10px_rgba(57,255,20,0.3)]' : 'bg-surface-mid border-2 border-white/10'}`}>
                          {step.icon}
                        </div>
                        <div>
                          <span className={`font-heading text-sm font-bold ${step.done ? 'text-neon-green' : 'text-muted-dim'}`}>{step.label}</span>
                          {idx === 0 && <span className="block text-[10px] text-muted-dim font-mono">{new Date(currentOrder.purchasedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Sidebar */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
              {/* Order Card */}
              <div className="glass rounded-2xl border border-white/10 p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentOrder.image || currentOrder.imageUrl || currentOrder.image_url || ''} alt={currentOrder.title} className="w-full h-48 object-cover rounded-xl bg-white/5 mb-4" />
                <h3 className="font-heading text-xl font-bold mb-2">{currentOrder.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted">
                    <span>🏪</span> <span className="font-semibold text-white">{currentOrder.sellerName || 'Eco Seller'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted flex-wrap">
                    <span>📍</span> From: <span className="text-white">{currentOrder.sellerLocation || 'N/A'}</span>
                    {currentOrder.sellerPincode && <span className="text-[10px] font-mono text-neon-green bg-neon-green/10 px-1.5 py-0.5 rounded border border-neon-green/20">{currentOrder.sellerPincode}</span>}
                  </div>
                  <div className="flex items-center gap-2 text-muted flex-wrap">
                    <span>🏠</span> To: <span className="text-white">{buyerAddress || 'Your Location'}</span>
                    {(currentOrder.buyerPincode || buyerPincode) && <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">{currentOrder.buyerPincode || buyerPincode}</span>}
                  </div>
                  {currentOrder.pricePaid ? (
                    <div className="flex items-center gap-2 text-muted">
                      <span>💰</span> Paid: <span className="text-neon-green font-bold">{formatPrice(currentOrder.pricePaid)}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Delivery Estimate */}
              <div className="glass rounded-2xl border border-neon-green/20 p-6 bg-neon-green/5">
                <h4 className="font-heading text-sm font-bold tracking-widest uppercase mb-4 text-neon-green flex items-center gap-2">
                  <span>📅</span> Estimated Delivery
                </h4>
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold text-white mb-1">{mapData.delivery.min}–{mapData.delivery.max}</div>
                  <div className="text-sm text-muted font-heading tracking-widest uppercase">Days</div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-muted-dim space-y-1">
                    <div>📏 Distance: <span className="text-white font-bold">{Math.round(mapData.distance)} km</span></div>
                    <div>🏷️ Route: <span className="text-white font-bold">{mapData.delivery.label}</span></div>
                    <div>📦 Expected by: <span className="text-neon-green font-bold">
                      {new Date(new Date(currentOrder.purchasedAt).getTime() + mapData.delivery.max * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span></div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="glass rounded-2xl border border-white/10 p-6">
                <h4 className="font-heading text-sm font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                  <span>⚡</span> Delivery Progress
                </h4>
                <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-neon-green/80 to-neon-green rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-muted-dim">Seller</span>
                  <span className="text-sm font-heading font-bold text-neon-green">{progressPercent}%</span>
                  <span className="text-[10px] text-muted-dim">You</span>
                </div>
              </div>

              {/* Google Maps Button */}
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
                className="block w-full py-4 text-center bg-blue-500 text-white rounded-xl font-heading font-bold tracking-widest uppercase hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
                🗺️ Open in Google Maps
              </a>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
