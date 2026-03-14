import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-[560px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Modern office workspace"
          fill
          className="object-cover"
          priority
        />
        {/* Green Overlay */}
        <div className="absolute inset-0 bg-primary-500/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            Transform Your Digital Future
            <br />
            <span className="text-primary-50">with Celoris</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-primary-50 leading-relaxed animate-slide-up">
            Celoris Designs LLP is your trusted partner in digital transformation, 
            delivering cutting-edge IT solutions that empower businesses and individuals 
            to thrive in the digital age.
          </p>



          {/* Stats or Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-primary-100">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-primary-100">Job Placements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-primary-100">Games & Tools</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
