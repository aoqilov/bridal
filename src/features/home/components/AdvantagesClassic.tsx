import { CusAccordion, type AccordionItem } from '@/components/ui';
import { ADVANTAGES, type AdvantageTone } from '../mockdata.brand';

const ICON_TONE: Record<AdvantageTone, string> = {
  primary: 'text-primary',
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
};

/** Salonning asosiy ustunliklari — yagona karta, ajratuvchi chiziqlar, chevron */
export default function AdvantagesClassic() {
  const items: AccordionItem[] = ADVANTAGES.map((a) => {
    const Icon = a.icon;
    return {
      id: a.id,
      title: a.title,
      icon: <Icon size={20} className={ICON_TONE[a.tone]} />,
      content: (
        <div>
          <p className="text-xs font-medium text-muted">{a.short}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground">{a.body}</p>
        </div>
      ),
    };
  });

  return (
    <section className="px-4">
      <CusAccordion items={items} type="single" className="shadow-card" />
    </section>
  );
}
