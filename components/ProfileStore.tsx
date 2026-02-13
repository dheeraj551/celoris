"use client"

import { useState, useRef, useEffect } from "react"
import { ShoppingBag, Star, ArrowRight, Tag, Heart, Info, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface Product {
    id: string
    name: string
    price: string
    discountPrice?: string
    image: string
    category: string
    rating: number
    isBestSeller?: boolean
    isSale?: boolean
    videoUrl?: string
}

const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Glitzy Night Set",
        price: "$149.00",
        discountPrice: "$199.00",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=400",
        category: "Festival Collection",
        rating: 5.0,
        isBestSeller: true,
        isSale: true,
        videoUrl: "https://www.youtube.com/embed/1OvbFB9Vcac?autoplay=1&mute=1&loop=1&playlist=1OvbFB9Vcac&controls=0&modestbranding=1&rel=0"
    },
    {
        id: "2",
        name: "Tropical Sunset Halter",
        price: "$75.00",
        image: "https://images.unsplash.com/photo-1549062572-544a64fb0c56?auto=format&fit=crop&q=80&w=400",
        category: "Vacation Wear",
        rating: 4.9
    },
    {
        id: "3",
        name: "Azure Bloom Ruffle Dress",
        price: "$110.00",
        image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&q=80&w=400",
        category: "Summer Brunch",
        rating: 4.8,
        isBestSeller: true
    }
]

export default function ProfileStore({ username }: { username: string }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        if (!isHovered) {
            const scrollContainer = scrollContainerRef.current
            if (!scrollContainer) return

            let animationFrameId: number;
            const scroll = () => {
                if (scrollContainer) {
                    if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
                        scrollContainer.scrollLeft = 0;
                    } else {
                        scrollContainer.scrollLeft += 0.5;
                    }
                    animationFrameId = requestAnimationFrame(scroll);
                }
            };

            animationFrameId = requestAnimationFrame(scroll);
            return () => {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            }
        }
    }, [isHovered])

    return (
        <div className="w-full">
            <div
                ref={scrollContainerRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex overflow-x-auto gap-6 pb-2 snap-x hide-scrollbar"
            >
                {MOCK_PRODUCTS.map((product) => (
                    <motion.div
                        key={product.id}
                        whileHover={{ y: -5 }}
                        className="w-64 flex-shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md h-full group"
                    >
                        {/* Visual Container */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-black">
                            {product.videoUrl ? (
                                <iframe
                                    src={product.videoUrl}
                                    className="w-full h-full object-cover pointer-events-none"
                                    title={product.name}
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            ) : (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            )}
                            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                {product.isSale && (
                                    <div className="bg-[#E11D48] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg w-fit">
                                        Sale
                                    </div>
                                )}
                                {product.isBestSeller && (
                                    <div className="bg-[#1E293B] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg w-fit">
                                        Best Seller
                                    </div>
                                )}
                            </div>
                            <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                                <Heart className="w-4 h-4" />
                            </button>

                            {/* Quick View Button (Desktop) */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <div className="bg-white/95 text-gray-900 px-4 py-2 rounded-full text-xs font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg flex items-center gap-2">
                                    <Info className="w-3.5 h-3.5" /> Quick View
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                                <span>{product.category}</span>
                                <div className="flex items-center gap-1 text-amber-400">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{product.rating}</span>
                                </div>
                            </div>

                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-base font-black text-[#1E293B]">{product.price}</p>
                                {product.discountPrice && (
                                    <p className="text-xs font-medium text-gray-400 line-through">{product.discountPrice}</p>
                                )}
                            </div>

                            <Button
                                variant="outline"
                                className="mt-3 w-full h-10 border-[#1E293B] text-[#1E293B] hover:bg-[#1E293B] hover:text-white rounded-xl text-xs font-bold transition-all group/btn"
                            >
                                <ExternalLink className="w-3.5 h-3.5 mr-2 transition-transform group-hover/btn:-translate-y-0.5" />
                                Shop Now
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    )
}
