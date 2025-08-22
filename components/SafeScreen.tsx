import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/Colors";

export default function SafeScreen({ children }: any) {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: COLORS.background }}>
            {children}
        </View>
    );
};