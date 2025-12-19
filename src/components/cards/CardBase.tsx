import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { useColorTheme } from '@/hooks/useColorTheme';
import theme from '@/theme/theme';

export interface CardBaseProps {
    children: ReactNode;
    containerStyle?: ViewStyle;
    backgroundColor?: string;
    shadow?: boolean;
    borderColor?: string;
    noPadding?: boolean;
}

const CardBase = ({
    children,
    containerStyle,
    backgroundColor,
    shadow = false,
    borderColor,
    noPadding = false,
}: CardBaseProps) => {
    const colorTheme = useColorTheme();
    const styles = getStyles(colorTheme);

    return (
        <View
            style={[
                styles.card,
                backgroundColor && { backgroundColor },
                borderColor && { borderColor, borderWidth: 1 },
                shadow && theme.shadow,
                noPadding && { padding: 0 },
                containerStyle,
            ]}
        >
            {children}
        </View>
    );
};

export default CardBase;

const getStyles = (colors: ColorTheme) =>
    StyleSheet.create({
        card: {
            width: '90%',
            alignSelf: 'center',
            borderRadius: 12,
            backgroundColor: colors.card,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.xs,
            marginVertical: theme.spacing.xs,
        },
    });
