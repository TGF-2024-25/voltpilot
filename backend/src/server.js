import app from "./app.js";

const PORT = 5000;

// inicia el servidor
const server = app.listen(PORT, () => {
  console.log(`✅ servidor iniciado correctamente en ${PORT}`);
  console.log(`🌐 aceeder localhost: http://localhost:${PORT}`);
  console.log(`⚙️ environment: ${process.env.NODE_ENV || "development"}`);
});

// maneja la señal SIGINT (Ctrl+C) para cerrar el servidor
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("✅ Servidor cerrado correctamente");
  });
});

export default server;
