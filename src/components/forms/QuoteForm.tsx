'use client';
import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import type { SockCustomization } from '@/types';

interface QuoteFormProps {
  customization: SockCustomization;
  estimate: number;
  onBack: () => void;
}

export function QuoteForm({ customization, estimate, onBack }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    club: customization.clubName || '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-secondary mb-4">
            Quote Request Submitted!
          </h2>
          <p className="text-muted mb-6">
            We've received your custom sock design and will send you an official quote within 2 business hours.
            A copy has been sent to {formData.email}.
          </p>
          <div className="space-y-3">
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Return to Home
            </Button>
            <Button variant="outline" onClick={onBack} className="w-full">
              Design Another Sock
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Design
        </Button>
        <div>
          <h2 className="text-2xl font-heading font-bold text-secondary">
            Request Official Quote
          </h2>
          <p className="text-muted">
            Get your personalized quote for {customization.clubName || 'your club'}'s custom socks.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-1">
              <Input
                label="Your Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Club Name *"
                value={formData.club}
                onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                required
              />
              <Input
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+61 4XX XXX XXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-4 md:col-span-1 flex flex-col justify-between">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={7}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                  placeholder="I'm interested in the same quality service that Narellan Rangers Soccer Club receives. Please contact me to discuss our club's requirements."
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !formData.name || !formData.club || !formData.email || !formData.message}
              >
                {isSubmitting ? 'Submitting...' : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
