import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

export function useDebouncedValue<T>(value: T, wait: number): [T] {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), wait);
    return () => window.clearTimeout(id);
  }, [value, wait]);
  return [debounced];
}

export function useMediaQuery(query: string, initialValue = false): boolean {
  const [matches, setMatches] = useState(initialValue);
  useLayoutEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function useDirection(): { dir: 'ltr' | 'rtl' } {
  const [dir, setDir] = useState<'ltr' | 'rtl'>(() => {
    if (typeof document === 'undefined') return 'ltr';
    const d = document.documentElement.getAttribute('dir');
    return d === 'rtl' ? 'rtl' : 'ltr';
  });
  useLayoutEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      const d = el.getAttribute('dir');
      setDir(d === 'rtl' ? 'rtl' : 'ltr');
    });
    obs.observe(el, { attributes: true, attributeFilter: ['dir'] });
    return () => obs.disconnect();
  }, []);
  return { dir };
}

export function useHover<T extends HTMLElement = HTMLElement>(): [
  (node: T | null) => void,
  boolean,
] {
  const [hovered, setHovered] = useState(false);
  const [node, setNode] = useState<T | null>(null);
  useLayoutEffect(() => {
    if (!node) return;
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    node.addEventListener('mouseenter', enter);
    node.addEventListener('mouseleave', leave);
    return () => {
      node.removeEventListener('mouseenter', enter);
      node.removeEventListener('mouseleave', leave);
    };
  }, [node]);
  return [setNode, hovered];
}

export function useControllableState<T>({
  defaultProp,
  onChange,
  prop,
}: {
  defaultProp?: T;
  onChange?: (next: T) => void;
  prop?: T;
}): [T, Dispatch<SetStateAction<T>>] {
  const [uncontrolled, setUncontrolled] = useState(defaultProp as T);
  const isControlled = prop !== undefined;
  const value = isControlled ? (prop as T) : uncontrolled;
  const setValue: Dispatch<SetStateAction<T>> = (next) => {
    const resolved =
      typeof next === 'function' ? (next as (p: T) => T)(value) : next;
    if (!isControlled) setUncontrolled(resolved);
    onChange?.(resolved);
  };
  return [value, setValue];
}
