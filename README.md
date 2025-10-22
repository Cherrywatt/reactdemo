# LA China Sports React

Una aplicación web moderna para mostrar puntuaciones en vivo de partidos deportivos en un bar/establecimiento.

## Tecnologías Utilizadas

- **React 18** con TypeScript
- **Vite** como bundler y servidor de desarrollo
- **Tailwind CSS** para estilos
- **shadcn/ui** como librería de componentes UI
- **React Router DOM** para navegación
- **TanStack Query** para manejo de estado del servidor

## Características

- Visualización de partidos en vivo
- Múltiples deportes (Fútbol, Baloncesto, Béisbol)
- Menú del establecimiento
- Diseño responsive y moderno
- Tema oscuro con efectos visuales
- Animaciones para partidos en vivo

## Instalación y Desarrollo

### Requisitos Previos
- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd bar-live-scores

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

### Comandos Disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 8080)
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linting del código
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base de shadcn/ui
│   ├── Header.tsx      # Cabecera con navegación
│   ├── SportsTabs.tsx  # Pestañas de deportes
│   ├── MatchCard.tsx   # Tarjeta de partido
│   ├── LeaguesSidebar.tsx # Sidebar de ligas
│   └── MenuSidebar.tsx # Sidebar del menú del bar
├── pages/              # Páginas de la aplicación
│   ├── Index.tsx       # Página principal
│   └── NotFound.tsx    # Página 404
├── hooks/              # Hooks personalizados
├── lib/                # Utilidades
└── main.tsx           # Punto de entrada
```

## Personalización

### Colores del Tema
- **Primario**: Naranja vibrante
- **Secundario**: Azul
- **Fondo**: Negro oscuro
- **Live**: Naranja con animación de pulso

### Configuración
Los colores y estilos se pueden personalizar en `src/index.css` y `tailwind.config.ts`.

## Despliegue

Para desplegar la aplicación:

```bash
# Crear build de producción
npm run build

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para cualquier mejora.