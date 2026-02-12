import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Platform, StyleSheet, View } from "react-native";
import { ActivityIndicator, FAB, Text } from "react-native-paper";
import { MedicoCard } from "../src/components/MedicoCard";
import api from "../src/services/api";

export default function Listado() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Helper para mostrar mensajes (Multiplataforma)
  const showSimpleAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // 2. Función para obtener MÉDICOS (GET)
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response: any = await api.get("/doctors");

      // Asumimos que tu interceptor devuelve la respuesta directa
      // y que la estructura es { ok: true, datos: [...] }
      if (response.datos) {
        setDoctors(response.datos);
      } else {
        // Fallback por si la estructura es diferente
        setDoctors(response || []);
      }
    } catch (error: any) {
      console.error(error);
      showSimpleAlert(
        "Error",
        error.mensaje || "No se pudieron cargar los médicos",
      );
    } finally {
      setLoading(false);
    }
  };

  // 3. Refrescar datos al entrar en la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchDoctors();
    }, []),
  );

  // 4. Lógica de borrado
  const handleDelete = (id: number) => {
    const title = "Eliminar";
    const msg = "¿Estás seguro de que quieres eliminar este médico?";

    if (Platform.OS === "web") {
      if (window.confirm(`${title}\n\n${msg}`)) {
        ejecutarBorrado(id);
      }
    } else {
      Alert.alert(title, msg, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => ejecutarBorrado(id),
          style: "destructive",
        },
      ]);
    }
  };

  const ejecutarBorrado = async (id: number) => {
    try {
      // ⚠️ CORREGIDO: endpoint cambiado de /directors a /doctors
      await api.delete(`/doctors/${id}`);
      showSimpleAlert("Éxito", "Médico eliminado");
      fetchDoctors(); // Recargar la lista tras borrar
    } catch (error: any) {
      showSimpleAlert("Error", "No se pudo eliminar el registro");
    }
  };

  // 5. Renderizado de Carga
  if (loading && doctors.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} color="#6200ee" size="large" />
        <Text style={{ marginTop: 10 }}>Cargando médicos...</Text>
      </View>
    );
  }

  // 6. Renderizado Principal
  return (
    <View style={styles.container}>
      <FlatList
        data={doctors}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        // Renderizado de cada tarjeta
        renderItem={({ item }) => (
          <MedicoCard
            id={item.id}
            name={item.name}
            surname={item.surname}
            specialty={item.specialty}
            email={item.email}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        // Componente cuando la lista está vacía (CORREGIDO: Ahora está dentro del FlatList)
        ListEmptyComponent={
          <View style={styles.center}>
            <Text variant="bodyLarge">No hay médicos disponibles</Text>
          </View>
        }
      />

      {/* Botón flotante */}
      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={fetchDoctors}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50, // Un poco de margen si la lista está vacía
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Espacio para el FAB
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
});
