 import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

const calculateFontSize = (baseSize: number) => {
    return Math.round(baseSize * (width / 375));
};

type FilterModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onFilterSelect: (filter: string) => void;
};

const FilterModal: React.FC<FilterModalProps> = ({
                                                     isVisible,
                                                     onClose,
                                                     onFilterSelect,
                                                 }) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const categories = [
        {
            id: "1",
            title: "Все",
            color: "#6c757d",
            subcategories: [
                { id: "1-1", name: "Все", color: "#6c757d" },
                { id: "1-2", name: "Новая", color: "#007bff" },
                { id: "1-3", name: "В работе", color: "#28a745" },
                { id: "1-4", name: "Выполненная", color: "#ffc107" },
                { id: "1-5", name: "Черновик", color: "#dc3545" },
                { id: "1-6", name: "Завершенная", color: "#6c757d" },
                { id: "1-7", name: "Отмененная", color: "#6c757d" },
            ],
        },
        {
            id: "2",
            title: "Входящие",
            color: "#6c757d",
            subcategories: [
                { id: "2-1", name: "Входящие", color: "#6c757d" },
                { id: "2-2", name: "Новая", color: "#007bff" },
                { id: "2-3", name: "В работе", color: "#28a745" },
            ] },
        {
            id: "3",
            title: "Исходящие",
            color: "#6c757d",
            subcategories: [
                { id: "3-1", name: "Исходящие", color: "#6c757d" },
                { id: "3-2", name: "Новая", color: "#007bff" },
                { id: "3-3", name: "В работе", color: "#28a745" },
            ] },
        { id: "4", title: "Аудируемые", color: "#6c757d", subcategories: [] },
        { id: "5", title: "Избранное", color: "#6c757d", subcategories: [] },
    ];

    const getFilteredCategories = () => {
        if (!search) return categories;

        return categories
            .map((category) => {
                const filteredSubcategories = category.subcategories.filter((sub) =>
                    sub.name.toLowerCase().includes(search.toLowerCase())
                );

                if (
                    category.title.toLowerCase().includes(search.toLowerCase()) ||
                    filteredSubcategories.length > 0
                ) {
                    return {
                        ...category,
                        subcategories: filteredSubcategories,
                    };
                }
                return null;
            })
            .filter((category) => category !== null) as typeof categories;
    };

    const toggleCategory = (id: string) => {
        setExpandedCategory((prev) => (prev === id ? null : id));
    };

    const renderCategory = ({ item }: { item: typeof categories[0] }) => (
        <View>
            <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => toggleCategory(item.id)}
            >
                <View style={styles.categoryHeader}>
                    <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
                    <Text style={[styles.categoryText, { fontSize: calculateFontSize(16) }]}>
                        {item.title}
                    </Text>
                    {item.subcategories && item.subcategories.length > 0 && (
                        <Icon
                            name={
                                expandedCategory === item.id ? "chevron-up" : "chevron-down"
                            }
                            size={24}
                            color="#6c757d"
                        />
                    )}
                </View>
            </TouchableOpacity>
            {expandedCategory === item.id &&
                item.subcategories &&
                item.subcategories.length > 0 && (
                    <View style={styles.subcategoryList}>
                        {item.subcategories.map((sub) => (
                            <TouchableOpacity
                                key={sub.id}
                                onPress={() => onFilterSelect(sub.name)}
                                style={styles.subcategoryItemContainer}
                            >
                                <View
                                    style={[styles.colorCircle, { backgroundColor: sub.color }]}
                                />
                                <Text
                                    style={[
                                        styles.subcategoryItem,
                                        { fontSize: calculateFontSize(14) },
                                    ]}
                                >
                                    {sub.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
        </View>
    );

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Поиск"
                            value={search}
                            onChangeText={setSearch}
                            placeholderTextColor="#6c757d"
                        />
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={24} color="#6c757d" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={getFilteredCategories()}
                        keyExtractor={(item) => item.id}
                        renderItem={renderCategory}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#dcdcdc",
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        color: "#212529",
    },
    categoryItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    categoryHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    categoryText: {
        color: "#212529",
        marginLeft: 12,
        flex: 1,
    },
    subcategoryList: {
        paddingLeft: 16,
        paddingTop: 8,
    },
    subcategoryItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
    },
    subcategoryItem: {
        color: "#6c757d",
        marginLeft: 12,
    },
    colorCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});

export default FilterModal;
