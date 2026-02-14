"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Star, Info, ExternalLink, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface Product {
    id: string
    name: string
    price: string
    discountPrice?: string
    image?: string
    images?: string[]
    category: string
    rating: number
    isBestSeller?: boolean
    isSale?: boolean
    videoUrl?: string
}

const MOCK_PRODUCTS: Product[] = [
    {
        id: "4",
        name: "Bershka Striped Tie-Up A-Line Dress",
        price: "₹1470",
        discountPrice: "₹2950",
        images: [
            "/uploads/bershka-white.jpg",
            "/uploads/bershka-red.jpg",
            "/uploads/bershka-blue.jpg"
        ],
        category: "Women's Collection",
        rating: 4.8,
        isSale: true,
        isBestSeller: true
    },
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
        rating: 4.9,
        videoUrl: "https://www.youtube.com/embed/uGSdpPj6TnA?autoplay=1&mute=1&loop=1&playlist=uGSdpPj6TnA&controls=0&modestbranding=1&rel=0"
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

function ProductImage({ product }: { product: Product }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const hasMultipleImages = product.images && product.images.length > 1

    useEffect(() => {
        if (!hasMultipleImages) return
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % product.images!.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [hasMultipleImages, product.images])

    if (product.videoUrl) {
        return (
            <iframe
                src={product.videoUrl}
                className="w-full h-full object-cover pointer-events-none"
                title={product.name}
                allow="autoplay; encrypted-media"
                allowFullScreen
            />
        )
    }

    const images = product.images || [product.image!]

    return (
        <div className="relative w-full h-full group/img">
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                />
            </AnimatePresence>

            {hasMultipleImages && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {product.images!.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function ProfileStore({ username }: { username: string }) {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {MOCK_PRODUCTS.map((product) => (
                    <motion.div
                        key={product.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md h-full group"
                    >
                        {/* Visual Container */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-black">
                            <ProductImage product={product} />

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
        </div>
    )
}
