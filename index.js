/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';
import AppErrorBoundary from './src/Components/AppErrorBoundary';
import { name as appName } from './app.json';

const AppWithErrorBoundary = () => (
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);

AppRegistry.registerComponent(appName, () => AppWithErrorBoundary);
