# La China Sports – Frontend y Backend

Aplicación web para mostrar eventos deportivos en vivo con un panel de administración, autenticación con roles y verificación por correo. El proyecto está dividido en dos partes dentro de esta misma carpeta: Frontend (React + Vite) y Backend (Node + Express + Prisma + SQLite).

## Visión general

- Frontend: interfaz en React con TypeScript, Tailwind CSS y componentes shadcn/ui. Maneja rutas públicas y privadas, sesión global, páginas de login/registro, recuperación de contraseña y panel de administración.
- Backend: API REST en Express con persistencia mediante Prisma ORM y SQLite. Incluye registro, login con cookie httpOnly (JWT), verificación de email por token, recuperación de contraseña, y endpoints exclusivos para administradores.

## Frontend

- Pila técnica: React 18, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, shadcn/ui.
- Rutas principales: página de inicio, login, registro, recuperar contraseña, restablecer contraseña, panel admin y una página de prueba solo-admin.
- Sesión global: un proveedor de autenticación consulta el estado de sesión al iniciar y expone usuario y acciones (conectar, desconectar, refrescar). La cookie es httpOnly, por lo que el frontend consulta al backend para conocer el usuario.
- Roles: si el usuario tiene rol de administrador, el encabezado muestra “modo administrador” y un enlace “Panel Admin”. No hay redirección forzada al panel tras el login, se permanece en la página principal y el panel es accesible desde el encabezado.
- Recuperación de contraseña: flujo de solicitar reseteo y restablecer mediante token (enlace recibido por correo).
- Verificación de email: el frontend debe ofrecer una página que reciba el token por parámetro y muestre el resultado de la verificación (el backend ya lo soporta).
- Proxy de desarrollo: las peticiones que comienzan con /api se redirigen al backend local para simplificar el desarrollo.

## Backend

- Pila técnica: Node.js, Express, Prisma ORM, SQLite, JWT en cookie httpOnly, Nodemailer para correo.
- Modelos principales:
  - Usuario: nombre, email único, hash de contraseña, rol (cadena), marca de verificación, fechas, relaciones.
  - PasswordReset: tokens de reseteo con expiración y marca de uso.
  - EmailVerification: tokens de verificación con expiración y marca de uso.
- Autenticación y seguridad:
  - Registro: crea usuario, genera token de verificación y envía correo (o deja registro en logs si no hay SMTP). Por defecto se crea sesión, pero el login está bloqueado si no verifica el correo.
  - Login: valida credenciales y rechaza usuarios no verificados con un mensaje claro para reenviar verificación.
  - Sesión actual: endpoint que devuelve datos del usuario autenticado para que el frontend mantenga estado de sesión.
  - Logout: borra la cookie de sesión.
- Administración (solo administradores):
  - Listado de usuarios: visualiza id, nombre, email, rol, fechas y el hash de contraseña.
  - Restablecer contraseña: acción para actualizar la contraseña de un usuario en caso de emergencia (requiere mínimo de longitud y credenciales de admin).
- Correo (SMTP):
  - Si configuras SMTP, los correos de verificación se envían realmente. Si no, el servidor no expone tokens por la API ni en el frontend, y registra el contenido del mensaje en los logs del backend para uso exclusivamente en desarrollo.

## Requisitos previos

- Node.js 18 o superior.
- Acceso a Internet para instalar dependencias y, opcionalmente, un servidor SMTP (Mailtrap, Gmail con contraseña de aplicación, SendGrid u otro proveedor).

## Puesta en marcha en desarrollo

1. Instalar dependencias del frontend en la carpeta raíz del proyecto.
2. Iniciar el frontend en el puerto 8080.
3. Entrar a la carpeta del backend (server), instalar dependencias y generar cliente de Prisma.
4. Ejecutar la migración para crear la base de datos SQLite.
5. Iniciar el backend en el puerto 3001.
6. Abrir el navegador en la dirección local del frontend y probar login/registro.

Las URLs por defecto son: frontend en http://localhost:8080 y backend en http://localhost:3001. El proxy del frontend enruta las peticiones que empiezan por /api al backend.

## Variables de entorno del backend (server/.env)

- Conexión a base de datos SQLite: ruta del archivo (ya preconfigurada). 
- Puerto del servidor backend.
- Secreto JWT para firmar la cookie de sesión.
- Envío de correos (opcional, recomendado en producción): host, puerto, usuario, contraseña y remitente. Si no se configuran estos datos, el servidor no enviará correos reales y registrará los intentos de envío únicamente en la consola del backend para desarrollo.
- URL pública del frontend: utilizada para construir los enlaces de verificación por correo.

## Flujo de autenticación

- Registro: crea usuario, genera token de verificación con caducidad y envía correo. En desarrollo, el token no se devuelve por la API, solo se registra en el servidor si no hay SMTP. El usuario debe verificar antes de iniciar sesión con normalidad.
- Login: al autenticar, se entrega una cookie httpOnly. El frontend consulta la sesión para conocer el usuario y su rol.
- Cerrar sesión: borra la cookie.

## Panel de administración

- Accesible desde el encabezado cuando el usuario autenticado tiene rol de administrador.
- Lista usuarios con sus datos básicos y hash de contraseña.
- Permite restablecer contraseñas en caso de emergencia.

## Migraciones y base de datos

- Prisma gestiona el esquema y las migraciones. Al cambiar el modelo, se debe generar una nueva migración y aplicarla para mantener la base de datos sincronizada.
- Para desarrollo, la base de datos SQLite se guarda en un archivo dentro de la carpeta del backend. Es portátil junto con el proyecto, aunque no se recomienda versionarlo.

## Preparación para subir a GitHub y mover a otra PC

1. Inicializa un repositorio Git en la carpeta raíz del proyecto si aún no está inicializado.
2. Asegúrate de tener un archivo de ignorados adecuado para no incluir dependencias ni archivos sensibles (por ejemplo, node_modules, la base SQLite y el archivo .env del backend).
3. Realiza un primer commit con todos los archivos del proyecto.
4. Crea un repositorio remoto en tu proveedor (GitHub) y enlázalo con el repositorio local.
5. Sube tu rama principal al remoto.
6. En la otra PC, clona el repositorio remoto en una carpeta de trabajo.
7. Instala dependencias tanto del frontend (carpeta raíz) como del backend (carpeta server).
8. Crea el archivo de variables de entorno en el backend (.env) con los parámetros apropiados en la nueva máquina.
9. Ejecuta las migraciones del backend para crear/actualizar la base de datos y levanta ambos servidores.

Consejo: no incluyas el archivo .env ni la base de datos en el control de versiones. Documenta internamente los valores necesarios para cada entorno (desarrollo, pruebas y producción) y utiliza gestores de secretos o variables de entorno del sistema.

## Soporte y mantenimiento

- Verifica periódicamente las dependencias para aplicar actualizaciones y parches de seguridad.
- Configura un proveedor SMTP de confianza y ajusta políticas de SPF/DKIM/DMARC para mejorar la entregabilidad de correos en producción.
- En producción, sirve el frontend detrás de un servidor web y el backend detrás de un proxy inverso con HTTPS.
