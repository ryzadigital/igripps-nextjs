import React from 'react';
import Link from 'next/link';
import { Shield, Zap, Palette, Clock, Star, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Advanced Grip Technology',
      description: 'Our proprietary rubber grip sole technology provides unmatched traction on any surface.',
    },
    {
      icon: Palette,
      title: 'Custom Design Studio',
      description: 'Design your perfect sock with our intuitive online tool. Choose colors and submit a quote in minutes.',
    },
    {
      icon: Clock,
      title: 'Fast Turnaround',
      description: 'Rapid production time and fast-tracked delivery across Sydney and NSW.',
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Professional-grade materials used by top football clubs and academies.',
    },
  ];

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-secondary mb-4">
            Why Clubs Choose Us
          </h2>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            We're not just another sock supplier. We're your partner in performance, 
            providing custom solutions that give your team the edge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-secondary mb-3">
                {feature.title}
              </h3>
              <p className="text-muted">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-heading font-bold text-secondary mb-6">
              Trusted by reputable clubs across Sydney
            </h3>
            <div className="space-y-4">
              {[
                'Professional-grade materials and construction',
                'Custom club colours',
                'Bulk order discounts for clubs',
                'Fast local delivery',
                'Dedicated customer support',
                'Quality guarantee on every order',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-muted">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl p-8">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-secondary mb-4">
                Ready to Get Started?
              </h4>
              <p className="text-muted mb-6">
                Join clubs already using our custom sock solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/customise"
                  className="bg-accent hover:bg-accent-dark text-secondary px-6 py-3 rounded-lg font-medium transition-colors text-center"
                >
                  Customise Now
                </Link>
                <Link 
                  href="/contact"
                  className="border border-accent text-accent hover:bg-accent hover:text-secondary px-6 py-3 rounded-lg font-medium transition-colors text-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}