import { CusAccordion, type AccordionItem } from '@/components/ui';
import { ADVANTAGES } from '../mockdata.brand';

/**
 * Salonning asosiy ustunliklari — yagona karta.
 * Ramka pastdagi kontakt plitkalari bilan bir xil: yupqa `border-border-subtle`,
 * to'g'ri burchak — bosh sahifada ikkala blok bitta tilda gapiradi.
 */
export default function AdvantagesClassic() {
  const items: AccordionItem[] = ADVANTAGES.map((a) => {
    const Icon = a.icon;
    return {
      id: a.id,
      title: a.title,
      icon: <Icon size={18} className="text-primary" />,
      content: (
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-subtle">
            {a.short}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{a.body}</p>
        </div>
      ),
    };
  });

  return (
    <section className="px-4">
      <div className="border border-border-subtle bg-surface">
        <CusAccordion items={items} type="single" className="rounded-none" />
      </div>
    </section>
  );
}
