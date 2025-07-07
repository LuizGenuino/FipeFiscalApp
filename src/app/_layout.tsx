// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="SearchTeam" options={{ title: "Buscar Time" }} />
      <Stack.Screen name="RegisterScore" options={{ title: "Registrar Pontuação" }} />
    </Stack>
  );
}
