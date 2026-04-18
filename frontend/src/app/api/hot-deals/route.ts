import { NextResponse } from 'next/server';

export async function GET() {
  const hotDeals = [
    {
      id: "deal-1",
      title: "Mountain Bike",
      price: "$899",
      image: "/images/hot-deals/neon_mountain_bike.png",
      link: "/cycle"
    },
    {
      id: "deal-2",
      title: "Gaming Chair",
      price: "$399",
      image: "/images/hot-deals/neon_gaming_chair.png",
      link: "/chair"
    },
    {
      id: "deal-3",
      title: "iPhone 17 Pro Max",
      price: "$1,199",
      image: "/images/hot-deals/neon_iphone_17.png",
      link: "/"
    }
  ];

  return NextResponse.json({ success: true, data: hotDeals });
}
