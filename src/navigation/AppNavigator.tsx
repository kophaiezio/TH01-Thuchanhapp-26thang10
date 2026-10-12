import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AppProvider} from '../context/AppContext';
import BottomTabNavigator from './BottomTabNavigator';

function AppNavigator(): React.JSX.Element {
  return (
    <AppProvider>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}

export default AppNavigator;
