import { useLayoutEffect, useState } from 'react';

/**
 * Detects light/dark mode from the root `.dark` class (Tailwind / shadcn convention).
 * Replaces Mantine's useMantineColorScheme for striped row hover colors.
 */
export function useMRTColorScheme(): 'dark' | 'light' {
  const [scheme, setScheme] = useState<'dark' | 'light'>(() =>
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',
  );

  useLayoutEffect(() => {
    const root = document.documentElement;
    const obs = new MutationObserver(() => {
      setScheme(root.classList.contains('dark') ? 'dark' : 'light');
    });
    obs.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  return scheme;
}
