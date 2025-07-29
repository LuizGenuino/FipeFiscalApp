
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';

interface VideoPreviewProps {
    source: string;
}

export default function VideoPreview({ source }: VideoPreviewProps) {
    const player = useVideoPlayer(source, player => {
        player.loop = true;
        player.play();
    });


    return (
        <View style={styles.contentContainer}>
            <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture nativeControls />
            <View style={styles.controlsContainer}>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,
    },
    video: {
        width: "100%",
        height: 275,
    },
    controlsContainer: {
        padding: 10,
    },
});