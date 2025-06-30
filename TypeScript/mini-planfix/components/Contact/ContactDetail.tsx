import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView, TouchableOpacity,
} from 'react-native';
import {useRoute, RouteProp, useNavigation, NavigationProp} from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ContextMenu from "../Other/ContextMenu";
import { RootStackParamList } from "../../App";

type RootStackParam = {
    ContactDetail: { id: string };
};

type ContactDetailProps = RouteProp<RootStackParam, 'ContactDetail'>;

type ContactInfo = {
    id: string;
    name: string;
    midname: string;
    lastname: string;
    description: string;
    email: string;
};

export default function ContactDetail() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<ContactDetailProps>();
    const { id } = route.params;

    const [contact, setContact] = useState<ContactInfo | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [isContextVisible, setContextVisible] = useState(false);

    const API_URL = '';
    const BEARER_TOKEN = '';

    useEffect(() => {
        const fetchContactDetail = async () => {
            try {
                setLoading(true);

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                    },
                    body: JSON.stringify({
                        offset: 0,
                        pageSize: 100,
                        fields: "id,name,midname,lastname,description,email",
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP! статус: ${response.status}`);
                }

                const data = await response.json();

                if (!data.contacts || !Array.isArray(data.contacts)) {
                    throw new Error('Неверный ответ API: контакты не найдены');
                }

                const contactDetail = data.contacts.find((contact: any) => contact.id.toString() === id);

                if (contactDetail) {
                    const formattedContact: ContactInfo = {
                        id: contactDetail.id.toString(),
                        name: contactDetail.name,
                        midname: contactDetail.midname || '',
                        lastname: contactDetail.lastname || '',
                        description: contactDetail.description || '',
                        email: contactDetail.email || '',
                    };

                    setContact(formattedContact);
                } else {
                    setContact(null);
                }
            } catch (error) {
                console.error('Ошибка при получении контактных данных:', error);
                setContact(null);
            } finally {
                setLoading(false);
            }
        };

        fetchContactDetail();
    }, [id]);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : contact ? (
                <ScrollView>
                    <View style={styles.card}>
                        <Text style={styles.title}>
                            {contact.name} {contact.midname} {contact.lastname}
                        </Text>
                        <Text style={styles.subtitle}>Description:</Text>
                        <Text style={styles.text}>{contact.description || 'Описание отсутствует'}</Text>
                        <Text style={styles.subtitle}>Email:</Text>
                        <Text style={styles.text}>{contact.email || 'Адрес электронной почты не указан'}</Text>
                    </View>
                </ScrollView>
            ) : (
                <Text style={styles.error}>Contact details not found</Text>
            )}
            {/* Navigation Bar */}
            <View style={styles.navbar}>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="bookmark-outline" size={24} color="#ffffff" />
                    <Text style={styles.navText}>Хроника</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="calendar-outline" size={24} color="#ffffff" />
                    <Text style={styles.navText}>Планировщик</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.navItem, styles.activeNavItem]}
                    onPress={() => navigation.navigate('Tasks')}
                >
                    <View style={styles.activeNavItemContainer}>
                        <Icon name="file-document-outline" size={24} color="#ffffff" />
                        <Text style={styles.activeNavText}>Задачи</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => setContextVisible(!isContextVisible)}>
                    <Icon name={isContextVisible ? 'close' : 'dots-horizontal'} size={24} color="#ffffff" />
                    <Text style={styles.navText}>{isContextVisible ? 'Закрыть' : 'Еще'}</Text>
                </TouchableOpacity>
                <ContextMenu
                    visible={isContextVisible}
                    onClose={() => setContextVisible(false)}
                    onContactsPress={() => navigation.navigate('Contacts')}
                    onEmployeesPress={() => navigation.navigate('Employees')}
                    onCancelPress={() => setContextVisible(false)}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa'
    },
    card: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        elevation: 2
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#007bff'
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        color: '#212529'
    },
    text: {
        fontSize: 14,
        marginTop: 8,
        color: '#6c757d'
    },
    error: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20
    },
    navbar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#121212",
        paddingVertical: 12,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    navText: {
        fontSize: 12,
        color: "#ffffff",
        marginTop: 4,
    },
    activeNavItem: {
        borderRadius: 20,
        backgroundColor: "#007bff",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    activeNavItemContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    activeNavText: {
        fontSize: 12,
        color: "#ffffff",
        marginTop: 4,
    },
});
