import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Team } from '..';
import { Ionicons } from '@expo/vector-icons'
import { CameraView, useCameraPermissions } from 'expo-camera';


type SearchTeamNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchTeam'>;

interface Props {
  navigation: SearchTeamNavigationProp;
}

export default function SearchTeamScreen({ navigation }: Props) {
  const [teamCode, setTeamCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  // Mock data - substituir por API real
  const mockTeams: Team[] = [
    { id: '1', name: 'Pescadores Unidos', code: 'PU001' },
    { id: '2', name: 'Anzol Dourado', code: 'AD002' },
    { id: '3', name: 'Maré Alta', code: 'MA003' },
    { id: '4', name: 'Iscas & Companhia', code: 'IC004' },
  ];

  const handleSearch = async () => {
    if (!teamCode.trim()) {
      Alert.alert('Erro', 'Por favor, digite o código do time');
      return;
    }

    setIsSearching(true);

    try {
      // Simular busca na API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const foundTeam = mockTeams.find(
        team => team.code.toLowerCase() === teamCode.toLowerCase().trim()
      );

      if (foundTeam) {
        navigation.navigate('RegisterScore', { team: foundTeam });
      } else {
        Alert.alert('Time não encontrado', 'Verifique o código e tente novamente');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na busca do time');
    } finally {
      setIsSearching(false);
    }
  };

  const requestCameraPermission = async () => {
    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
          <View style={styles.container}>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
          </View>
        );
      }
    setShowScanner(true);
  };


  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setShowScanner(false);
    setTeamCode(data);
    
    // Buscar automaticamente após scan
    const foundTeam = mockTeams.find(
      team => team.code.toLowerCase() === data.toLowerCase()
    );

    if (foundTeam) {
      navigation.navigate('RegisterScore', { team: foundTeam });
    } else {
      Alert.alert('Time não encontrado', 'QR Code não corresponde a nenhum time cadastrado');
    }
  };

  if (showScanner) {
    return (
      <View style={styles.scannerContainer}>
        <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                barcodeScannerSettings={
                    {
                        barcodeTypes: ['qr']
                    }
                }

                onBarcodeScanned={
                    ({type, data }) => {
                        console.log( type, data); // here you can get your barcode id or url
                        handleBarCodeScanned({type, data})
                    }
                }
            />
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerFrame} />
          <Text style={styles.scannerText}>Posicione o QR Code dentro do quadro</Text>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setShowScanner(false)}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="search" size={60} color="#2563eb" />
          <Text style={styles.title}>Buscar Time</Text>
          <Text style={styles.subtitle}>Digite o código ou escaneie o QR Code</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-circle" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Código do Time (ex: PU001)"
              value={teamCode}
              onChangeText={setTeamCode}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, (!teamCode || isSearching) && styles.buttonDisabled]}
            onPress={handleSearch}
            disabled={!teamCode || isSearching}
          >
            {isSearching ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="search" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Buscar Time</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.qrButton}
            onPress={requestCameraPermission}
          >
            <Ionicons name="qr-code" size={20} color="#2563eb" style={styles.buttonIcon} />
            <Text style={styles.qrButtonText}>Ler QR Code</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6b7280',
    fontSize: 14,
  },
  qrButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qrButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scannerContainer: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  scannerText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 30,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
});