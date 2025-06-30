import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { useNavigation, NavigationProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ContextMenu from "../Other/ContextMenu";
import {RootStackParamList} from "../../App"

type EmployeeDetail = {
    id: number;
    name: string;
    position: string;
    contribution: string;
};

export default function Employees() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [employeeData, setEmployeeData] = useState<EmployeeDetail[]>([]);
    const [filteredData, setFilteredData] = useState<EmployeeDetail[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [isContextVisible, setContextVisible] = useState(false);

    // Имитируем API-запрос для получения сотрудников
    useEffect(() => {
        setLoading(true);
        const fetchEmployeeData = () => {
            const mockData: EmployeeDetail[] = [
                { id: 1, name: 'Заторев Роман', position: 'Frontend Developer', contribution: 'Разработка UI' },
                { id: 2, name: 'Захаров Станислав', position: 'Frontend Developer', contribution: 'Разработка UI' },
                { id: 3, name: 'Захаров Станислав', position: 'Backend Developer', contribution: 'Подключение API и Реализация функциональной части' },
                { id: 4, name: 'Юлия', position: 'UI/UX Designer', contribution: 'Создание дизайна' },
            ];
            setEmployeeData(mockData);
            setFilteredData(mockData);
            setLoading(false);
        };

        fetchEmployeeData();
    }, []);

    const handleSearch = (text: string) => {
        setSearch(text);
        if (text) {
            const filtered = employeeData.filter((item) =>
                item.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(employeeData);
        }
    };

    const handleFilterSelect = (filter: string) => {
        console.log(`Выбран фильтр: ${filter}`);
        setFilterModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerTop}>
                <Text style={styles.title}>Сотрудники</Text>
                <View style={styles.iconContainer}>
                    <Icon name="bell-outline" size={24} color="#007bff" />
                    <Text style={styles.notificationCount}>25</Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Поиск сотрудника"
                    value={search}
                    onChangeText={handleSearch}
                    placeholderTextColor="#6c757d"
                />
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setFilterModalVisible(true)}
                >
                    <Icon name="filter-outline" size={24} color="#6c757d" />
                </TouchableOpacity>
            </View>
            <View style={styles.line} />

            {/* Employee List */}
            {isLoading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : filteredData.length ? (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {filteredData.map((employee) => (
                        <View key={employee.id} style={styles.employeeCard}>
                            <Text style={styles.employeeName}>{employee.name}</Text>
                            <Text style={styles.employeePosition}>{employee.position}</Text>
                            <Text style={styles.employeeContribution}>{employee.contribution}</Text>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <Text style={styles.error}>Сотрудники не найдены</Text>
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
        backgroundColor: '#f8f9fa',
    },
    scrollContainer: {
        paddingHorizontal: 16,
    },
    employeeCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    employeeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
    },
    employeePosition: {
        fontSize: 14,
        color: '#6c757d',
    },
    employeeContribution: {
        fontSize: 14,
        color: '#212529',
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#dcdcdc",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#212529",
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    notificationCount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#007bff",
        marginLeft: 4,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e9ecef",
        borderRadius: 8,
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#212529",
        paddingVertical: 8,
    },
    filterButton: {
        backgroundColor: '#E0E0E0',
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: "#dcdcdc",
    },
    error: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
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
        width: "100%",
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
