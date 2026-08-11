import { Suspense, lazy, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LuCalendarHeart, LuCircleCheckBig } from 'react-icons/lu';
import { FaTelegram } from 'react-icons/fa';
import { CusButton, CusSkeleton, useToast } from '@/components/ui';
import { APP_LOCALE } from '@/constants/app';
import { buildTelegramFittingLink } from '@/constants/contact';
import { ROUTES, itemPath } from '@/constants/routes';
import { useBookingStore } from '@/store/zustand';
import { MOCK_CATALOG, getItemById, isDress } from '@/features/catalog';
import TimeSlots from './components/TimeSlots';
import BookingForm, { type ContactErrors, type ContactValues } from './components/BookingForm';
import MyBookings from './components/MyBookings';
import { useAvailableDates } from './hooks/useAvailableDates';

// Chakra UI ni tortadi (~150 kB) — faqat shu sahifada yuklanadi
const CusCalendar = lazy(() => import('@/components/ui/calendar/CusCalendar'));

function formatDateRu(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(APP_LOCALE, {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  });
}

export default function FeatureBooking() {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('item') ?? undefined;
  const item = useMemo(
    () => (itemId ? getItemById(itemId, MOCK_CATALOG) : null),
    [itemId],
  );

  const toast = useToast();
  const bookings = useBookingStore((s) => s.bookings);
  const addBooking = useBookingStore((s) => s.add);
  const cancelBooking = useBookingStore((s) => s.cancel);

  const { availableDates, min, max } = useAvailableDates(itemId);

  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [values, setValues] = useState<ContactValues>({
    name: '',
    phone: '',
    size: '',
    comment: '',
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [done, setDone] = useState(false);

  const sizeOptions = useMemo(() => {
    if (!item) return [];
    if (isDress(item)) return item.sizes.filter((s) => s.available).map((s) => s.label);
    return item.sizeLabels ?? [];
  }, [item]);

  // Tanlangan kunda allaqachon band qilingan vaqtlar
  const takenSlots = useMemo(
    () =>
      bookings
        .filter((b) => b.status !== 'cancelled' && b.date === date)
        .map((b) => b.time),
    [bookings, date],
  );

  const handleChange = <K extends keyof ContactValues>(key: K, value: ContactValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: ContactErrors = {};
    if (values.name.trim().length < 2) next.name = 'Укажите имя';
    const digits = values.phone.replace(/\D/g, '');
    if (digits.length < 9) next.phone = 'Укажите корректный номер';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!date || !time) {
      toast.show('Выберите дату и время', 'error');
      return;
    }
    if (!validate()) return;

    addBooking({
      itemId: item?.id,
      itemName: item?.name,
      size: values.size || undefined,
      type: 'fitting',
      date,
      time,
      name: values.name.trim(),
      phone: values.phone.trim(),
      comment: values.comment.trim() || undefined,
    });

    setDone(true);
    toast.show('Заявка сохранена', 'success');
  };

  const handleTelegram = () => {
    if (!date || !time) return;
    const link = buildTelegramFittingLink({
      itemName: item?.name,
      date: formatDateRu(date),
      time,
      name: values.name.trim(),
      phone: values.phone.trim(),
      size: values.size || undefined,
      comment: values.comment.trim() || undefined,
    });
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleReset = () => {
    setDone(false);
    setDate(null);
    setTime(null);
    setValues({ name: '', phone: '', size: '', comment: '' });
  };

  if (done) {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col">
        <section className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success">
            <LuCircleCheckBig size={32} />
          </span>
          <h1 className="text-lg font-semibold text-foreground">Вы записаны на примерку</h1>
          <p className="text-sm text-muted">
            {date && formatDateRu(date)} в {time}
            {item ? ` · ${item.name}` : ''}
          </p>
          <p className="text-sm text-muted">
            Мы перезвоним по номеру {values.phone} для подтверждения. Чтобы ускорить —
            отправьте заявку в Telegram.
          </p>

          <div className="mt-4 flex w-full flex-col gap-2">
            <CusButton
              fullWidth
              leftIcon={<FaTelegram size={18} />}
              onClick={handleTelegram}
            >
              Отправить в Telegram
            </CusButton>
            <CusButton variant="secondary" fullWidth onClick={handleReset}>
              Записаться ещё раз
            </CusButton>
            <Link
              to={ROUTES.CATALOG}
              className="py-2 text-sm font-medium text-primary hover:underline"
            >
              Вернуться в каталог
            </Link>
          </div>
        </section>

        <MyBookings bookings={bookings} onCancel={cancelBooking} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col pb-6">
      <header className="space-y-1 px-4 pb-4 pt-5">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <LuCalendarHeart size={20} className="text-primary" />
          Запись на примерку
        </h1>
        <p className="text-sm text-muted">
          Примерка бесплатная и длится около часа. Выберите удобные дату и время.
        </p>
      </header>

      {item && (
        <section className="px-4 pb-4">
          <Link
            to={itemPath(item.slug)}
            className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface p-3 transition hover:shadow-card"
          >
            <img
              src={item.variants[0].mainImage}
              alt={item.name}
              className="h-16 w-14 shrink-0 rounded-xl object-cover"
              loading="lazy"
            />
            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted">Примерка этой модели</p>
            </div>
          </Link>
        </section>
      )}

      <section className="space-y-5 px-4">
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Дата</p>
          <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface p-2">
            <Suspense fallback={<CusSkeleton className="h-72 w-full rounded-xl" />}>
              <CusCalendar
                value={date}
                onChange={(next) => {
                  setDate(next);
                  setTime(null);
                }}
                availableDates={availableDates}
                min={min}
                max={max}
              />
            </Suspense>
          </div>
          {item?.bookedDates && item.bookedDates.length > 0 && (
            <p className="mt-2 text-xs text-muted">
              Серые даты уже заняты — модель забронирована.
            </p>
          )}
        </div>

        <TimeSlots
          value={time}
          onChange={setTime}
          takenSlots={takenSlots}
          disabled={!date}
        />

        <BookingForm
          values={values}
          errors={errors}
          sizeOptions={sizeOptions}
          onChange={handleChange}
        />

        <CusButton fullWidth size="lg" onClick={handleSubmit}>
          Записаться
        </CusButton>

        <p className="text-center text-xs text-muted">
          Нажимая «Записаться», вы соглашаетесь на обработку контактных данных.
        </p>
      </section>

      <MyBookings bookings={bookings} onCancel={cancelBooking} />
    </div>
  );
}
