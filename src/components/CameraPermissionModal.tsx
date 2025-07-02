import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export function CameraPermissionModal() {
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
      }


  const requestPermissionxjs = async () => {
    if (!permission.granted) {
    setModalVisible(true);
  };
}

  return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.message}>We need your permission to use the camera and microphone</Text>
            <Button onPress={requestPermission} title="Grant Permission" />
          </View>
        </View>
      </Modal>
  )
};

const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: '#fff',
      padding: 24,
      borderRadius: 12,
      width: '80%',
      elevation: 10,
    },
    message: {
      marginBottom: 16,
      fontSize: 16,
      textAlign: 'center',
    },
  });