import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MenuButton from '../components/menu/MenuButton';
import MenuLink from '../components/menu/MenuLink';
import Icon from 'react-native-vector-icons/FontAwesome';
interface MenuScreenProps {
  navigation: any; // Propiedades de navegación
  //
}
const MenuScreen = ({ navigation }: MenuScreenProps) => {
  return (
    <View style={styles.container}>
      {/* Sección superior */}
      <View style={styles.topSection}>
        {/* Botón para cerrar el menú */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Título del menú */}
        <Text style={styles.menuTitle}>Menú</Text>

        {/* Botones principales */}
        <View style={styles.menuButtons}>
          <MenuButton
            title="Mi perfil"
            iconName="user"
            onPress={() => navigation.navigate('Profile')}
          />
          <MenuButton
            title="Configuración"
            iconName="cog"
            onPress={() => navigation.navigate('Settings')}
          />
          <MenuButton
            title="Ayuda"
            iconName="question-circle"
            onPress={() => navigation.navigate('Help')}
          />
        </View>
      </View>

      {/* Sección inferior */}
      <View style={styles.bottomSection}>
        <MenuLink
          title="Términos y condiciones"
          iconName="file-text"
          onPress={() => navigation.navigate('Terms')}
        />
        <MenuLink
          title="Políticas de privacidad"
          iconName="shield"
          onPress={() => navigation.navigate('Privacy')}
        />
        <MenuLink
          title="Salir"
          iconName="sign-out"
          onPress={() => navigation.navigate('Logout')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topSection: {
    backgroundColor: '#0088CC',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 5,
    alignItems: 'center',
    paddingVertical: 24,
  },
  closeButton: {
    position: 'absolute',
    padding: 8,
    top: 37,
    left: 10,
    zIndex: 10,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 20,
    top: 10,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 16,
  },
  menuButtons: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  bottomSection: {
    flex: 1,
    padding: 30,
    justifyContent: 'flex-end',
  },
});

export default MenuScreen;
