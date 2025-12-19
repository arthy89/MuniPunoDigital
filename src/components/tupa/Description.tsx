import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getTupaDescription } from '@/services/GetDataTupaDescription';
import { RootStackParamList } from '@/navigation/StackNavigator';


type DescriptionProps = NativeStackScreenProps<
  RootStackParamList,
  'Description'
>;

const Description = ({ route, navigation }: DescriptionProps) => {
  const {  code } = route.params;
  const [tramiteDetails, setTramiteDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetTupaDescription = async () => {
    try {
      const data = await getTupaDescription(code);
      console.log('Datos del trámite22:', data.tupa[0].nombre);
      setTramiteDetails(data.tupa);
    } catch (err) {
      console.error('Error al obtener los datos del trámite:', err);
      setError('No se pudo cargar la descripción');
    }
  };
  useEffect(() => {
    handleGetTupaDescription();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Código y botón */}
        <View style={styles.cardRow}>
          <Text style={styles.code}>
            <Text style={{ fontWeight: 'bold', color: '#2986cc' }}>Código:</Text> {code}
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Ver trámite</Text>
          </TouchableOpacity>
        </View>

        {tramiteDetails && (
          <>
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitleBlue}>
                Descripción del procedimiento
              </Text>
              <Text style={styles.text}>{tramiteDetails[0].descripcion}</Text>
            </View>
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitleBlue}>Requisitos</Text>
              {tramiteDetails[0].requisitos.map((item: any, index: number) => (
                <View style={styles.listItem}>
                  <Icon
                    name="circle"
                    size={8}
                    color="#2986cc"
                    style={{ marginRight: 8, marginTop: 7 }}
                  />
                  <Text style={styles.text}>{item.de_descripcion}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Formularios 
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitleBlue}>Formularios:</Text>
          <View style={styles.formRow}>
            <Text style={styles.text}>Llenar el siguiente formulario:</Text>
            <View style={styles.formIcons}>
              <TouchableOpacity style={styles.iconCircleRed}>
                <Icon name="file-pdf-o" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircleRed}>
                <Icon name="file-pdf-o" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircleBlue}>
                <Icon name="refresh" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        */}

        {/* Canales de atención */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitleBlue}>Canales de atención</Text>
          <View style={styles.channelRow}>
            <View style={styles.channelBox}>
              <Icon name="building" size={18} color="#2986cc" />
              <Text style={styles.channelText}>Atención presencial</Text>
              <Text style={styles.OptionText}>
                Ventanilla del municipio de puno
              </Text>
            </View>
            <View style={styles.channelBox}>
              <Icon name="phone" size={18} color="#2986cc" />
              <Text style={styles.channelText}>Telefónico</Text>
              <Text style={styles.OptionText}>987654321</Text>
            </View>
            <View style={styles.channelBox}>
              <Icon name="globe" size={18} color="#2986cc" />
              <Text style={styles.channelText}>Correo</Text>
              <Text style={styles.OptionText}>oaodv@munipuno.gob.pe</Text>
            </View>
          </View>
        </View>

        {/* Pago por derecho de trámite */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitleBlue}>
            Pago por derecho de trámite
          </Text>
          <View style={styles.paymentRow}>
            <Icon
              name="money"
              size={22}
              color="#2986cc"
              style={{ marginRight: 10 }}
            />
            <View>
              <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Concepto:</Text> Trámite N1
              </Text>
              <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Monto:</Text> S/120.00
              </Text>
            </View>
          </View>
        </View>

        {/* Plazo de atención */}
        <View>
          <Icon name="send" size={22} color="#fff" style={{ marginRight: 10 }} />
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitleBlue}>Plazo de atención</Text>
            <Text style={styles.text}>15 días hábiles</Text>
          </View>
        </View>

        {/* Sedes y horarios */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitleBlue}>Sede y horario</Text>
          <View style={styles.sedeRow}>
            <View style={styles.sedeBox}>
              <Text style={styles.sedeLabel}>Sede entral:</Text>
              <Text style={styles.sedeValue}>Palacio municipal</Text>
            </View>

            <View style={styles.sedeBox}>
              <Text style={styles.sedeLabel}>Horario:</Text>
              <Text style={styles.sedeValue}>
                08:00 a 13:00 y 14:00 a 16:00
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    backgroundColor: '#2986cc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 16,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  cardRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e7ef',
  },
  code: {
    color: '#2986cc',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#2986cc',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e7ef',
  },
  sectionTitleBlue: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#2986cc',
    marginBottom: 6,
  },
  text: {
    color: '#222',
    fontSize: 14,
    marginBottom: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  formIcons: {
    flexDirection: 'row',
    marginLeft: 10,
    gap: 8,
  },
  iconCircleRed: {
    backgroundColor: '#e53935',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  iconCircleBlue: {
    backgroundColor: '#2986cc',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  channelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 6,
  },
  channelBox: {
    flex: 1,
    backgroundColor: '#eaf3fb',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  channelText: {
    //color: '#2986cc',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  OptionText: {
    //color: '#2986cc',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  sedeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 6,
  },
  sedeBox: {
    flex: 1,
    backgroundColor: '#eaf3fb',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  sedeLabel: {
    color: '#2986cc',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sedeValue: {
    color: '#222',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  accordionBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e7ef',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionTitle: {
    color: '#2986cc',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Description;
