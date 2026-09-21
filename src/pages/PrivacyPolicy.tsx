import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold text-[#D4AF37] mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, phone number, and any other details you choose to provide.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to operate and improve our services, communicate with you, process transactions, and personalize your experience. We may also use it for marketing purposes with your consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Data Sharing and Security</h2>
          <p>
            We do not sell your personal information. We may share your data with trusted service providers who assist us in operating our business, subject to strict confidentiality agreements. We implement industry-standard security measures to protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at potblackdxb@gmail.com.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-10">Last updated: September 2026</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
