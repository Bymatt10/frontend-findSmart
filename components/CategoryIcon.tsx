import React from 'react';
import * as icons from 'lucide-react-native';
import { LucideProps } from 'lucide-react-native';

interface CategoryIconProps extends LucideProps {
    name: string;
}

const EMOJI_TO_LUCIDE: Record<string, string> = {
    '🍽️': 'Utensils',
    '🚗': 'Car',
    '🏠': 'Home',
    '🎬': 'Film',
    '💊': 'Activity',
    '📚': 'Book',
    '👕': 'Shirt',
    '💡': 'Lightbulb',
    '📦': 'Package',
    '☕': 'Coffee',
    '🛒': 'ShoppingCart',
    '💸': 'ArrowRightLeft',
    '📌': 'MapPin',
};

export function CategoryIcon({ name, size = 24, color = "#ffffff", ...props }: CategoryIconProps) {
    const iconName = EMOJI_TO_LUCIDE[name] || name;

    // If the icon name is missing or not found in lucide icons map, fallback to MapPin.
    const IconComponent = (icons as any)[iconName] || icons.MapPin;

    // In case there is an old emoji in the DB, it won't crash either because the fallback MapPin will render
    // Since emojis won't match any key in the `icons` object.

    return <IconComponent size={size} color={color} {...props} />;
}
