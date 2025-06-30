import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface FavoriteButtonProps {
    item: { name: string };
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ item }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        console.log(`Добавить в избранное: ${item.name}`);
    };

    return (
        <TouchableOpacity onPress={toggleFavorite}>
            <Icon
                name={isFavorite ? 'star' : 'star-outline'}
                size={24}
                color={isFavorite ? '#007bff' : '#6c757d'}
            />
        </TouchableOpacity>
    );
};

export default FavoriteButton;