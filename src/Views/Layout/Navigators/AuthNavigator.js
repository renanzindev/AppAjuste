import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {LoginView} from '../../Pages/LoginView';

const AuthStack = createStackNavigator();

export function AuthNavigator() {
  return (
    <AuthStack.Navigator
      presentation="modal"
      screenOptions={{headerShown: false, animationEnabled: false}}>
      <AuthStack.Screen name="LoginView" component={LoginView} />
    </AuthStack.Navigator>
  );
}
