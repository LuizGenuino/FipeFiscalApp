import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "./Login";
import SearchTeamScreen from "./SearchTeam";
import RegisterScoreScreen from "./RegisterScore";

export type RootStackParamList = {
  Login: undefined;
  SearchTeam: undefined;
  RegisterScore: { team: Team };
};

export interface Team {
  id: string;
  name: string;
  code: string;
}

export interface FishRecord {
  species: string;
  size: string;
  ticketNumber: string;
  teamMember: string;
  fishPhoto: string;
  ticketPhoto: string;
  releaseVideo: string;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SearchTeam" 
          component={SearchTeamScreen}
          options={{ title: 'Buscar Time' }}
        />
        <Stack.Screen 
          name="RegisterScore" 
          component={RegisterScoreScreen}
          options={{ title: 'Registrar Pontuação' }}
        />
      </Stack.Navigator>
  );
}