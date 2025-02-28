// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    "expo",
    "prettier", // Correcto, para que Prettier tome el control
    "plugin:prettier/recommended", // Añade esta línea para desactivar las reglas de formateo de ESLint
  ],
  ignorePatterns: ["/dist/*"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "off", // O "error" si prefieres errores
    "linebreak-style": ["error", "unix"], // Usa "unix" para LF o "windows" para CRLF
  },
};
