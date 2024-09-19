/*
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import QrScreenTemplate from '../templates/QrScreenTemplate';

const QrScreenPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'generate' | 'scan'>('generate');
  const [qrData, setQrData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateQR = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://loyalty-zetta.vercel.app/api/qualificationsIDs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const json = await response.json();
      if (json.response && Array.isArray(json.response)) {
        const ids = json.response.map((item: { id: number }) => item.id).join(', ');
        setQrData(`IDs de calificación: ${ids}`);
      } else {
        setError('No se pudo generar el QR');
      }
    } catch (error) {
      setError('Error al generar el QR');
    } finally {
      setLoading(false);
    }
  };

  const scanQR = () => {
    setSelectedOption('scan');
  };

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <QrScreenTemplate
        loading={loading}
        qrData={qrData}
        error={error}
        selectedOption={selectedOption}
        generateQR={() => {
          setSelectedOption('generate');
          generateQR();
        }}
        scanQR={scanQR}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
  },
});

export default QrScreenPage; */


import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import loyaltyData from '../../assets/loyalty.json'; // Adjust path if necessary

// Define the TypeScript type for qualification data
interface QualificationData {
  id: number;
  donationId: number;
  donatorId: number;
  organizationId: number;
  qualityCalification: {
    score: number;
    comments: string;
  };
  timeCalification: {
    score: number;
    comments: string;
  };
  packagingCalification: {
    score: number;
    comments: string;
  };
  communicationCalification: {
    score: number;
    comments: string;
  };
  generalScore: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export default function QrScreenPage() {
  // Initialize state with the correct type or null
  const [showQRCode, setShowQRCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productData, setProductData] = useState<QualificationData | null>(null);

  const fetchQualificationData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://loyalty-zetta.vercel.app/api/qualifications/5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const json = await response.json();

      if (json.status === 200 && json.response) {
        const qualificationData: QualificationData = {
          id: json.response.id,
          donationId: json.response.donationId,
          donatorId: json.response.donatorId,
          organizationId: json.response.organizationId,
          qualityCalification: {
            score: json.response.qualityCalification.score,
            comments: json.response.qualityCalification.comments,
          },
          timeCalification: {
            score: json.response.timeCalification.score,
            comments: json.response.timeCalification.comments,
          },
          packagingCalification: {
            score: json.response.packagingCalification.score,
            comments: json.response.packagingCalification.comments,
          },
          communicationCalification: {
            score: json.response.communicationCalification.score,
            comments: json.response.communicationCalification.comments,
          },
          generalScore: json.response.generalScore,
          notes: json.response.notes,
          createdAt: json.response.createdAt,
          updatedAt: json.response.updatedAt,
        };

        setProductData(qualificationData); // Set fetched data in state
        setShowQRCode(true); // Show the QR code after data is fetched
      } else {
        setError('No se pudo obtener la calificación');
      }
    } catch (error) {
      console.error('Error fetching qualification data:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>Banco de Alimentos</Text>

        <View style={styles.qrBox}>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : showQRCode ? (
            <QRCode value={JSON.stringify(productData || loyaltyData)} size={200} />
          ) : (
            <View style={styles.emptyBox} />
          )}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={fetchQualificationData}>
          <Text style={styles.buttonText}>Confirmar otra respuesta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
  },
  subtitle: {
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBox: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 15,
    marginBottom: 40,
  },
  emptyBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});