import { cn } from '@/utils/cn';

type Props = {
  /** `true` — qatorni tanlash shart, `false` — o'tkazib yuborsa ham bo'ladi */
  required?: boolean;
};

/** Qator sarlavhasi yonidagi belgi: «обязательно» / «необязательно» */
export default function StripBadge({ required = false }: Props) {
  return (
    <span
      className={cn('text-[10px] font-normal', required ? 'text-danger' : 'text-subtle')}
    >
      {required ? 'обязательно' : 'необязательно'}
    </span>
  );
}
