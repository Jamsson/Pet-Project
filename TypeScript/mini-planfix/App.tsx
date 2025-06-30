import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskDetail from './components/Task/TaskDetail';
import TaskScreen from './components/Task/Tasks';
import Employees from "./components/Contact/Employees";
import Contacts from "./components/Contact/Contacts";
import ContactDetail from "./components/Contact/ContactDetail";

export type RootStackParamList = {
  Tasks: undefined;
  TaskDetail: { userId: string; };
  Employees: undefined;
  Contacts: undefined;
    ContactDetail: { id: string; };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Tasks" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tasks" component={TaskScreen}/>
            <Stack.Screen name="TaskDetail" component={TaskDetail}/>
            <Stack.Screen name="Employees" component={Employees}/>
            <Stack.Screen name="Contacts" component={Contacts}/>
            <Stack.Screen name="ContactDetail" component={ContactDetail}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}
