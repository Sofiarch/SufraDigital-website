import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactPage = ({ lang, textColor, onBack }) => {
  const [formState, setFormState] = useState({ name: '', restaurant: '', location: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSent(true);
  };

  const content = {
    en: {
      title: "Join the Future",
      subtitle: "Ready to elevate your guest experience? Fill out the form and we will contact you within 24 hours.",
      labels: {
        name: "Full Name",
        restaurant: "Restaurant Name",
        location: "Location / City",
        phone: "Phone Number",
        message: "Any specific requirements?",
        submit: "Send Message", 
        sending: "Sending...",
        sent: "Message Sent Successfully!"
      },
      contactInfo: {
        title: "Direct Contact",
        phone: "0774 499 5655",
        email: "partners@luxemenu.iq",
        address: "Al-Mansour, Baghdad, Iraq"
      }
    },
    ar: {
      title: "انضم إلى المستقبل",
      subtitle: "هل أنت مستعد للارتقاء بتجربة ضيوفك؟ املأ الاستمارة وسنتواصل معك خلال ٢٤ ساعة.",
      labels: {
        name: "الاسم الكامل",
        restaurant: "اسم المطعم",
        location: "الموقع / المدينة",
        phone: "رقم الهاتف",
        message: "أي متطلبات خاصة؟",
        submit: "إرسال الرسالة", 
        sending: "جاري الإرسال...",
        sent: "تم إرسال رسالتك بنجاح!"
      },
      contactInfo: {
        title: "تواصل مباشر",
        phone: "0774 499 5655",
        email: "partners@luxemenu.iq",
        address: "المنصور، بغداد، العراق"
      }
    }
  };

  const t = content[lang];
  const isRTL = lang === 'ar';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-20 px-4 max-w-7xl mx-auto font-cairo"
    >
      
      {/* Back Button - FIXED: Always on the Right */}
      <div className="flex justify-end mb-12">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-lg font-bold opacity-60 hover:opacity-100 transition flex-row-reverse"
            style={{ color: textColor }}
        >
            {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
            <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
      </div>

      {/* LAYOUT FIXED: Form Left, Text Right (Static) */}
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* --- LEFT COLUMN: FORM --- */}
        <div className="w-full lg:w-1/2 order-2 lg:order-1">
          <div className="bg-[#3c3728] p-8 md:p-12 rounded-[40px] text-[#ebe3c6] shadow-2xl relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] pointer-events-none"></div>

            {isSent ? (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="h-[400px] flex flex-col items-center justify-center text-center"
               >
                 <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-[#3c3728] mb-6">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                 </div>
                 <h3 className="text-3xl font-bold mb-2">{t.labels.sent}</h3>
               </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider opacity-60 mb-2">{t.labels.name}</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder={isRTL ? "الاسم الكريم" : "John Doe"}
                  />
                </div>

                {/* Restaurant */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider opacity-60 mb-2">{t.labels.restaurant}</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder={isRTL ? "مطعم بغداد" : "Baghdad Restaurant"}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider opacity-60 mb-2">{t.labels.location}</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder={isRTL ? "مثال: بغداد، المنصور" : "e.g. Baghdad, Mansour"}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider opacity-60 mb-2">{t.labels.phone}</label>
                  <input 
                    type="tel" 
                    required
                    className={`w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg focus:outline-none focus:border-orange-500 transition-colors font-mono ${isRTL ? 'text-right' : ''}`}
                    placeholder="0774 499 5655"
                    dir="ltr"
                  />
                </div>

                {/* Submit Button */}
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-[#ebe3c6] text-[#3c3728] font-bold text-xl py-5 rounded-xl mt-4 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t.labels.sending : t.labels.submit}
                </button>

              </form>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: INFO & TEXT (Static) --- */}
        <div className={`w-full lg:w-1/2 order-1 lg:order-2 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-5xl md:text-6xl font-bold italic mb-8 leading-tight" style={{ color: textColor }}>
            {t.title}
          </h1>
          <p className="text-xl opacity-80 leading-relaxed font-light mb-12" style={{ color: textColor }}>
            {t.subtitle}
          </p>

          {/* Contact Details Cards */}
          <div className="space-y-6">
            {/* FIXED: Removed flex-row-reverse logic so icons stay stable */}
            <div className={`p-6 bg-white/50 border border-[#3c3728]/10 rounded-2xl flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <div className="w-12 h-12 bg-[#3c3728] text-[#ebe3c6] rounded-full flex items-center justify-center shrink-0">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
               </div>
               <div>
                  <div className="text-xs uppercase font-bold opacity-50 mb-1">{t.contactInfo.title}</div>
                  <div className="text-xl font-bold dir-ltr" style={{ color: textColor }}>{t.contactInfo.phone}</div>
               </div>
            </div>

            <div className={`p-6 bg-white/50 border border-[#3c3728]/10 rounded-2xl flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <div className="w-12 h-12 bg-[#3c3728] text-[#ebe3c6] rounded-full flex items-center justify-center shrink-0">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               </div>
               <div>
                  <div className="text-xs uppercase font-bold opacity-50 mb-1">Email</div>
                  <div className="text-xl font-bold" style={{ color: textColor }}>{t.contactInfo.email}</div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ContactPage;