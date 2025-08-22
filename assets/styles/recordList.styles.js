import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/Colors";


export const recordListStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingBottom: 32,
    },

    header: {
        alignItems: 'center',
        marginBottom: 40
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginTop: 12
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        marginTop: 8,
        textAlign: 'center'
    },
    content: {
        alignItems: "center",
    },
    form: {
        width: '100%',
        maxWidth: 350,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        marginVertical: 16,
        overflow: 'hidden',
    },
    pickerLabel: {
        fontSize: 10,
        marginTop: 5,
        marginLeft: 5,
        color: COLORS.border
    },
    errorBorder: {
        borderColor:COLORS.primary,
    },
    errorText: {
        fontSize: 13,
        color: "red",
        fontWeight: '800',
        textAlign: "center",
        marginBottom: 5
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 16,
        elevation: 2,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputIcon: {
        marginRight: 12
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: COLORS.textLight
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: COLORS.border
    },
    buttonIcon: {
        marginRight: 8
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold'
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border
    },
    dividerText: {
        marginHorizontal: 12,
        color: COLORS.border,
        fontSize: 14
    },
    qrButton: {
        backgroundColor:COLORS.white,
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.primary,
        elevation: 2,
    },
    qrButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold'
    },

});