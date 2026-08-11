import { FiCalendar, FiRefreshCw, FiCreditCard, FiMaximize, FiGrid } from 'react-icons/fi';
import { MdSupportAgent, MdLocationOn } from 'react-icons/md';
import { CusAccordion, CusListItem, type AccordionItem } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import {
  ADDRESSES,
  buildContactTelegramLink,
  buildYandexMapsRouteUrl,
} from '@/constants/contact';

const FAQ: AccordionItem[] = [
  {
    id: 'fitting',
    title: 'Как записаться на примерку?',
    icon: <FiCalendar size={18} />,
    content:
      'Выберите дату и время на странице «Примерка» — мы перезвоним для подтверждения. Примерка бесплатная и длится около часа.',
  },
  {
    id: 'deposit',
    title: 'Как работает залог?',
    icon: <FiRefreshCw size={18} />,
    content:
      'Залог фиксированный, указан на странице каждой модели. Возвращается полностью, если изделие вернули в срок и без повреждений. Химчистка после свадьбы входит в стоимость аренды.',
  },
  {
    id: 'payment',
    title: 'Какие способы оплаты?',
    icon: <FiCreditCard size={18} />,
    content:
      'Наличными в салоне, переводом на карту (Uzcard / Humo) или онлайн — по договорённости с менеджером. Бронь фиксируется после внесения залога.',
  },
  {
    id: 'size',
    title: 'А если платье не по размеру?',
    icon: <FiMaximize size={18} />,
    content:
      'Базовая подгонка по фигуре входит в стоимость: ушить корсет, подшить длину. Пошив по индивидуальным меркам занимает 30–45 дней — обращайтесь минимум за два месяца.',
  },
];

export default function HelpSection() {
  const point = ADDRESSES[0];

  return (
    <section id="profile-help" className="scroll-mt-4">
      <h2 className="mb-3 px-4 text-base font-bold text-foreground">Помощь</h2>

      <div className="px-4">
        <CusAccordion items={FAQ} className="shadow-card" />
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl bg-surface shadow-card mx-4">
        <CusListItem
          icon={<MdSupportAgent size={20} />}
          title="Написать в Telegram"
          description="Ответим в рабочее время"
          href={buildContactTelegramLink('Здравствуйте! У меня вопрос по платью.')}
        />
        {point && (
          <CusListItem
            icon={<MdLocationOn size={20} />}
            title="Где нас найти"
            description={point.address}
            href={buildYandexMapsRouteUrl(point.lat, point.lng)}
          />
        )}
        <CusListItem
          icon={<FiGrid size={18} />}
          title="Каталог"
          description="Платья и аксессуары"
          to={ROUTES.CATALOG}
        />
        <CusListItem
          icon={<FiCalendar size={18} />}
          title="Записаться на примерку"
          description="Выбрать дату и время"
          to={ROUTES.BOOKING}
        />
      </div>
    </section>
  );
}
