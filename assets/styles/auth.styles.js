import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/Colors";

const { height } = Dimensions.get("window");

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    imageContainer: {
        marginTop: height * 0.10,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 200,
        height: 200,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.text,
        textAlign: "center",
        marginBottom: 20
    },
    subtitle: {
        fontSize: 18,
        color: COLORS.textLight,
        textAlign: "center",
        marginBottom: 30,
    },
    formContainer: {
        flex: 1,
        marginVertical: 10
    },
    inputContainer: {
        marginBottom: 20,
        position: "relative",
    },
     inputIcon: {
        marginRight: 12,
        position: 'absolute',
        zIndex: 10,
        top: 15,
        left: 10
    },
    textInput: {
        fontSize: 16,
        color: COLORS.shadow,
        paddingVertical: 16,
        paddingHorizontal: 32,
        backgroundColor: COLORS.white,
        borderRadius: 12,
    },
    eyeButton: {
        position: "absolute",
        right: 16,
        top: 16,
        padding: 4,
    },
    authButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 30,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.white,
        textAlign: "center",
    },
    linkContainer: {
        alignItems: "center",
        paddingBottom: 20,
    },
    linkText: {
        fontSize: 16,
        color: COLORS.textLight,
    },
    link: {
        color: COLORS.primary,
        fontWeight: "600",
    },
});