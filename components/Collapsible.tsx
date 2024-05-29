import Ionicons from '@expo/vector-icons/Ionicons';
import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useScale } from '@/hooks/useScale';

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';
  const styles = useCollapsibleStyles();
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.6}
      >
        <Ionicons
          name={isOpen ? 'chevron-down' : 'chevron-forward-outline'}
          size={18}
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
        />
        <ThemedText type="defaultSemiBold" style={styles.text}>
          {title}
        </ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const useCollapsibleStyles = () => {
  const scale = useScale();
  return StyleSheet.create({
    container: {
      marginTop: 0 * scale,
      marginBottom: 20 * scale,
    },
    text: {
      fontSize: 24 * scale,
      fontWeight: 'bold',
    },
    heading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6 * scale,
    },
    content: {
      marginTop: 6 * scale,
      marginLeft: 24 * scale,
    },
  });
};
