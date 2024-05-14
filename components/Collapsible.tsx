import Ionicons from "@expo/vector-icons/Ionicons";
import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView>
      <View style={styles.heading}>
        <TouchableOpacity
          onPress={() => setIsOpen((value) => !value)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isOpen ? "chevron-down" : "chevron-forward-outline"}
            size={18}
            // style={{ marginBottom: 20 }}
            color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
          />
        </TouchableOpacity>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </View>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 5,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
