import {
  Navigate,
  Route,
  createHashRouter,
  createRoutesFromChildren,
} from 'react-router-dom';
import { LazyDeckConfiguratorPage, LazyMultiActionEditorPage, LazyPluginsMarketplacePage, LazyProfilesAndDevicesPage } from './lazyScreens/publicScreens';

export const getAppRouter = () => {
  return createHashRouter(
    createRoutesFromChildren(
      <>
        <Route path="/" element={<LazyDeckConfiguratorPage />} />
        <Route path="/multi-action-editor" element={<LazyMultiActionEditorPage />} />
        <Route path="/plugins" element={<LazyPluginsMarketplacePage />} />
        <Route path="/profiles" element={<LazyProfilesAndDevicesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </>,
    ),
  );
};

