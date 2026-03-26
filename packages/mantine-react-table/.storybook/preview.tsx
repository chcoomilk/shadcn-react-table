import React, { useEffect, useState } from 'react';
import { Preview } from '@storybook/react';

import '../src/globals.css';

const PRIMARY_BY_NAME: Record<string, string> = {
  blue: 'hsl(221.2 83.2% 53.3%)',
  cyan: 'hsl(188.7 94.5% 42.7%)',
  dark: 'hsl(0 0% 25%)',
  grape: 'hsl(302 59% 45%)',
  gray: 'hsl(220 9% 46%)',
  green: 'hsl(142 71% 45%)',
  indigo: 'hsl(239 84% 67%)',
  lime: 'hsl(81 85% 43%)',
  orange: 'hsl(24 94% 53%)',
  pink: 'hsl(330 81% 60%)',
  red: 'hsl(0 72% 51%)',
  teal: 'hsl(173 58% 39%)',
  violet: 'hsl(263 70% 50%)',
  yellow: 'hsl(45 93% 47%)',
};

/**
 * Sync with storybook-dark-mode without `useDarkMode()` from that package — it uses
 * `useState`/`useEffect` from `@storybook/preview-api`, which may only run in the
 * decorator callback / story (Storybook 8). Nested components are not valid and throw:
 * "Storybook preview hooks can only be called inside decorators and story functions."
 */
function useIframeDarkClass(): boolean {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.body.classList.contains('dark');
  });

  useEffect(() => {
    const body = document.body;
    const sync = () => setIsDark(body.classList.contains('dark'));
    const obs = new MutationObserver(sync);
    obs.observe(body, { attributes: true, attributeFilter: ['class'] });
    sync();
    return () => obs.disconnect();
  }, []);

  return isDark;
}

function StorybookChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDark = useIframeDarkClass();
  const [primaryColor, setPrimaryColor] = useState('blue');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    const sbRoot = document.getElementsByClassName(
      'sb-show-main',
    )[0] as HTMLElement | undefined;
    if (sbRoot) {
      sbRoot.style.backgroundColor = isDark ? '#333' : '#fff';
    }
  }, [isDark]);

  useEffect(() => {
    const hsl = PRIMARY_BY_NAME[primaryColor] ?? PRIMARY_BY_NAME.blue;
    document.documentElement.style.setProperty('--primary', hsl);
  }, [primaryColor]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') return;
    const script = document.createElement('script');
    script.src = 'https://plausible.io/js/script.js';
    script.setAttribute('data-domain', 'mantine-react-table.dev');
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const muted = isDark ? '#e5e5e5' : '#666';

  return (
    <div className="flex min-h-screen flex-col gap-4 p-4 text-sm">
      <div className="flex flex-shrink-0 flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div className="max-w-xl space-y-2" style={{ color: muted }}>
          <p>
            Looking for the main docs site? Click{' '}
            <a
              className="text-primary underline"
              href="https://www.mantine-react-table.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              here
            </a>
            .
          </p>
          <p>
            View source in the story tab on Canvas or the Show Code button in
            Docs. Toggle light/dark mode with the Storybook toolbar.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium text-foreground" htmlFor="mrt-primary">
            Primary (CSS --primary)
          </label>
          <select
            className="rounded-md border border-input bg-background px-2 py-1.5 text-foreground"
            id="mrt-primary"
            onChange={(e) => setPrimaryColor(e.target.value)}
            value={primaryColor}
          >
            {Object.keys(PRIMARY_BY_NAME).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="min-h-0 w-full min-w-0 flex-1 overflow-auto pb-6">
        {children}
      </div>
    </div>
  );
}

const preview: Preview = {
  parameters: {
    /** Required so storybook-dark-mode applies light/dark classes to the preview iframe body */
    darkMode: {
      stylePreview: true,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <StorybookChrome>
        <Story />
      </StorybookChrome>
    ),
  ],
};

export default preview;
