import { CusAccordion, type AccordionItem } from '@/components/ui';
import { FiInfo, FiShield, FiTruck, FiFileText } from 'react-icons/fi';
import { FaTelegram } from 'react-icons/fa';
import { ABOUT_BLOCKS } from '../mockdata.brand';
import { buildContactTelegramLink } from '@/constants/contact';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  mission: FiInfo,
  quality: FiShield,
  delivery: FiTruck,
  rules: FiFileText,
};

export default function AboutSection() {
  const items: AccordionItem[] = ABOUT_BLOCKS.map((block) => {
    const Icon = iconMap[block.id] ?? FiInfo;
    return {
      id: block.id,
      title: block.title,
      icon: <Icon size={18} className="text-primary" />,
      content: <p className="leading-relaxed text-foreground/90">{block.body}</p>,
    };
  });

  return (
    <section className="px-4">
      <h2 className="mb-3 text-base font-bold text-foreground">О компании</h2>
      <CusAccordion items={items} type="single" defaultOpenIds={['mission']} />

      <a
        href={buildContactTelegramLink('Здравствуйте! У меня вопрос.')}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-3 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <FaTelegram size={18} />
        Задать вопрос в Telegram
      </a>
    </section>
  );
}
