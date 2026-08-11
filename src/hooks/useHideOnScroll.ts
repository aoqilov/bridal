import { useEffect, useRef, useState, type RefObject } from 'react';

function findScrollableAncestor(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null;
  while (node) {
    const style = getComputedStyle(node);
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') return node;
    node = node.parentElement;
  }
  return null;
}

type Options = {
  threshold?: number;
  disabled?: boolean;
  scrollContainer?: HTMLElement | null;
};

export function useHideOnScroll(
  anchorRef: RefObject<HTMLElement | null>,
  options: Options = {},
): { hidden: boolean } {
  const { threshold = 200, disabled = false, scrollContainer } = options;
  const [rawHidden, setRawHidden] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const scrollEl = scrollContainer ?? findScrollableAncestor(anchorRef.current);
    if (!scrollEl) return;

    const check = () => {
      setRawHidden(scrollEl.scrollTop > threshold);
      rafId.current = null;
    };

    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(check);
    };

    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    check();

    return () => {
      scrollEl.removeEventListener('scroll', onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [anchorRef, threshold, scrollContainer]);

  return { hidden: !disabled && rawHidden };
}
