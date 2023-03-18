import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const HomeScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Button 
                    title="Profile"
                    onPress={ () =>
                        navigation.navigate('User', {userName: 'Jane'})
                    }
                />
                <Button
                    title="Alert"
                    onPress= { () => { alert("I am pressed") } }
                />
            </View>
        </View>
    );
};

const UserScreen = ({navigation, route}) => {
    return (
        <View style={styles.container}>
            <Text>Welcome {route.params.userName} </Text>
            <Button 
                title="Go Back"
                onPress={ () => navigation.goBack() }
            />
        </View>
    )
}

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{
                        title: 'Ionic Habits',
                        headerStyle: {
                            backgroundColor: '#323232',
                        },
                        headerTitleStyle: {
                            color: 'cyan',
                            fontWeight: 'bold',
                            fontSize: 25,
                        }
                    }}
                />
                <Stack.Screen 
                    name="User" 
                    component={UserScreen} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#606060'
    },
    topBar: {
        backgroundColor: '#323232',
        height: 80,
        paddingTop: 30,
        paddingHorizontal: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'cyan'
    },
    content: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
});
