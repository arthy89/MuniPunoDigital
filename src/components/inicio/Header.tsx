import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa FontAwesome

interface HeaderProps {
  onMenuPress: () => void; // Función para manejar la presión del botón de menú
  onSearch: (text: string) => void; // Función para manejar la búsqueda
}

const Header = ({ onMenuPress, onSearch }: HeaderProps) => {
  return (
    <View style={styles.header}>
      {/* Primera fila: Menú, Título e Ícono */}
      <View style={styles.topRow}>
        {/* Botón de menú */}
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inicio</Text>
        <Image
          source={require('../../assets/images/munipuno.png')} // Ruta de la imagen
          style={styles.icon}
        />
      </View>

      {/* Segunda fila: Barra de búsqueda */}
      <View style={styles.searchBar}>
        <Icon name="search" size={16} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar"
          placeholderTextColor="#999"
          style={styles.searchInput}
          onChangeText={onSearch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007DC5',
    padding: 16,
    paddingTop: 40,
    height: 200, // Ajuste de altura para que sea más compacto
  },
  topRow: {
    flexDirection: 'row', // Alinea los elementos horizontalmente
    alignItems: 'center', // Alinea los elementos verticalmente
    justifyContent: 'space-between', // Distribuye los elementos horizontalmente
    marginBottom: 16, // Espaciado entre la primera fila y el buscador
    width: '90%', // Asegura que ocupe todo el ancho
    marginHorizontal: 'auto', // Centra horizontalmente
  },
  menuButton: {
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // Ocupa el espacio restante para centrar el título
  },
  icon: {
    width: 40,
    height: 40,
  },
  searchBar: {
    flexDirection: 'row', // Alinea el ícono y el campo de texto horizontalmente
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 15, // Bordes redondeados
    paddingVertical: 4,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '90%',
    alignSelf: 'center',
  },
  searchIcon: {
    marginRight: 8, // Espaciado entre el ícono y el campo de texto
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
    flex: 1, // Ocupa el espacio restante
  },
});

export default Header;
