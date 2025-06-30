import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import FilterModal from "../Other/FilterModal";
import { exportTaskAsDocx } from "../Other/DocxExporter";
import TaskMenu from "./TaskMenu";
import ContextMenu from "../Other/ContextMenu";
import FavoriteButton from '../Other/FavoriteButton';

type Task = {
  id: string;
  name: string;
  project?: string;
  description?: string;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function TaskScreen() {

  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<Task[]>([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Все");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isContextVisible, setContextVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [editedTaskName, setEditedTaskName] = useState("");
  const [editedTaskDescription, setEditedTaskDescription] = useState('');
  const [editedTaskProject, setEditedTaskProject] = useState('');
  const navigation = useNavigation<NavigationProps>();

  const bearerToken = "";
  const url = "";
  const requestMethod = "POST";

  const getDataFromServer = async () => {
    const body = {
      offset: 0,
      pageSize: 100,
      fields: "id,name,description",
      sourceId: "797f5a94-3689-4ac8-82fd-d749511ea2b2",
    };

    try {
      const options: any = {
        method: requestMethod,
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      };

      if (requestMethod === "POST") {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      let tasks = [];
      if (json.tasks && Array.isArray(json.tasks)) {
        tasks = json.tasks.map((task: any) => ({
          id: task.id || "",
          name: task.name || "Имя отсутствует",
          project: task.project || "Без проекта",
          description: task.description || '<p>Описание отсутствует</p>',
        }));
      } else {
        console.warn("Непредвиденная структура данных:", json);
      }

      setData(tasks);
      setFilteredData(tasks);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataFromServer();
  }, []);

  const handleTabPress = (tab: string) => {
    if (tab === activeTab) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setActiveTab(tab);
      setSortDirection("asc");
    }

    let sortedData = [...data];

    if (tab === "Название") {
      sortedData.sort((a, b) =>
          sortDirection === "asc"
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name)
      );
    } else if (tab === "Проект") {
      sortedData.sort((a, b) =>
          sortDirection === "asc"
              ? (a.project || "").localeCompare(b.project || "")
              : (b.project || "").localeCompare(a.project || "")
      );
    } else if (tab === "Постановщик") {
      sortedData.sort((a, b) => {
        if (sortDirection === "asc") {
          return a.id > b.id ? 1 : -1;
        } else {
          return a.id < b.id ? 1 : -1;
        }
      });
    } else {
      sortedData = [...data];
    }

    setFilteredData(sortedData);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleFilterSelect = (filter: string) => {
    console.log(`Выбран фильтр: ${filter}`);
    setFilterModalVisible(false);
  };
  const handleDotsPress = (task: Task) => {
    setSelectedTask(task);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedTask(null);
  };
  const deleteTask = () => {
    if (selectedTask) {
      setData((prevData) => prevData.filter((task) => task.id !== selectedTask.id));
      setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((task) => task.id !== selectedTask.id)
      );
      closeMenu();
    }
  };
  const saveTask = (newName: string) => {
    if (selectedTask && newName.trim()) {
      setData((prevData) =>
          prevData.map((task) =>
              task.id === selectedTask.id ? { ...task, name: newName } : task
          )
      );
      setFilteredData((prevFilteredData) =>
          prevFilteredData.map((task) =>
              task.id === selectedTask.id ? { ...task, name: newName } : task
          )
      );
    }
  };
  const saveDescription = (newDescription: string) => {
    if (selectedTask && newDescription.trim()) {
      setData((prevData) =>
          prevData.map((task) =>
              task.id === selectedTask.id ? { ...task, description: newDescription } : task
          )
      );
      setFilteredData((prevFilteredData) =>
          prevFilteredData.map((task) =>
              task.id === selectedTask.id ? { ...task, description: newDescription } : task
          )
      );
    }
  };
  const saveProject = (newProject: string) => {
    if (selectedTask && newProject.trim()) {
      setData((prevData) =>
          prevData.map((task) =>
              task.id === selectedTask.id ? { ...task, project: newProject } : task
          )
      );
      setFilteredData((prevFilteredData) =>
          prevFilteredData.map((task) =>
              task.id === selectedTask.id ? { ...task, project: newProject } : task
          )
      );
    }
  };
  const toggleMenu = () => {
    setContextVisible(!isContextVisible);
  };

  const handleContactsPress = () => {
    console.log("Контакты button pressed");
    navigation.navigate('Contacts');
    setContextVisible(false);
  };

  const handleEmployeesPress = () => {
    console.log("Сотрудники button pressed");
    navigation.navigate('Employees');
    setContextVisible(false);
  };
  const handleCancelPress = () => {
    console.log("Cancel button pressed");
    setContextVisible(false);
  };

  const renderTask = ({ item }: { item: Task }) => (
      <View style={styles.taskItem}>
        {/* Детали задачи */}
        <TouchableOpacity
            style={styles.taskDetails}
            onPress={() => {
              navigation.navigate('TaskDetail', { userId: item.id });
            }}
        >
          <Text style={styles.taskName}>{item.name}</Text>
          <Text style={styles.taskProject}>{item.project || 'Без проекта'}</Text>
        </TouchableOpacity>

        {/* Действия с задачей */}
        <View style={styles.taskActions}>
          {/* Звезда */}
          <View style={styles.container}>
            <FavoriteButton item={{ name: 'Пример сотрудника' }} />
          </View>

          {/* Облако */}
          <TouchableOpacity
              onPress={() =>
                  exportTaskAsDocx({
                    name: item.name,
                    project: item.project,
                    description: item.description || "Описание отсутствует",
                  })
              }
              style={{ marginLeft: 16 }}
          >
            <Icon name="cloud-download-outline" size={24} color="#007bff" />
          </TouchableOpacity>

          {/* Точки */}
          <TouchableOpacity
              onPress={() => handleDotsPress(item)}
              style={{ marginLeft: 16 }}
          >
            <Icon name="dots-horizontal" size={24} color="#6c757d" />
          </TouchableOpacity>

        </View>
      </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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

      {/* Tab Selector */}
      <View style={styles.container}>
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handleTabPress("Все")}
          >
            <Text style={activeTab === "Все" ? styles.activeTab : styles.inactiveTab}>
              Все
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handleTabPress("Название")}
          >
            <View style={styles.tabWithIcon}>
              <Text
                  style={activeTab === "Название" ? styles.activeTab : styles.inactiveTab}
              >
                Название
              </Text>
              {activeTab === "Название" && (
                  <Icon
                      name={sortDirection === "asc" ? "arrow-up" : "arrow-down"}
                      size={16}
                      color={styles.activeTab.color}
                      style={styles.icon}
                  />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handleTabPress("Проект")}
          >
            <View style={styles.tabWithIcon}>
              <Text style={activeTab === "Проект" ? styles.activeTab : styles.inactiveTab}>
                Проект
              </Text>
              {activeTab === "Проект" && (
                  <Icon
                      name={sortDirection === "asc" ? "arrow-up" : "arrow-down"}
                      size={16}
                      color={styles.activeTab.color}
                      style={styles.icon}
                  />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.tabButton}
              onPress={() => handleTabPress("Постановщик")}
          >
            <View style={styles.tabWithIcon}>
              <Text
                  style={
                    activeTab === "Постановщик" ? styles.activeTab : styles.inactiveTab
                  }
              >
                Постановщик
              </Text>
              {activeTab === "Постановщик" && (
                  <Icon
                      name={sortDirection === "asc" ? "arrow-up" : "arrow-down"}
                      size={16}
                      color={styles.activeTab.color}
                      style={styles.icon}
                  />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
            data={filteredData}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
        />

        <TaskMenu
            isVisible={isMenuVisible}
            selectedTask={selectedTask}
            onClose={closeMenu}
            onEdit={(newName, newDescription, newProject) => {
              saveTask(newName);
              saveDescription(newDescription);
              saveProject(newProject);
              closeMenu();
            }}
            onDelete={() => {
              deleteTask();
              closeMenu();
            }}
            isEditMode={isEditMode}
            setEditMode={setEditMode}
            editedTaskName={editedTaskName}
            setEditedTaskName={setEditedTaskName}
            editedTaskDescription={editedTaskDescription}
            setEditedTaskDescription={setEditedTaskDescription}
            editedTaskProject={editedTaskProject}
            setEditedTaskProject={setEditedTaskProject}
        />

        <FilterModal
            isVisible={isFilterModalVisible}
            onClose={() => setFilterModalVisible(false)}
            onFilterSelect={handleFilterSelect}
        />
      </View>

      <TouchableOpacity style={styles.fab}>
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="bookmark-outline" size={24} color="#ffffff" />
          <Text style={styles.navText}>Хроника</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="calendar-outline" size={24} color="#ffffff" />
          <Text style={styles.navText}>Планировщик</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <View style={styles.activeNavItemContainer}>
            <Icon name="file-document-outline" size={24} color="#ffffff" />
            <Text style={styles.activeNavText}>Задачи</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={toggleMenu}>
          <Icon
              name={isContextVisible ? "close" : "dots-horizontal"}
              size={24}
              color="#ffffff"
          />
          <Text style={styles.navText}>{isContextVisible ? "Закрыть" : "Еще"}</Text>
        </TouchableOpacity>

      <ContextMenu
          visible={isContextVisible}
          onClose={toggleMenu}
          onContactsPress={handleContactsPress}
          onEmployeesPress={handleEmployeesPress}
          onCancelPress={handleCancelPress}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
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
  filterButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dcdcdc",
    paddingLeft: 35,
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  tabWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 4,
  },
  activeTab: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  inactiveTab: {
    fontSize: 16,
    color: "#6c757d",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#212529",
    paddingVertical: 8,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskDetails: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212529",
  },
  taskProject: {
    fontSize: 14,
    color: "#6c757d",
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#6c757d",
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 16,
    color: "#000",
  },
  subcategoryList: {
    paddingLeft: 16,
    paddingTop: 8,
  },
  subcategoryItem: {
    fontSize: 14,
    color: "#6c757d",
    paddingVertical: 4,
  },
});