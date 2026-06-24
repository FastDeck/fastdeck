import { LazyProvider } from '@providers';
import { lazy } from 'react';

// Dashboard screen
const DashboardPage = lazy(() => import('@screens/dashboard/Dashboard'));

export const LazyDashboardPage = () => (
  <LazyProvider>
    <DashboardPage />
  </LazyProvider>
);

// DeckConfigurator screen
const DeckConfiguratorPage = lazy(() => import('@screens/deck-configurator/DeckConfigurator').then(module => ({ default: module.DeckConfigurator })));

export const LazyDeckConfiguratorPage = () => (
  <LazyProvider>
    <DeckConfiguratorPage />
  </LazyProvider>
);

// MultiActionEditor screen
const MultiActionEditorPage = lazy(() => import('@screens/multi-action-editor/MultiActionEditor').then(module => ({ default: module.MultiActionEditor })));

export const LazyMultiActionEditorPage = () => (
  <LazyProvider>
    <MultiActionEditorPage />
  </LazyProvider>
);

// PluginsMarketplace screen
const PluginsMarketplacePage = lazy(() => import('@screens/plugins/PluginsMarketplace').then(module => ({ default: module.PluginsMarketplace })));

export const LazyPluginsMarketplacePage = () => (
  <LazyProvider>
    <PluginsMarketplacePage />
  </LazyProvider>
);

// ProfilesAndDevices screen
const ProfilesAndDevicesPage = lazy(() => import('@screens/profiles/ProfilesAndDevices').then(module => ({ default: module.ProfilesAndDevices })));

export const LazyProfilesAndDevicesPage = () => (
  <LazyProvider>
    <ProfilesAndDevicesPage />
  </LazyProvider>
);
