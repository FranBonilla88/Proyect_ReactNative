import React, { useState } from "react";
import { StyleSheet, ScrollView, Alert, Platform } from "react-native"; // <--- Fíjate aquí
import { TextInput, Text, Button } from "react-native-paper"; // <--- Y aquí
import api from "../src/services/api";

export default function AltaMedico() {
  // Estado para el formulario basado en tu JSON de la API
  const [form, setForm] = useState({
    name: "",
    surname: "",
    age: "",
    specialty: "",
    email: "",
    phone: "",
    salary: "",
    active: "",
  });

  const [loading, setLoading] = useState(false);

  // Helper para mostrar alert con fallback en web
  const showAlert = (title: string, message?: string) => {
    if (Platform.OS === "web") {
      // window.alert funciona en la web (Expo web)
      window.alert(title + (message ? "\n\n" + message : ""));
    } else {
      Alert.alert(title, message);
    }
  };

  // Función para enviar los datos
  const handleSave = async () => {
    console.log("[AltaMedico] handleSave called — form:", form);
    // Validación simple
    if (
      !form.name ||
      !form.surname ||
      !form.age ||
      !form.specialty ||
      !form.email ||
      !form.phone ||
      !form.salary ||
      !form.active
    ) {
      showAlert("Error", "Por favor, debes rellenar cada uno de los campos.");
      return;
    }

    setLoading(true);
    try {
      // Usamos el endpoint para el alta
      await api.post("/doctors", form);

      showAlert("Éxito", "Medico creado correctamente");

      // Limpiar formulario tras éxito
      setForm({
        name: "",
        surname: "",
        age: "",
        specialty: "",
        email: "",
        phone: "",
        salary: "",
        active: "",
      });
    } catch (error: any) {
      // El interceptor que creamos antes manejará el log,
      // aquí mostramos el error en consola y al usuario.
      console.error("[AltaMedico] save error:", error);
      showAlert("Error", error?.mensaje || "No se pudo crear el medico");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Nuevo Medico
      </Text>

      <TextInput
        label="Nombre"
        value={form.name}
        onChangeText={(text: string) => setForm({ ...form, name: text })}
        mode="outlined"
        style={styles.input}
        placeholder="Ej: Carles"
      />

      <TextInput
        label="Apellidos"
        value={form.surname}
        onChangeText={(text: string) => setForm({ ...form, surname: text })}
        mode="outlined"
        style={styles.input}
        placeholder="Ej: Puigdemon Sanchez"
      />

      <TextInput
        label="Edad"
        value={form.age}
        onChangeText={(text: string) => setForm({ ...form, age: text })}
        mode="outlined"
        style={styles.input}
        placeholder="Ej: 30"
      />

      <TextInput
        label="Especialidad"
        value={form.specialty}
        onChangeText={(text: string) => setForm({ ...form, specialty: text })}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Email"
        value={form.email}
        onChangeText={(text: string) => setForm({ ...form, email: text })}
        mode="outlined"
        style={styles.input}
        placeholder="Ej: prueba@companion.com"
      />

      <TextInput
        label="Telefono"
        value={form.phone}
        onChangeText={(text: string) => setForm({ ...form, phone: text })}
        mode="outlined"
        style={styles.input}
        placeholder="Ej: 68394823"
      />

      <TextInput
        label="Salario"
        value={form.salary}
        onChangeText={(text: string) => setForm({ ...form, salary: text })}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Es activo"
        value={form.active}
        onChangeText={(text: string) => setForm({ ...form, active: text })}
        mode="outlined"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        icon="content-save"
        style={styles.button}
      >
        Guardar Director
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: 20,
    color: "#6200ee",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});
