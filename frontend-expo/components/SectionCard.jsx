import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, Text, View } from "react-native";

export function SectionCard({
  title,
  children,
  style = { marginHorizontal: 20, marginTop: 16 },
}) {
  const textColor = useThemeColor({}, "text");

  return (
    <View style={[styles.card, style]}>
      {title ? (
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      ) : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    paddingTop: 14,
    paddingBottom: 10,
  },
  content: {
    paddingBottom: 6,
  },
});
