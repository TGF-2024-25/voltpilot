# VoltPilot

Este proyecto ha sido desarrollado como parte del Trabajo de Fin del Grado en la Universidad Complutense de Madrid.

Es una aplicación móvil para facilitar la búsqueda de estaciones de carga y el cálculo de rutas óptimas para conductores de coches eléctricos.

El enfoque principal del proyecto ha sido la especificación y el diseño de la aplicación, con el objetivo de aplicar los conocimientos adquiridos durante el grado y poner en práctica metodologías modernas de desarrollo de software.

## Instalación

Para empezar, se ha que localizar en el directorio base del proyecto.

Ejecutar los siguientes comandos en orden para instalar las dependencias y paquetes necesarias:

```
cd .\frontend
npm install
```

```
cd .. && cd .\backend
npm install
```

## Ejecución

Dado que no se ha generado un binario o archivo .apk para la aplicación, la ejecución se realizará a través de Expo Go. Esto permite probar la aplicación en un dispositivo móvil fácilmente. Solamente necesita escanear el código QR generado por Expo, y estar ambos dispositivos conectados en la misma red local.

La aplicación también puede ejecutarse mediante un emulador utilizando la herramienta de creación de dispositivos virtuales de Android Studio, en caso de no disponer de un dispositivos android. Sigue las instrucciones en línea para crear un dispositivo virtual y ejecutar Expo Go.

La versión de Expo Go para la ejecución de esta aplicación se puede instalar en el siguiente enlace: https://expo.dev/go?sdkVersion=52&platform=android&device=false.

De nuevo nos ubicamos en el directorio raíz del proyecto.

Ejecución del frontend, donde se genera el código QR:

```
cd .\frontend
npm start
```

Ejecución del backend:

```
cd .. && cd .\backend
npm start
```

También se puede ejecutar el backend en un contenedor docker con los comandos siguientes (sustituye al fragmento de comando anterior):

```
cd .. && cd .\backend
docker build -t voltpilot-backend .
docker run -p 5000:5000 voltpilot-backend
```

## Pruebas

Las pruebas únicamente se pueden ejecutar una vez dentro del directorio .\frontend mediante:

```
npm test
```

## Licencia

Este proyecto está licenciado bajo los términos de la [Licencia MIT](LICENSE).
