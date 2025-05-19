# VoltPilot

Este proyecto ha sido desarrollado como parte del Trabajo de Fin del Grado en la Universidad Complutense de Madrid.

Es una aplicación móvil para facilitar la búsqueda de estaciones de carga y el cálculo de rutas óptimas para conductores de coches eléctricos.

El enfoque principal del proyecto ha sido la especificación y el diseño de la aplicación, con el objetivo de aplicar los conocimientos adquiridos durante el grado y poner en práctica metodologías modernas de desarrollo de software.

## Instalación

1. Instalar node.js si lo tienes. Disponible en https://nodejs.org/

Ahora procedemos con los pasos para clonar el repositorio y la instalación de las dependencias.

2. Clonar el repositorio.

```
git clone https://github.com/TGF-2024-25/voltpilot.git
```

3. Ubicar en el directorio correcto.

```
cd .\voltpilot
```

4. Instalación de las dependencias del frontend.

```
cd .\frontend
npm install
```

5. Instalación de las dependencias del backend

```
cd ..
cd .\backend
npm install
```

## Pasos previos a la ejecución

Para que la aplicación pueda consumir servicios de terceros es necesario incluir 2 ficheros en directorios específicos para su correcto funcionamiento:

Crear un archivo con nombre .env y almacenalo tanto en la raíz de .\backend como .\frontend con los siguientes campos rellenos respectivamente.

Es posible que no sea necesario incluir el archivo en .\frontend pero se recomienda hacerlo para que todo funcione correctamente.

```
// Para backend
GOOGLE_MAPS_API_KEY=tu-google-api-key-aquí
FIREBASE_API_KEY=tu-firebase-api-key-aquí
NODE_ENV=development

// Para frontend
GOOGLE_MAPS_API_KEY=tu-google-api-key-aquí
```

Luego obtener un archivo serviceAccountKey.json de Firebase Console y ubicar el archivo en un directorio específico siguiendo estos pasos:

1. Accede a Firebase Console
2. Selecciona tu proyecto
3. Ve a la configuración del proyecto
4. Accede a las cuentas de servicio
5. Genera la clave privada
6. Guarda el archivo en .\backend\src\config

## Ejecución

Dado que no se ha generado un binario o archivo .apk para la aplicación, la ejecución se realizará a través de Expo Go. Esto permite probar la aplicación en un dispositivo móvil fácilmente. Solamente necesita escanear el código QR generado por Expo, y estar ambos dispositivos conectados en la misma red local.

La aplicación también puede ejecutarse mediante un emulador utilizando la herramienta de creación de dispositivos virtuales de Android Studio, en caso de no disponer de un dispositivos android. Sigue las instrucciones en línea para crear un dispositivo virtual y ejecutar Expo Go.

La versión de Expo Go para la ejecución de esta aplicación se puede instalar en el siguiente enlace: https://expo.dev/go?sdkVersion=52&platform=android&device=false.

### Ejecución en local

Como matiz antes de la ejecución de la aplicación, si se ha optado por una ejecución en un dispositivo físico Android, conectado por USB y con el modo desarrollador activado, hay que seguir los siguientes pasos para que la aplicación funcione de manera esperada:

1. Comprobar que su dispositivo haya sido reconocido y aparece con el comando
   (opcional).

```
adb devices
```

2. Redirección de puertos mencionado (opcional).

```
adb reverse tcp:5000 tcp:5000
```

3. Ejecución del frontend, donde se genera el código QR.

```
cd .\frontend
npm start --restart-cache
```

4. Ejecución del backend.

```
cd .\backend
npm start --restart-cache
```

### Ejecución en contenedor Docker

También se puede ejecutar el backend en un contenedor docker con los comandos siguientes (sustituye al fragmento de comando anterior):

Construir la imagen de Docker si es la primera vez que se ejecuta.

```
cd .\backend
docker build -t voltpilot-backend .
```

Ejecución de servicio backend habitual.

```
cd .\backend
docker run -p 5000:5000 voltpilot-backend
```

## Pruebas

Las pruebas únicamente se pueden ejecutar una vez dentro del directorio .\frontend mediante:

```
cd .\frontend
npm test
```

Se puede ejecutar una prueba específica de la siguiente manera:

```
npm test [Nombre de fichero de prueba]
```

## Licencia

Este proyecto está licenciado bajo los términos de la [Licencia MIT](LICENSE).
