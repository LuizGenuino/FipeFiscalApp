import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/Colors";


export const recordListStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: "center", paddingBottom: 32, },
    header: { alignItems: 'center' },
    title: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary, marginTop: 12 },
    subtitle: { fontSize: 16, color: COLORS.textLight, marginTop: 8, textAlign: 'center' },
    cardList: {
        maxWidth: 450,
        padding: 5,
        width: "90%"
    },
    cardItem: {
        width: "100%",
        padding: 10,
        margin: 5,
        elevation: 2,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderRadius: 15,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },

    cardText: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "45%",
        marginBottom: 5
    },

    modalButtonPrimary: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        padding: 12,
        marginTop: 10
    },
    modalButtonPrimaryText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

});
