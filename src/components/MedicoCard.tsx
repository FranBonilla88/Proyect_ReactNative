import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Card,
  Text,
  Avatar,
  IconButton,
  Button,
  Chip,
} from "react-native-paper";

interface MedicoProps {
  id: number;
  name: string;
  surname: string;
  specialty: string;
  email?: string; // Opcional, por si quieres mostrarlo
  onDelete: (id: number) => void;
}

export function MedicoCard({
  id,
  name,
  surname,
  specialty,
  email,
  onDelete,
}: MedicoProps) {
  // Generamos las iniciales para el avatar (Ej: Francisco -> F)
  const initials = name ? name[0].toUpperCase() : "M";

  return (
    <Card style={styles.card} mode="elevated">
      {/* Cabecera */}
      <Card.Title
        title={`${name} ${surname}`} // Nombre y Apellidos juntos
        titleVariant="titleMedium"
        subtitle={specialty} // La especialidad como subtítulo
        subtitleStyle={styles.specialty}
        // Icono a la izquierda: La inicial del nombre
        left={(props) => (
          <Avatar.Text
            {...props}
            label={initials}
            style={{ backgroundColor: "#6200ee" }}
            color="white"
          />
        )}
        // Botón de borrar a la derecha
        right={(props) => (
          <IconButton
            {...props}
            icon="delete-outline"
            iconColor="#B00020"
            onPress={() => onDelete(id)}
          />
        )}
      />

      <Card.Content style={styles.content}>
        {/* Si hay email, lo mostramos */}
        {email && (
          <Text variant="bodySmall" style={styles.email}>
            📧 {email}
          </Text>
        )}
      </Card.Content>

      <Card.Actions>
        <Button
          mode="text"
          onPress={() => console.log("Ver detalle del médico", id)}
        >
          Ver Ficha
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 10, // Un poco de margen a los lados queda mejor
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2, // Sombra suave en Android
  },
  specialty: {
    color: "#6200ee", // Color destacado para la especialidad
    fontWeight: "bold",
  },
  content: {
    marginTop: 0,
    marginBottom: 5,
  },
  email: {
    color: "#666",
    marginTop: 4,
  },
});
