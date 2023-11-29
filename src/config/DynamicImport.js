import React from 'react';
import PageDown from '../content/PageDown';

const dynamicImportMap = {
  BifastDashboard: () => import('gritbifastmodule/BifastDashboard'),
  MicroFrontendComponent: () => import('gritswiftmodule/MicroFrontendComponent'),
  AllServerDashboard: () => import('gritsmartinmodule/AllServerDashboard'),
  SmartinEndpoints: () => import('gritsmartinmodule/SmartinEndpoints'),
  // Tambahkan lebih banyak mapping sesuai kebutuhan
};

export const DynamicLazyImport = (moduleName, componentName) => {
  const importFn = dynamicImportMap[componentName];
  if (!importFn) {
    console.warn(`No dynamic import found for: ${componentName}`);
    return PageDown;
  }
  return React.lazy(() =>
    importFn().catch(() => {
      console.error(`Error loading the component: ${componentName}`);
      return { default: PageDown };
    })
  );
};
