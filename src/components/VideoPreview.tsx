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
            <VideoView
                style={styles.video}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
                nativeControls
            />
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    video: {
        width: '100%',
        height: 273,
    },
});
