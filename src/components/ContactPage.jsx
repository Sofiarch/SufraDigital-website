import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

const ContactPage = ({ lang, textColor, onBack }) => {
  const [formData, setFormData] = useState({ name: '', restaurant: '', location: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const templateParams = {
      name: formData.name,
      restaurant: formData.restaurant,
      location: formData.location,
      phone: formData.phone,
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setIsSubmitting(false);
      setShowToast(true);
      setFormData({ name: '', restaurant: '', location: '', phone: '' });

      setTimeout(() => {
        setShowToast(false);
      }, 4000);

    } catch (error) {
      console.error('FAILED...', error);
      setIsSubmitting(false);
      alert(lang === 'ar' ? 'حدث خطأ أثناء الإرسال' : 'Failed to send message.');
    }
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
        submit: "Send Message", 
        sending: "Sending...",
        successTitle: "Message Sent!",
        successDesc: "We will be in touch shortly."
      },
      contactInfo: {
        title: "Direct Contact",
        phone: "0774 499 5655",
        phoneHref: "https://wa.me/9647744995655",
        email: "linex.website@gmail.com"
      }
    },
    ar: {
      title: "انضم إلى المستقبل",
      // UPDATED: Removed dot
      subtitle: "هل أنت مستعد للارتقاء بتجربة ضيوفك؟ املأ الاستمارة وسنتواصل معك خلال ٢٤ ساعة",
      labels: {
        name: "الاسم الكامل",
        restaurant: "اسم المطعم",
        location: "الموقع / المدينة",
        phone: "رقم الهاتف",
        submit: "إرسال الرسالة", 
        sending: "جاري الإرسال...",
        successTitle: "تم الإرسال بنجاح!",
        // UPDATED: Removed dot
        successDesc: "سنتواصل معك قريباً"
      },
      contactInfo: {
        title: "تواصل مباشر",
        phone: "0774 499 5655",
        phoneHref: "https://wa.me/9647744995655",
        email: "linex.website@gmail.com"
      }
    }
  };

  const t = content[lang];
  const isRTL = lang === 'ar';
  
  const inputClass = `w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg focus:outline-none focus:border-orange-500 transition-colors ${isRTL ? 'text-right' : 'text-left'}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-4 pb-20 px-4 max-w-7xl mx-auto font-cairo relative"
    >
      
      {/* Back Button */}
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

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* --- LEFT COLUMN: FORM --- */}
        <div className="w-full lg:w-1/2 order-2 lg:order-1">
          <div className="bg-[#3c3728] p-8 md:p-12 rounded-[40px] text-[#ebe3c6] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider opacity-60 mb-2">{t.labels.name}</label>
                <input name="name" value={formData.name} onChange={handleChange} type="text" required className={inputClass} placeholder={isRTL ? "الاسم الكريم" : "e.g. Ali Ahmed"} />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider opacity-60 mb-2">{t.labels.restaurant}</label>
                <input name="restaurant" value={formData.restaurant} onChange={handleChange} type="text" required className={inputClass} placeholder={isRTL ? "مطعم بغداد" : "Baghdad Restaurant"} />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider opacity-60 mb-2">{t.labels.location}</label>
                <input name="location" value={formData.location} onChange={handleChange} type="text" required className={inputClass} placeholder={isRTL ? "مثال: بغداد، المنصور" : "e.g. Baghdad, Mansour"} />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider opacity-60 mb-2">{t.labels.phone}</label>
                <input name="phone" value={formData.phone} onChange={handleChange} type="tel" required className={`w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg focus:outline-none focus:border-orange-500 transition-colors font-mono ${isRTL ? 'text-right' : 'text-left'}`} placeholder="0770 123 4567" dir="ltr" />
              </div>

              <button disabled={isSubmitting} className="w-full bg-[#ebe3c6] text-[#3c3728] font-bold text-xl py-5 rounded-xl mt-4 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? t.labels.sending : t.labels.submit}
              </button>
            </form>
          </div>
        </div>

        {/* --- RIGHT COLUMN: INFO --- */}
        <div className={`w-full lg:w-1/2 order-1 lg:order-2 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-5xl md:text-6xl font-bold italic mb-8 leading-tight" style={{ color: textColor }}>{t.title}</h1>
          <p className="text-xl opacity-80 leading-relaxed font-light mb-12" style={{ color: textColor }}>{t.subtitle}</p>

          <div className="space-y-6">
            <div className={`p-6 bg-white/50 border border-[#3c3728]/10 rounded-2xl flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <div className="w-12 h-12 bg-[#3c3728] text-[#ebe3c6] rounded-full flex items-center justify-center shrink-0">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
               </div>
               <div>
                  <div className="text-xs uppercase font-bold opacity-50 mb-1">{t.contactInfo.title}</div>
                  <a href={t.contactInfo.phoneHref} target="_blank" rel="noopener noreferrer" className="text-xl font-bold dir-ltr hover:text-green-600 transition-colors" style={{ color: textColor }}>{t.contactInfo.phone}</a>
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

      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed bottom-10 left-0 right-0 z-[60] pointer-events-none flex justify-center">
            <div className={`bg-[#3c3728] text-[#ebe3c6] px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 border border-[#ebe3c6]/20 pointer-events-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0 text-[#3c3728]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="font-bold text-lg">{t.labels.successTitle}</div>
                <div className="text-sm opacity-80">{t.labels.successDesc}</div>
              </div>
              <button onClick={() => setShowToast(false)} className="opacity-50 hover:opacity-100 transition-opacity p-1"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ContactPage;