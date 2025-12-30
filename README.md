# Generador de Asignaciones S-89

Aplicación para generar y descargar asignaciones para las reuniones de Vida y Ministerio Cristianos en formato de tarjetas S-89.

## Características

- 📋 Formulario para completar datos de asignación
- 👥 Gestor de nombres personalizable
- 🖼️ Generación de imágenes de alta calidad
- 📥 Descarga de asignaciones como PNG
- 📋 Copiar imágenes al portapapeles
- 🔗 Compartir directamente desde el móvil
- 💾 Almacenamiento local de datos

## Requisitos

- Node.js (v14 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <repository-url>
   cd asignación-s-89-s-generator
   ```

2. Instalar dependencias:
   ```bash
   yarn install
   # o
   npm install
   ```

## Uso Local

Ejecutar el servidor de desarrollo:
```bash
yarn start
# o
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### En dispositivos móviles

Para acceder desde otro dispositivo en la misma red:
1. Obtén la IP local de tu Mac: `ifconfig | grep "inet "`
2. Accede desde el móvil a `http://<tu-ip>:3000`

## Scripts disponibles

- `yarn start` - Inicia el servidor de desarrollo
- `yarn build` - Compila la aplicación para producción
- `yarn preview` - Vista previa de la build

## Tecnologías

- React + TypeScript
- Vite
- Tailwind CSS
- html-to-image
- Lucide Icons
