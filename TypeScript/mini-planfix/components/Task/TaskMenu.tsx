import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    TextInput,
} from "react-native";

type TaskMenuProps = {
    isVisible: boolean;
    selectedTask: { id: string; name: string; description?: string; project?: string } | null;
    onClose: () => void;
    onEdit: (newName: string, newDescription: string, newProject: string) => void;
    onDelete: () => void;
    isEditMode: boolean;
    setEditMode: (value: boolean) => void;
    editedTaskName: string;
    setEditedTaskName: (name: string) => void;
    editedTaskDescription: string;
    setEditedTaskDescription: (description: string) => void;
    editedTaskProject: string;
    setEditedTaskProject: (project: string) => void;
};

const TaskMenu: React.FC<TaskMenuProps> = ({
                                               isVisible,
                                               selectedTask,
                                               onClose,
                                               onEdit,
                                               onDelete,
                                               isEditMode,
                                               setEditMode,
                                               editedTaskName,
                                               setEditedTaskName,
                                               editedTaskDescription,
                                               setEditedTaskDescription,
                                               editedTaskProject,
                                               setEditedTaskProject,
                                           }) => {
    return (
        <Modal
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
            animationType="slide"
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {selectedTask ? selectedTask.name : "Меню"}
                    </Text>

                    {isEditMode ? (
                        <>
                            <TextInput
                                style={styles.input}
                                value={editedTaskName}
                                onChangeText={setEditedTaskName}
                                placeholder="Введите новое имя"
                                autoFocus
                            />
                            <TextInput
                                style={styles.input}
                                value={editedTaskDescription}
                                onChangeText={setEditedTaskDescription}
                                placeholder="Введите описание"
                            />
                            <TextInput
                                style={styles.input}
                                value={editedTaskProject}
                                onChangeText={setEditedTaskProject}
                                placeholder="Введите проект"
                            />
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    onEdit(editedTaskName, editedTaskDescription, editedTaskProject);
                                    setEditMode(false);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Сохранить</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setEditMode(false)}
                            >
                                <Text style={styles.modalCancelButtonText}>Отмена</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setEditMode(true);
                                    setEditedTaskName(selectedTask?.name || "");
                                    setEditedTaskDescription(selectedTask?.description || "");
                                    setEditedTaskProject(selectedTask?.project || "");
                                }}
                            >
                                <Text style={styles.modalButtonText}>Изменить</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={onDelete}>
                                <Text style={styles.modalButtonText}>Удалить</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
                                <Text style={styles.modalCancelButtonText}>Отмена</Text>
                            </TouchableOpacity>
                        </>
                    )}
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
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: "#007bff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
    modalCancelButton: {
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        padding: 12,
    },
    modalCancelButtonText: {
        color: "#6c757d",
        fontSize: 16,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        fontSize: 16,
    },
});

export default TaskMenu;
