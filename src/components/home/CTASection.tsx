// src/components/home/CTASection.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-secondary to-secondary/90 text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Ready to Design Your Team's Perfect Sock?
          </h2>
          <p className="text-xl text-primary/80 mb-8">
            Join Sydney's top football clubs and experience the difference that 
            professional custom socks make on the pitch.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/customise">
              <Button size="lg" className="group text-white">
                Club Customiser
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-secondary">
                Get a Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}