import React from "react";
import {Text, StyleSheet, Image } from "react-native";

const ComingSoon = () => (
  < >
    <Image
      source={{ uri: "https://th.bing.com/th/id/OIP.WNF_eu26A9S3vNKD1rDExQHaE7?rs=1&pid=ImgDetMain" }} // Puedes reemplazar con una imagen atractiva
      style={styles.image}
    />
    <Text style={styles.title}>¡Aplicación en desarrollo!</Text>
    <Text style={styles.subtitle}>Próximamente disponible</Text>
  </>
);

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0088cc",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});

export default ComingSoon;