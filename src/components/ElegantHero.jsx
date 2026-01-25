import React from 'react';
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

const ElegantHero = ({ lang }) => {
  const content = {
    en: {
      badge: "Luxe Menu",
      title1: "The Golden",
      title2: "Standard",
      desc: "Elevate your restaurant with bespoke digital menus designed for the modern era of Iraqi hospitality.",
      cta: "Experience Elegance"
    },
    ar: {
      badge: "لوكس منيو",
      title1: "المعيار الذهبي",
      title2: "للضيافة",
      desc: "ارتقِ بمطعمك مع قوائم طعام رقمية مصممة خصيصاً لتناسب العصر الحديث للضيافة العراقية.",
      cta: "اختبر الفخامة"
    }
  };

  const t = content[lang];

  return (
    <div className="relative">
      <HeroGeometric 
        badge={t.badge}
        title1={t.title1}
        title2={t.title2}
        desc={t.desc}
        cta={t.cta}
      />
    </div>
  );
};

export default ElegantHero;