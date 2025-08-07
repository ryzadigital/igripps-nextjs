// app/privacy/page.tsx
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <nav className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 leading-relaxed">
              This Privacy Policy outlines how iGripps (referred to as "we", "us", or "our") collects, uses, stores, and discloses your personal information through our website (Website).
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 space-y-8">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. What Information Do We Collect?</h2>
              <p className="text-gray-700 mb-4">
                The type of personal information we collect depends on your interaction with our Website. Information we may collect includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Club/Organisation</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Types of Information</h2>
              <p className="text-gray-700 mb-4">
                Under the Privacy Act 1988 (Cth) (the Privacy Act), personal data is categorised as:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Personal Information:</h3>
                  <p className="text-gray-700">
                    Information or opinions about an identifiable individual, regardless of accuracy. If you cannot be reasonably identified, it is not considered personal information.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Sensitive Information:</h3>
                  <p className="text-gray-700 mb-2">
                    This includes details about race, ethnicity, political opinions, religion, membership affiliations, criminal history, or health.
                  </p>
                  <p className="text-gray-700 mb-2">We only use Sensitive Information:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>For the purpose it was collected;</li>
                    <li>For directly related secondary purposes; and</li>
                    <li>With your consent or as otherwise permitted by law.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Collect Your Personal Information</h2>
              <p className="text-gray-700 mb-4">We may collect personal information:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Directly from you:</strong> via web forms, sign-ups, or contact enquiries on our Website or associated platforms.</li>
                <li><strong>Automatically:</strong> through cookies or browser storage to improve your experience (not typically used to personally identify you).</li>
                <li><strong>From third parties:</strong> If information is provided to us by another source, we take reasonable steps to notify you or gain your consent.</li>
              </ul>
              <p className="text-gray-700 mt-4">
                If Sensitive Information is collected, it is handled in accordance with this Privacy Policy.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Purpose of Collection</h2>
              <p className="text-gray-700 mb-4">We collect personal information to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mb-4">
                <li>Provide and improve our services and Website features</li>
                <li>Communicate updates, support information, or promotional messages</li>
                <li>Respond to your enquiries</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We may disclose your information to trusted third-party service providers who assist in running our operations. Internal maintenance or development teams may also access data during support activities.
              </p>
              <p className="text-gray-700 mb-4">
                By using our Website, you consent to receiving direct marketing communications from iGripps, relevant to services you would reasonably expect. You may opt out at any time via the unsubscribe link or by contacting us directly.
              </p>
              <p className="text-gray-700">
                We do not use Sensitive Information for marketing purposes.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Security, Access & Correction</h2>
              <p className="text-gray-700 mb-4">
                We take reasonable steps to protect your personal information from misuse, interference, and unauthorised access. When personal data is no longer needed, we securely destroy or de-identify it.
              </p>
              <p className="text-gray-700 mb-4">
                We retain personal data for up to 7 years where required for legal, financial, or operational reasons.
              </p>
              <p className="text-gray-700 mb-2">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mb-4">
                <li>Request access to your personal information (in line with APP 12)</li>
                <li>Request correction of any inaccurate or outdated information (APP 13)</li>
              </ul>
              <p className="text-gray-700">
                To make a request, please contact us using the details provided in Section 9.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Complaints Procedure</h2>
              <p className="text-gray-700 mb-4">
                If you have concerns about your privacy or how your data has been handled:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mb-4">
                <li>Contact us directly</li>
                <li>Our team will review your concern and may request further information to assist investigation</li>
                <li>If a breach or error is identified, we will work with you to resolve it</li>
              </ul>
              <p className="text-gray-700">
                If you are not satisfied with our response, you may escalate the matter to the Office of the Australian Information Commissioner (OAIC).
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Overseas Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We do not disclose your personal information to overseas recipients unless you have explicitly requested it.
              </p>
              <p className="text-gray-700">
                If data is transferred overseas, the receiving party may not be bound by the Australian Privacy Principles, and iGripps is not liable for how it is handled outside Australia.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. GDPR (General Data Protection Regulation)</h2>
              <p className="text-gray-700">
                While the GDPR provides additional rights for EU-based users, iGripps does not actively target or monitor users in the EU. Therefore, GDPR provisions generally do not apply.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contacting Us About Privacy</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about privacy, or wish to access, correct, or complain about how we handle your personal data:
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Email Contact</p>
                    <p className="text-blue-800">
                      <a href="mailto:admin@igripps.com.au" className="hover:underline">
                        admin@igripps.com.au
                      </a>
                    </p>
                    <p className="text-sm text-blue-700 mt-2">
                      <strong>Subject line:</strong> Privacy Enquiry
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Last updated: {new Date().toLocaleDateString('en-AU')}</p>
            <p className="mt-2">
              This privacy policy is governed by Australian Privacy Principles under the Privacy Act 1988 (Cth).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export function generateMetadata() {
  return {
    title: 'Privacy Policy | iGripps',
    description: 'Learn how iGripps collects, uses, and protects your personal information. Read our comprehensive privacy policy outlining your rights and our data handling practices.',
    robots: {
      index: true,
      follow: true,
    },
  };
}