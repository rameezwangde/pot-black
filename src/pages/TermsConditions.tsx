import React, { useEffect } from 'react';

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold text-[#D4AF37] mb-8">Terms & Conditions</h1>
      
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our website and services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Club Rules and Etiquette</h2>
          <p>
            Members and guests are expected to conduct themselves appropriately while on the premises. This includes respecting staff and other patrons, taking care of equipment, and adhering to our dress code and house rules. Management reserves the right to refuse service or revoke membership for violations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Bookings and Cancellations</h2>
          <p>
            Table bookings are subject to availability. Cancellations must be made at least 24 hours in advance to receive a full refund. Late cancellations or no-shows may incur a fee.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Liability</h2>
          <p>
            Pot Black Billiards Club is not liable for any personal injury, loss, or damage to personal property that occurs on the premises, except where caused by our direct negligence.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-10">Last updated: September 2026</p>
      </div>
    </div>
  );
};

export default TermsConditions;
