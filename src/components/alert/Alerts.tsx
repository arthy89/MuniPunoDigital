import React, { useEffect } from "react";
import { View, Text, Modal, StyleSheet, Platform } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';
const AlertIcon = ({ type }: { type: "success" | "error" }) => (
  <View
    style={[
      styles.iconCircle,
      { backgroundColor: type === "success" ? "#4fd18b" : "#ff5a5f" },
    ]}
  >
    <FontAwesome
      name={type === "success" ? "check" : "close"}
      size={40}
      color="#fff"
    />
  </View>
);

interface AlertsProps {
  visible: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const Alerts = ({ visible, type, message, onClose }: AlertsProps) => {
const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 2500);
      return () =>{
         clearTimeout(timer);
         navigation.navigate('Inicio');
        };
    }
  }, [visible, onClose]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <AlertIcon type={type} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(30,30,40,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: "center",
    width: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  message: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 28,
    marginTop: 12,
    color: "#232323",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
    letterSpacing: 0.2,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#4fd18b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default Alerts;