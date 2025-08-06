// app/contact/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactForm } from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us – iGripps',
  description: 'Get in touch with the iGripps team for quotes, samples, support, or partnerships.',
};

function ContactFormWrapper() {
  return <ContactForm />;
}

export default function ContactPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">Contact Us</h1>
        <p className="text-muted-foreground">
          Got a question or want a custom sock quote? Fill out the form below and we will respond quickly.
        </p>
      </div>
      
      <Suspense fallback={
        <div className="text-center py-8">
          <div className="animate-pulse bg-gray-200 rounded-lg h-96 w-full"></div>
          <p className="text-gray-500 mt-4">Loading contact form...</p>
        </div>
      }>
        <ContactFormWrapper />
      </Suspense>
    </section>
  );
}