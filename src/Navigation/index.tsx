import React from 'react'
import { NavigationContainer} from '@react-navigation/native';
import AuthStackScreen from './AuthStack';
import { navigationRef } from './rootNavigation';

const Routes = ():JSX.Element => {

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthStackScreen />
    </NavigationContainer>
  )
}

export default Routes
