import React from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet } from "react-native";

type ContextMenuProps = {
    visible: boolean;
    onClose: () => void;
    onContactsPress: () => void;
    onEmployeesPress: () => void;
    onCancelPress: () => void;
};

const ContextMenu: React.FC<ContextMenuProps> = ({
                                                     visible,
                                                     onClose,
                                                     onContactsPress,
                                                     onEmployeesPress,
                                                     onCancelPress,
                                                 }) => {
    return (
        <Modal transparent={true} visible={visible} animationType="fade">
            <TouchableOpacity style={styles.overlay} onPress={onClose} />
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={onContactsPress}>
                    <Text style={styles.menuText}>Контакты</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={onEmployeesPress}>
                    <Text style={styles.menuText}>Сотрудники</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuCancelButton} onPress={onCancelPress}>
                    <Text style={styles.menuCancelButtonText}>Отмена</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    menuContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    menuItem: {
        backgroundColor: "#007bff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    menuText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
    menuCancelButton: {
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        padding: 12,
    },
    menuCancelButtonText: {
        color: "#6c757d",
        fontSize: 16,
        textAlign: "center",
    },
});

export default ContextMenu;
