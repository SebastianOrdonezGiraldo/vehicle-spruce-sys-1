# Vehicle Spruce System Frontend

Interfaz de usuario moderna para el sistema de gestión de lavado de vehículos "Vehicle Spruce System". Esta aplicación web proporciona una experiencia de usuario intuitiva para administrar clientes, vehículos, servicios, empleados, inventario y más.

![Captura de Pantalla del Dashboard](screenshot-dashboard.png)

## Características

- 💻 Interfaz de usuario moderna y responsive
- 📱 Diseño adaptado a dispositivos móviles y escritorio
- 📦 Gestión completa de clientes y vehículos
- 🚗 Seguimiento de servicios de lavado en tiempo real
- 👥 Administración de empleados
- 🧰 Control de inventario con alertas de stock bajo
- 📊 Dashboard con estadísticas clave
- 📈 Reportes y análisis de datos
- ⚙️ Configuraciones personalizables

## Tecnologías

- React
- TypeScript
- Tailwind CSS
- React Router
- React Query (TanStack Query)
- Shadcn/UI (componentes basados en Radix UI)
- Axios
- Vite

## Estructura del Proyecto

```
src/
 ├── api/             # Funciones que interactúan con el backend
 ├── components/      # Componentes reutilizables
 │   ├── ui/          # Componentes de interfaz base (shadcn/ui)
 │   └── ...          # Otros componentes específicos
 ├── hooks/           # Hooks personalizados
 ├── layout/          # Componentes de layout
 ├── lib/             # Funciones de utilidad
 ├── pages/           # Componentes página (rutas)
 └── App.tsx          # Componente raíz y configuración
```

## Requisitos Previos

- Node.js (v14.x o superior)
- npm (v6.x o superior)
- Backend del Vehicle Spruce System configurado y funcionando

## Instalación

1. Clonar el repositorio:
   ```
   git clone https://github.com/tu-usuario/vehicle-spruce-system-frontend.git
   cd vehicle-spruce-system-frontend
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```
   VITE_API_URL=http://localhost:3001/api
   ```
   *Nota: Ajusta la URL del API según dónde esté alojado tu backend.*

## Ejecutar la Aplicación

### Desarrollo

```bash
npm run dev
```

Este comando inicia el servidor de desarrollo Vite en modo desarrollo con hot-reload.

### Producción

```bash
npm run build
npm run preview
```

El comando `build` genera una versión optimizada para producción en la carpeta `dist`.
El comando `preview` permite ver la versión de producción localmente.

## Principales Rutas

- `/` - Dashboard (página principal)
- `/vehicle-registration` - Registro de vehículos y clientes
- `/pending-services` - Gestión de servicios pendientes
- `/employees` - Administración de empleados
- `/inventory` - Control de inventario
- `/reports` - Reportes y análisis
- `/settings` - Configuración del sistema

## Componentes Destacados

### Páginas
- **Dashboard**: Muestra estadísticas clave y servicios pendientes
- **VehicleRegistration**: Formulario para registrar vehículos y clientes
- **PendingServices**: Lista de servicios en proceso con opciones de asignación
- **Employees**: CRUD completo para empleados
- **Inventory**: Gestión de inventario con alertas de stock bajo
- **Reports**: Visualización de datos con gráficos
- **Settings**: Personalización del sistema

### Componentes Compartidos
- **ServiceCard**: Muestra información de un servicio pendiente
- **InventoryItemCard**: Visualiza un item de inventario
- **EmployeeForm**: Formulario para crear/editar empleados
- **AdjustQuantityForm**: Formulario para ajustar stock
- **AddServiceForm**: Formulario para agregar un nuevo servicio

## Personalización

### Temas
La aplicación utiliza Tailwind CSS y puede personalizarse fácilmente:

1. Modificar los colores y otras variables en `tailwind.config.js`
2. Ajustar estilos globales en `src/index.css`

### Componentes
Todos los componentes UI se basan en shadcn/ui y se pueden personalizar en `src/components/ui/`.

## Scripts

- `npm run dev` - Inicia el servidor de desarrollo Vite
- `npm run build` - Compila la aplicación para producción
- `npm run preview` - Vista previa local de la versión compilada
- `npm run lint` - Ejecuta ESLint para verificar el código
- `npm run test` - Ejecuta las pruebas (si están configuradas)

## Integración con el Backend

La aplicación se comunica con el backend a través de módulos API ubicados en `src/api/`. Estos módulos utilizan Axios para hacer peticiones HTTP y están organizados por entidad:

- `customerApi.ts` - Operaciones con clientes
- `vehicleApi.ts` - Operaciones con vehículos
- `serviceApi.ts` - Operaciones con servicios
- `employeeApi.ts` - Operaciones con empleados
- `inventoryApi.ts` - Operaciones con inventario
- `pendingServiceApi.ts` - Operaciones con servicios pendientes
- `dashboardApi.ts` - Datos para el dashboard

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva característica'`)
4. Sube tus cambios a tu fork (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Sebastian Ordoñez Giraldo - [sebastian789go@gmail.com] 

Link del Proyecto: [https://github.com/SebastianOrdonezGiraldo/vehicle-spruce-sys.git]

## Agradecimientos

- [Shadcn/UI](https://ui.shadcn.com/) - Componentes UI increíbles
- [TanStack Query](https://tanstack.com/query) - Gestión de estado excepcional
- [Tailwind CSS](https://tailwindcss.com/) - Por hacer el estilizado tan sencillo
- [Lucide Icons](https://lucide.dev/) - Iconos utilizados en la aplicación