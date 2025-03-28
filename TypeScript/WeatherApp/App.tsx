import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import axios from 'axios';
import { WEATHER_API } from '@env';

interface WeatherData {
    main: {
        temp: number;
    };
    weather: {
        description: string;
    }[];
    name: string;
}

const App = () => {
    const [city, setCity] = useState<string>('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const fadeAnim = useState(new Animated.Value(0))[0];

    const fetchWeather = async () => {
        if (!city.trim()) {
            Alert.alert('Ошибка', 'Введите название города');
            return;
        }

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API}&units=metric&lang=ru`
            );
            setWeather(response.data);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } catch (error) {
            Alert.alert('Ошибка', 'Город не найден или проблема с подключением');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Погода</Text>

            <TextInput
                style={styles.input}
                placeholder="Введите город"
                value={city}
                onChangeText={setCity}
            />

            <TouchableOpacity style={styles.button} onPress={fetchWeather}>
                <Text style={styles.buttonText}>Узнать погоду</Text>
            </TouchableOpacity>

            {weather && (
                <Animated.View style={[styles.weatherContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.weatherText}>Город: {weather.name}</Text>
                    <Text style={styles.weatherText}>Температура: {weather.main.temp}°C</Text>
                    <Text style={styles.weatherText}>Описание: {weather.weather[0].description}</Text>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#87CEEB',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#FFA500',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    weatherContainer: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 20,
        borderRadius: 10,
    },
    weatherText: {
        fontSize: 18,
        marginVertical: 5,
        color: '#333',
    },
});

export default App;
