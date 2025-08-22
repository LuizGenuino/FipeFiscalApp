import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/Colors";


export const recordStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        alignItems: 'center',
    },

    content: {
        width: "90%",
        minWidth: 350,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textLight,
        marginLeft: 8,
    },
    cardContent: { padding: 16 },
    infoText: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: 8,
    },
    infoLabel: {
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
        elevation: 3,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonIcon: { marginRight: 8 },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});