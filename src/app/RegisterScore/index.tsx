import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'
import { Camera, CameraView } from 'expo-camera';
import { FishRecord, RootStackParamList } from '..';

type RegisterScoreNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RegisterScore'>;
type RegisterScoreRouteProp = RouteProp<RootStackParamList, 'RegisterScore'>;

interface Props {
  navigation: RegisterScoreNavigationProp;
  route: RegisterScoreRouteProp;
}

export default function RegisterScoreScreen({ navigation, route }: Props) {
  const { team } = route.params;
  
  const [fishRecord, setFishRecord] = useState<FishRecord>({
    species: '',
    size: '',
    ticketNumber: '',
    teamMember: '',
    fishPhoto: '',
    ticketPhoto: '',
    releaseVideo: '',
  });
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraType, setCameraType] = useState<'photo' | 'video'>('photo');
  const [photoType, setPhotoType] = useState<'fish' | 'ticket'>('fish');

  const fishSpecies = [
    'Tucunaré',
    'Dourado',
    'Pintado',
    'Pacu',
    'Traíra',
    'Corvina',
    'Robalo',
    'Bagre',
    'Lambari',
    'Outros'
  ];

  const teamMembers = ['Membro 1', 'Membro 2', 'Membro 3', 'Membro 4'];

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
    
    if (cameraStatus !== 'granted' || audioStatus !== 'granted') {
      Alert.alert('Permissões necessárias', 'É necessário permitir acesso à câmera e microfone');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async (type: 'fish' | 'ticket') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setPhotoType(type);
    setCameraType('photo');
    setShowCamera(true);
  };

  const handleRecordVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setCameraType('video');
    setShowCamera(true);
  };

  const handleMediaCaptured = (uri: string) => {
    setShowCamera(false);
    
    if (cameraType === 'photo') {
      if (photoType === 'fish') {
        setFishRecord((prev: FishRecord) => ({ ...prev, fishPhoto: uri }));
      } else {
        setFishRecord((prev: FishRecord) => ({ ...prev, ticketPhoto: uri }));
      }
    } else {
      setFishRecord((prev: FishRecord) => ({ ...prev, releaseVideo: uri }));
    }
  };

  const validateForm = () => {
    if (!fishRecord.species) {
      Alert.alert('Erro', 'Selecione a espécie do peixe');
      return false;
    }
    if (!fishRecord.size) {
      Alert.alert('Erro', 'Digite o tamanho do peixe');
      return false;
    }
    if (!fishRecord.ticketNumber) {
      Alert.alert('Erro', 'Digite o número da ficha');
      return false;
    }
    if (!fishRecord.teamMember) {
      Alert.alert('Erro', 'Selecione o membro da equipe');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      // Aqui você enviaria os dados para a API
      console.log('Enviando dados:', { team, fishRecord });
      
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowConfirmModal(false);
      Alert.alert('Sucesso', 'Registro enviado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao enviar registro');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Team Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-add" size={24} color="#2563eb" />
            <Text style={styles.cardTitle}>Informações do Time</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Nome: </Text>
              {team.name}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Código: </Text>
              {team.code}
            </Text>
          </View>
        </View>

        {/* Fish Data */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="fish-sharp" size={24} color="#2563eb" />
            <Text style={styles.cardTitle}>Dados do Peixe</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Espécie do Peixe *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={fishRecord.species}
                  onValueChange={(value: string) => setFishRecord((prev: FishRecord) => ({ ...prev, species: value }))}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione a espécie" value="" />
                  {fishSpecies.map((species) => (
                    <Picker.Item key={species} label={species} value={species} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tamanho (CM) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 35"
                value={fishRecord.size}
                onChangeText={(value) => setFishRecord((prev: FishRecord) => ({ ...prev, size: value }))}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número da Ficha *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 001"
                value={fishRecord.ticketNumber}
                onChangeText={(value) => setFishRecord((prev: FishRecord) => ({ ...prev, ticketNumber: value }))}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Membro da Equipe *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={fishRecord.teamMember}
                  onValueChange={(value: string) => setFishRecord((prev: FishRecord) => ({ ...prev, teamMember: value }))}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione o membro" value="" />
                  {teamMembers.map((member) => (
                    <Picker.Item key={member} label={member} value={member} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* Photos */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="camera" size={24} color="#2563eb" />
            <Text style={styles.cardTitle}>Fotos</Text>
          </View>
          <View style={styles.cardContent}>
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => handleTakePhoto('fish')}
            >
              <Ionicons name="camera-sharp" size={20} color="#2563eb" />
              <Text style={styles.mediaButtonText}>
                {fishRecord.fishPhoto ? 'Foto do Peixe ✓' : 'Foto do Peixe Completo'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => handleTakePhoto('ticket')}
            >
              <Ionicons name="camera-sharp" size={20} color="#2563eb" />
              <Text style={styles.mediaButtonText}>
                {fishRecord.ticketPhoto ? 'Foto da Ficha ✓' : 'Foto da Ficha'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Video */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="videocam" size={24} color="#2563eb" />
            <Text style={styles.cardTitle}>Vídeo</Text>
          </View>
          <View style={styles.cardContent}>
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={handleRecordVideo}
            >
              <Ionicons name="videocam" size={20} color="#2563eb" />
              <Text style={styles.mediaButtonText}>
                {fishRecord.releaseVideo ? 'Vídeo da Soltura ✓' : 'Gravar Soltura do Peixe'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Ionicons name="send" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.submitButtonText}>Enviar Registro</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Envio</Text>
            <Text style={styles.modalSubtitle}>Verifique os dados antes de confirmar</Text>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Time</Text>
                <Text style={styles.modalText}>Nome: {team.name}</Text>
                <Text style={styles.modalText}>Código: {team.code}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Dados do Peixe</Text>
                <Text style={styles.modalText}>Espécie: {fishRecord.species}</Text>
                <Text style={styles.modalText}>Tamanho: {fishRecord.size} CM</Text>
                <Text style={styles.modalText}>Nº Ficha: {fishRecord.ticketNumber}</Text>
                <Text style={styles.modalText}>Pescador: {fishRecord.teamMember}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Mídia</Text>
                <Text style={styles.modalText}>
                  • Foto do peixe: {fishRecord.fishPhoto ? '✓' : '✗'}
                </Text>
                <Text style={styles.modalText}>
                  • Foto da ficha: {fishRecord.ticketPhoto ? '✓' : '✗'}
                </Text>
                <Text style={styles.modalText}>
                  • Vídeo da soltura: {fishRecord.releaseVideo ? '✓' : '✗'}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonSecondary}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Corrigir</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonPrimary}
                onPress={handleConfirmSubmit}
              >
                <Text style={styles.modalButtonPrimaryText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        transparent={false}
        animationType="slide"
      >
        <CameraComponent
          type={cameraType}
          onMediaCaptured={handleMediaCaptured}
          onClose={() => setShowCamera(false)}
        />
      </Modal>
    </ScrollView>
  );
}

// Camera Component
interface CameraComponentProps {
  type: 'photo' | 'video';
  onMediaCaptured: (uri: string) => void;
  onClose: () => void;
}

function CameraComponent({ type, onMediaCaptured, onClose }: CameraComponentProps) {
  const [camera, setCamera] = useState<any | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      onMediaCaptured(photo.uri);
    }
  };

  const recordVideo = async () => {
    if (camera && !isRecording) {
      setIsRecording(true);
      const video = await camera.recordAsync();
      setIsRecording(false);
      onMediaCaptured(video.uri);
    } else if (camera && isRecording) {
      camera.stopRecording();
    }
  };

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={styles.camera}
        ref={(ref: any) => setCamera(ref)}
        facing={"back"}
      >
        <View style={styles.cameraOverlay}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={[styles.captureButton, isRecording && styles.recordingButton]}
              onPress={type === 'photo' ? takePicture : recordVideo}
            >
              <Ionicons 
                name={type === 'photo' ? 'camera' : (isRecording ? 'stop' : 'videocam')} 
                size={30} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
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
    color: '#1f2937',
    marginLeft: 8,
  },
  cardContent: {
    padding: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  mediaButtonText: {
    fontSize: 16,
    color: '#2563eb',
    marginLeft: 8,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalScroll: {
    maxHeight: 300,
  },
  modalSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButtonSecondary: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  modalButtonSecondaryText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
  },
  modalButtonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  cameraControls: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureButton: {
    backgroundColor: '#2563eb',
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#ef4444',
  },
});