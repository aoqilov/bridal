import ThemeSwitcher from './ThemeSwitcher';

export default function SettingsSection() {
  return (
    <section id="profile-settings" className="scroll-mt-4">
      <h2 className="mb-3 px-4 text-base font-bold text-foreground">Настройки</h2>
      <div className="px-4">
        <ThemeSwitcher />
      </div>
    </section>
  );
}
