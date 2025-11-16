/**
 * Navigation type definitions
 */

import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Modal: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Monitor: undefined;
  Map: undefined;
  Reports: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

