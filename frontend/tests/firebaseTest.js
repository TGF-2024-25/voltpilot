import React, { useState } from "react";
import { auth } from "./firebaseConfig"; // Asegúrate de importar desde tu archivo de configuración
import { createUserWithEmailAndPassword } from "firebase/auth";

const FirebaseTest = () => {
  const [email, setEmail] = useState("testuser@example.com"); // Usa un correo ficticio para la prueba
  const [password, setPassword] = useState("testpassword"); // Usa una contraseña ficticia

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Usuario creado con éxito:", userCredential.user);
    } catch (error) {
      console.error("Error al crear el usuario:", error.message);
    }
  };

  return (
    <div>
      <button onClick={handleSignUp}>Probar Registro en Firebase</button>
    </div>
  );
};

export default FirebaseTest;
