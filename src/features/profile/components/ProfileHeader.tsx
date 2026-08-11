import { useState } from 'react';
import { MdEdit, MdPerson, MdLocationCity, MdPhone } from 'react-icons/md';
import { CusSheet, CusInput, CusButton } from '@/components/ui';
import { useUserStore } from '@/store/zustand';

export default function ProfileHeader() {
  const user = useUserStore((s) => s.user);
  const updateProfile = useUserStore((s) => s.updateProfile);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [city, setCity] = useState(user?.city ?? '');

  const displayName = user?.name?.trim() || 'Гость';
  const initial = displayName[0]?.toUpperCase() ?? 'Г';

  const openSheet = () => {
    setName(user?.name ?? '');
    setPhone(user?.phone ?? '');
    setCity(user?.city ?? '');
    setOpen(true);
  };

  const save = () => {
    updateProfile({
      name: name.trim(),
      phone: phone.trim() || undefined,
      city: city.trim() || undefined,
    });
    setOpen(false);
  };

  return (
    <>
      <section className="flex items-center gap-3 px-4 pt-4">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-gradient p-[3px]">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="h-full w-full rounded-full border-2 border-background object-cover"
            />
          ) : (
            <span className="grid h-full w-full place-items-center rounded-full border-2 border-background bg-surface-2 text-xl font-bold text-foreground">
              {initial}
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold text-foreground">{displayName}</h1>
          <p className="truncate text-xs text-muted">
            {user?.city || user?.phone ? (
              [user.city, user.phone].filter(Boolean).join(' · ')
            ) : (
              <>Заполните профиль, чтобы оформлять заказы быстрее</>
            )}
          </p>
        </div>

        <CusButton
          variant="secondary"
          size="sm"
          onClick={openSheet}
          leftIcon={<MdEdit size={16} />}
        >
          {user?.name ? 'Изменить' : 'Заполнить'}
        </CusButton>
      </section>

      <CusSheet open={open} onClose={() => setOpen(false)} title="Мои данные">
        <div className="space-y-3">
          <CusInput
            name="name"
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Как к вам обращаться"
            leftIcon={<MdPerson size={18} />}
          />
          <CusInput
            name="phone"
            label="Телефон"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998 90 000 00 00"
            leftIcon={<MdPhone size={18} />}
            hint="Нужен только для связи по заказу"
          />
          <CusInput
            name="city"
            label="Город"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ташкент"
            leftIcon={<MdLocationCity size={18} />}
          />

          <CusButton fullWidth onClick={save} disabled={!name.trim()}>
            Сохранить
          </CusButton>

          <p className="text-center text-[11px] text-muted">
            Данные хранятся только на этом устройстве
          </p>
        </div>
      </CusSheet>
    </>
  );
}
