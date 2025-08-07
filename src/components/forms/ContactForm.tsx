'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Send, CheckCircle, AlertTriangle, Loader2, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

export function ContactForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Unknown error occurred');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoHome = () => {
    router.push('/');
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
            Thanks for contacting us! We'll get back to you as soon as possible. A confirmation has been
            sent to {formData.email}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Send Another Message
            </Button>
            <Button onClick={handleGoHome} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Take Me Home
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-sm font-medium text-secondary">Sending message...</p>
              <p className="text-xs text-muted">Do not close this page!</p>
            </div>
          </div>
        )}

        <div className="relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
              />
              <Input
                label="Club/Organisation *"
                value={formData.club}
                onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                required
                placeholder="iGripps FC"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+61 4XX XXX XXX"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Subject *</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={isSubmitting}
              >
                {subjects.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Tell us about your requirements, timeline, or any questions you have..."
                required
                disabled={isSubmitting}
              />
            </div>

            {errorMessage && (
              <div className="text-red-600 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending Message...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}