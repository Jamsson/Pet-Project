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
import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ContextMenu from '../Other/ContextMenu';
import FilterModal from "../Other/FilterModal";
import { RootStackParamList } from '../../App';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

type TaskDetail = {
  id: number;
  name: string;
  description: string;
};

export default function TaskDetail({ route }: { route: DetailScreenRouteProp }) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { userId } = route.params;

  // States
  const [userData, setUserData] = useState<TaskDetail[]>([]);
  const [filteredData, setFilteredData] = useState<TaskDetail[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isContextVisible, setContextVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const bearerToken = '';
  const url = '';

  const body = {
    offset: 0,
    pageSize: 100,
    fields: 'id,name,description,status',
    sourceId: '797f5a94-3689-4ac8-82fd-d749511ea2b2',
  };

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        console.log('Запрос к API...');
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        console.log('Ответ от API:', json);

        if (json.tasks) {
          const formattedTasks = json.tasks.map((task: any) => ({
            id: task.id,
            name: task.name || 'Имя не указано',
            description: task.description || '<p>Описание отсутствует</p>',
          }));
          setUserData(formattedTasks);
        } else {
          console.log('Задачи не найдены');
        }
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, []);
  const selectedTask = userData.find((task) => task.id === Number(userId));

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const filtered = userData.filter((item) =>
          item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(userData);
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
          <Text style={styles.title}>Задачи</Text>
          <View style={styles.iconContainer}>
            <Icon name="bell-outline" size={24} color="#007bff" />
            <Text style={styles.notificationCount}>25</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
              style={styles.searchInput}
              placeholder="Поиск"
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
        <View style={styles.line}/>

        {/* Tasks */}
        {isLoading ? (
            <ActivityIndicator size="large" color="#007bff" />
        ) : selectedTask ? (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.taskDetails}>
                <Text style={styles.header}>Название: {selectedTask.name}</Text>
                <RenderHtml
                    contentWidth={300}
                    source={{ html: selectedTask.description }}
                    tagsStyles={htmlStyles}
                />
              </View>
            </ScrollView>
        ) : (
            <Text style={styles.error}>Задача не найдена</Text>
        )}

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab}>
          <Icon name="plus" size={28} color="#fff" />
        </TouchableOpacity>

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
        {/* Filter Modal */}
        <FilterModal
            isVisible={filterModalVisible}
            onClose={() => setFilterModalVisible(false)}
            onFilterSelect={handleFilterSelect}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskDetails: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
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
  line: {
    flexDirection: "row",
    alignItems: "center",
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
  error: {
    fontSize: 16,
    color: 'red',
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 10,
    width: 56,
    height: 56,
    backgroundColor: "#007bff",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
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

const htmlStyles = { p: { fontSize: 16, color: '#212529' } };