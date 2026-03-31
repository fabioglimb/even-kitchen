import { DrawerShell } from 'even-toolkit/web';
import type { SideDrawerItem } from 'even-toolkit/web';

const MENU_ITEMS: SideDrawerItem[] = [
  { id: '/', label: 'Recipes', section: 'Kitchen' },
];

const BOTTOM_ITEMS: SideDrawerItem[] = [
  { id: '/settings', label: 'Settings', section: 'App' },
];

function getPageTitle(pathname: string): string {
  if (pathname === '/') return 'ER Kitchen';
  if (pathname === '/recipe/new') return 'New Recipe';
  if (pathname.includes('/edit')) return 'Edit Recipe';
  if (pathname.includes('/cook')) return 'Cooking';
  if (pathname.includes('/complete')) return 'Complete';
  if (pathname.startsWith('/recipe/')) return 'Recipe';
  if (pathname === '/settings') return 'Settings';
  return 'Kitchen';
}

function deriveActiveId(pathname: string): string {
  if (pathname === '/') return '/';
  if (pathname === '/recipe/new') return '/recipe/new';
  if (pathname === '/settings') return '/settings';
  return '/';
}

function getBackPath(pathname: string): string {
  if (pathname.includes('/complete')) {
    const id = pathname.split('/')[2];
    return `/recipe/${id}`;
  }
  if (pathname.includes('/cook')) {
    const id = pathname.split('/')[2];
    return `/recipe/${id}`;
  }
  return '/';
}

export function Shell() {
  return (
    <DrawerShell
      items={MENU_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      title="ER Kitchen"
      getPageTitle={getPageTitle}
      deriveActiveId={deriveActiveId}
      getBackPath={getBackPath}
    />
  );
}
