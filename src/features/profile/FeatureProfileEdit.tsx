import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAlternateEmail,
  MdDeleteSweep,
  MdLocationCity,
  MdPerson,
  MdPhone,
} from 'react-icons/md';
import { CusButton, CusInput, useToast } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useUserStore } from '@/store/zustand';
import { cn } from '@/utils/cn';
import ProfileTopBar from './components/ProfileTopBar';
import AvatarPicker from './components/AvatarPicker';
import { useClearAppData } from './hooks/useClearAppData';

export default function FeatureProfileEdit() {
  const navigate = useNavigate();
  const { show } = useToast();
  const user = useUserStore((s) => s.user);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const { confirming, clear } = useClearAppData();

  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [city, setCity] = useState(user?.city ?? '');

  const displayName = name.trim() || user?.name?.trim() || 'Гость';
  const initial = displayName[0]?.toUpperCase() ?? 'Г';

  const save = () => {
    updateProfile({
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      city: city.trim() || undefined,
      avatar: avatar || undefined,
    });
    show('Профиль сохранён', 'success');
    navigate(ROUTES.PROFILE);
  };

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-background pb-8">
      <ProfileTopBar title="Редактировать профиль" />

      <div className="flex justify-center px-4 pb-5 pt-5">
        <AvatarPicker value={avatar} fallback={initial} onChange={setAvatar} />
      </div>

      <div className="space-y-3 px-4">
        <div className="space-y-3 rounded-2xl bg-surface p-3 shadow-card">
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
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<MdAlternateEmail size={18} />}
          />
          <CusInput
            name="city"
            label="Город"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ташкент"
            leftIcon={<MdLocationCity size={18} />}
          />
        </div>

        <CusButton fullWidth onClick={save} disabled={!name.trim()}>
          Сохранить изменения
        </CusButton>

        <p className="text-center text-[11px] text-muted">
          Данные хранятся только на этом устройстве
        </p>

        <button
          type="button"
          onClick={clear}
          className={cn(
            'mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-surface py-3.5 text-sm font-semibold text-danger shadow-card transition',
            !confirming && 'hover:bg-danger-soft',
          )}
        >
          <MdDeleteSweep size={18} />
          {confirming ? 'Точно удалить все данные?' : 'Удалить мои данные'}
        </button>
      </div>
    </div>
  );
}
