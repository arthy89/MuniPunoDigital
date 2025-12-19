import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TupaStackParamList } from '../navigation/tupaStack';
import { ColorTheme } from '@/theme/colors';
import { useColorTheme } from '@/hooks/useColorTheme';
import { getTupaProcedure } from '../use-cases/getTupaProcedure';
import { useEffect, useLayoutEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '@/theme/theme';
import TupaServiceChannelsCard from '../components/TupaServiceChannelsCard';
type TupaScreenProps = NativeStackScreenProps<TupaStackParamList, 'TupaDetail'>;

const TupaDetailScreen = ({ route, navigation }: TupaScreenProps) => {
  const { code } = route.params;
  const colorTheme = useColorTheme();
  const [tramiteDetails, setTramiteDetails] = useState<any>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `TUPA - ${code}`,
    });
  }, [navigation]);

  const handleGetTupaDescription = async () => {
    try {
      const data = await getTupaProcedure(code);
      setTramiteDetails(data.tupa);
    } catch (err) {
      console.error('Error al obtener los datos del trámite:', err);
    }
  };
  useEffect(() => {
    handleGetTupaDescription();
  }, []);
  const styles = getStyles(colorTheme);
  return (
    <ScrollView contentContainerStyle={[theme.container, {
      flex: 0,
    },]}>
      {tramiteDetails && (
        <>
          <View style={styles.sectionBox}>
            <Text style={styles.cardTitle}>
              Nombre del procedimiento:
            </Text>
            <Text style={styles.text}> {tramiteDetails[0].nombre} </Text>
            {/** <ButtonBase text="Ver trámite" size="xs" /> */}
          </View>
          <View style={styles.sectionBox}>
            <Text style={styles.cardTitle}>Descripción del procedimiento</Text>
            <Text style={styles.text}>{tramiteDetails[0].descripcion}</Text>
          </View>
          <View style={styles.sectionBox}>
            <Text style={styles.cardTitle}>Requisitos</Text>
            {tramiteDetails[0].requisitos.map((item: any, index: number) => (
              <View style={styles.listItem} key={item.cod_req}>
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
          <Text style={styles.cardTitle}>Formularios:</Text>
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
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Canales de atención</Text>
        <View style={styles.channelRow}>
          <TupaServiceChannelsCard
            icon="building"
            title="Atención presencial"
            info="Ventanilla de la Municipalidad Provincial de Puno"
          />
          {/* <TupaServiceChannelsCard
            icon="phone"
            title="Atención telefónica"
            info="987654321"
          /> */}
          <TupaServiceChannelsCard
            icon="globe"
            title="Atención en línea"
            info="oaodv@munipuno.gob.pe"
          />
        </View>
      </View>

      {/* Pago por derecho de trámite */}
      {/* <View style={styles.card}>
        <Text style={styles.cardTitle}>Pago por derecho de trámite</Text>
        <View style={styles.paymentRow}>
          <Icon name="money" size={22} color={colorTheme.primary} />
          <View>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>Concepto:</Text> Trámite N1
            </Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>Monto:</Text> S/120.00
            </Text>
          </View>
        </View>
      </View> */}

      {/* Plazo de atención */}
      {/* <View>
        <Icon name="send" size={22} color="#fff" style={{ marginRight: 10 }} /> */}
      {/* <View style={styles.card}>
        <Text style={styles.cardTitle}>Plazo de atención</Text>
        <Text style={styles.text}>15 días hábiles</Text>
      </View> */}
      {/* </View> */}

      {/* Sedes y horarios */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sede y horario</Text>
        <View style={styles.sedeRow}>
          <View style={styles.sedeBox}>
            <Text style={styles.sedeLabel}>Sede central:</Text>
            <Text style={styles.sedeValue}>Palacio Municipal</Text>
          </View>

          <View style={styles.sedeBox}>
            <Text style={styles.sedeLabel}>Horario:</Text>
            <Text style={styles.sedeValue}>08:00 a 13:00 y 14:00 a 16:00</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = (color: ColorTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: color.card,
      borderRadius: 12,
      padding: theme.spacing.md,
      rowGap: theme.spacing.xs,
      ...theme.shadow,
    },

    codeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    sectionBox: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 14,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: '#e0e7ef',
    },
    cardTitle: {
      fontWeight: 'bold',
      fontSize: theme.typography.fontSize.sm,
      color: color.primary,
    },
    text: {
      color: color.textPrimary,
      fontSize: theme.typography.fontSize.sm,
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

    paymentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    sedeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    sedeBox: {
      flex: 1,
      backgroundColor: color.primaryLight,
      borderRadius: 8,
      padding: theme.spacing.xs,
      alignItems: 'center',
    },
    sedeLabel: {
      color: color.primary,
      fontWeight: 'bold',
      fontSize: theme.typography.fontSize.xs,
    },
    sedeValue: {
      color: color.textPrimary,
      fontSize: theme.typography.fontSize.xs,
      textAlign: 'center',
    },
  });

export default TupaDetailScreen;
