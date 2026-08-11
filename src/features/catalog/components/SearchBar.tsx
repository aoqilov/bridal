import { forwardRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import CusInput from '@/components/ui/input/CusInput';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

const SearchBar = forwardRef<HTMLInputElement, Props>(function SearchBar(
  { value, onChange, onSubmit, placeholder = 'Платье, фата, размер, цвет...', autoFocus },
  ref,
) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
    >
      <CusInput
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        type="search"
        enterKeyHint="search"
        leftIcon={<FiSearch size={18} />}
        rightIcon={
          value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              className="grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-foreground"
              aria-label="Очистить"
            >
              <FiX size={16} />
            </button>
          ) : null
        }
      />
    </form>
  );
});

export default SearchBar;
