import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AppDataProvider} from '../context/AppDataContext';
import {SyncProvider} from '../context/SyncContext';
import BottomTabNavigator from './BottomTabNavigator';

function AppNavigator(): React.JSX.Element {
  return (
    <SyncProvider>
      <AppDataProvider>
        <NavigationContainer>
          <BottomTabNavigator />
        </NavigationContainer>
      </AppDataProvider>
    </SyncProvider>
  );
}

export default AppNavigator;
