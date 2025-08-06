// src/components/forms/ContactForm.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

export function ContactForm() {
  const searchParams = useSearchParams();
  
  // Get initial subject from URL parameter
  const getInitialSubject = () => {
    const urlSubject = searchParams.get('subject')?.toLowerCase();
  
    if (!urlSubject) return 'general';
  
    if (urlSubject.includes('quote')) return 'quote';
    if (urlSubject.includes('sample')) return 'sample';
    if (urlSubject.includes('bulk')) return 'bulk';
    if (urlSubject.includes('partner')) return 'partnership';
    if (urlSubject.includes('support')) return 'support';
  
    return 'general';
  };

  // Get initial message from URL parameter
  const getInitialMessage = () => {
    const urlMessage = searchParams.get('message');
    return urlMessage ? decodeURIComponent(urlMessage) : '';
  };

  const [formData, setFormData] = useState({
    name: '',
    club: '',
    email: '',
    phone: '',
    subject: getInitialSubject(),
    message: getInitialMessage(),
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update subject and message when URL changes
  useEffect(() => {
    const newSubject = getInitialSubject();
    const newMessage = getInitialMessage();
    setFormData(prev => ({ 
      ...prev, 
      subject: newSubject,
      message: newMessage
    }));
  }, [searchParams]);

  const subjects = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'quote', label: 'Request Quote' },
    { value: 'sample', label: 'Request Sample' },
    { value: 'bulk', label: 'Bulk Order (50+ pairs)' },
    { value: 'support', label: 'Customer Support' },
    { value: 'partnership', label: 'Partnership Opportunity' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary mb-4">
            Message Sent Successfully!
          </h3>
          <p className="text-muted mb-6">
            Thanks for contacting us! We'll get back to you within 2 business hours.
            A confirmation has been sent to {formData.email}.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            
            <Input
              label="Club/Organisation"
              value={formData.club}
              onChange={(e) => setFormData({ ...formData, club: e.target.value })}
              placeholder="Optional"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+61 4XX XXX XXX"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Subject *
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              required
            >
              {subjects.map((subject) => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              placeholder="Tell us about your requirements, timeline, or any questions you have..."
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
          >
            {isSubmitting ? (
              <>Sending Message...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}