import { useState } from 'react';
import {
  CusBadge,
  CusButton,
  CusCard,
  CusInput,
  CusSheet,
  CusSkeleton,
  useToast,
} from '@/components/ui';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="border-b border-border-subtle pb-1 text-lg font-bold text-foreground">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-wide text-muted">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export default function FeaturePreview() {
  const { show } = useToast();
  const [sheetBottom, setSheetBottom] = useState(false);
  const [sheetRight, setSheetRight] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="mx-auto max-w-md space-y-8 px-4 py-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">UI Preview</h1>
        <p className="text-sm text-muted">Все компоненты и их варианты</p>
      </header>

      <Section title="Button">
        <Row label="Variants">
          <CusButton variant="primary">Primary</CusButton>
          <CusButton variant="secondary">Secondary</CusButton>
          <CusButton variant="ghost">Ghost</CusButton>
          <CusButton variant="danger">Danger</CusButton>
        </Row>
        <Row label="Sizes">
          <CusButton size="sm">Small</CusButton>
          <CusButton size="md">Medium</CusButton>
          <CusButton size="lg">Large</CusButton>
        </Row>
        <Row label="States">
          <CusButton loading>Loading</CusButton>
          <CusButton disabled>Disabled</CusButton>
        </Row>
        <Row label="With icons">
          <CusButton leftIcon="🛒">В корзину</CusButton>
          <CusButton variant="secondary" rightIcon="→">Далее</CusButton>
        </Row>
        <Row label="Full width">
          <CusButton fullWidth>Full Width Button</CusButton>
        </Row>
      </Section>

      <Section title="Input">
        <CusInput label="Обычный" placeholder="Введите текст..." />
        <CusInput
          label="С иконкой"
          leftIcon="🔍"
          placeholder="Поиск..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <CusInput label="С подсказкой" hint="Мы никому не сообщим" placeholder="Email" />
        <CusInput label="С ошибкой" error="Обязательное поле" placeholder="Пароль" />
        <CusInput label="Отключён" disabled placeholder="Нельзя редактировать" />
      </Section>

      <Section title="Card">
        <Row label="Padding & shadow">
          <CusCard className="w-full">Обычная карточка (padding=md, shadow=sm)</CusCard>
        </Row>
        <CusCard padding="lg" shadow="md">Большой padding + средняя тень</CusCard>
        <CusCard interactive>Интерактивная (наведи мышку)</CusCard>
        <CusCard padding="none" shadow="none" className="border border-dashed border-border p-3">
          Без padding и тени
        </CusCard>
      </Section>

      <Section title="Badge">
        <Row label="Variants">
          <CusBadge>Default</CusBadge>
          <CusBadge variant="brand">Brand</CusBadge>
          <CusBadge variant="success">Success</CusBadge>
          <CusBadge variant="warning">Warning</CusBadge>
          <CusBadge variant="danger">-50%</CusBadge>
        </Row>
        <Row label="Sizes">
          <CusBadge size="sm">Small</CusBadge>
          <CusBadge size="md">Medium</CusBadge>
        </Row>
      </Section>

      <Section title="Skeleton">
        <Row label="Rect">
          <CusSkeleton className="h-6 w-32" />
          <CusSkeleton className="h-20 w-20" />
        </Row>
        <Row label="Circle (avatar)">
          <CusSkeleton variant="circle" className="h-12 w-12" />
        </Row>
        <Row label="Text lines">
          <div className="w-full space-y-2">
            <CusSkeleton variant="text" className="w-3/4" />
            <CusSkeleton variant="text" className="w-1/2" />
            <CusSkeleton variant="text" className="w-2/3" />
          </div>
        </Row>
      </Section>

      <Section title="Sheet (Drawer)">
        <Row label="Bottom & Right">
          <CusButton onClick={() => setSheetBottom(true)}>Bottom Sheet</CusButton>
          <CusButton variant="secondary" onClick={() => setSheetRight(true)}>
            Right Sheet
          </CusButton>
        </Row>

        <CusSheet
          open={sheetBottom}
          onClose={() => setSheetBottom(false)}
          title="Фильтр"
          side="bottom"
        >
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Здесь может быть контент нижнего листа: фильтры, детали модели, форма.
            </p>
            <CusButton fullWidth onClick={() => setSheetBottom(false)}>
              Применить
            </CusButton>
          </div>
        </CusSheet>

        <CusSheet
          open={sheetRight}
          onClose={() => setSheetRight(false)}
          title="Меню"
          side="right"
        >
          <ul className="space-y-2 text-sm">
            <li>Мой аккаунт</li>
            <li>Настройки</li>
            <li>Помощь</li>
          </ul>
        </CusSheet>
      </Section>

      <Section title="Toast">
        <Row label="Types">
          <CusButton size="sm" variant="secondary" onClick={() => show('Информация', 'info')}>
            Info
          </CusButton>
          <CusButton size="sm" onClick={() => show('Вы записаны на примерку', 'success')}>
            Success
          </CusButton>
          <CusButton size="sm" variant="danger" onClick={() => show('Что-то пошло не так', 'error')}>
            Error
          </CusButton>
          <CusButton
            size="sm"
            variant="secondary"
            onClick={() => show('Проверьте данные', 'warning')}
          >
            Warning
          </CusButton>
        </Row>
      </Section>
    </div>
  );
}
