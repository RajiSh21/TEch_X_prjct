/**
 * Placement Portal Mobile App
 * Main Application Component
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import PlacementsScreen from './src/screens/PlacementsScreen';
import InternshipsScreen from './src/screens/InternshipsScreen';
import ScrapeScreen from './src/screens/ScrapeScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Placements') {
              iconName = 'work';
            } else if (route.name === 'Internships') {
              iconName = 'school';
            } else if (route.name === 'Scrape') {
              iconName = 'search';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#667eea',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{title: '🎓 Placement Portal'}}
        />
        <Tab.Screen
          name="Placements"
          component={PlacementsScreen}
          options={{title: 'Placements'}}
        />
        <Tab.Screen
          name="Internships"
          component={InternshipsScreen}
          options={{title: 'Internships'}}
        />
        <Tab.Screen
          name="Scrape"
          component={ScrapeScreen}
          options={{title: 'Scrape Jobs'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
