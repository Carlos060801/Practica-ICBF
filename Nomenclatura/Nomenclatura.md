## Politica de Nomenclatura
----------------------------------
📐 Política de Nomenclatura para la aplicación Movil  SIGE

1. Objetivo:
Establecer un conjunto de normas y convenciones para la asignación de nombres dentro del sistema distribuido SIGE, con el fin de grantizar la coherencia, legibilidad, mantenimiento y escalabilidad del codigo fuente, las base de datos que se creo en respuesta del chatboot, los componentes móviles y los servicios asociados al sistema.

2. Alcance del proyecto: 
Está politica aplicada a todos los elementos del proyecto de la aplicación movil SIGE, incluyendo: 
* Código fuente del frontend (Flutter/Dart).
* Código del backend (API REST, base de datos para el chatboot, Microservicios).
* Documentación técnica y funsional.
* Nombres de versiones y módulos del sistema.
------------------------------------------
4. Convenciones Técnicas
4.1 Código fuente (Flutter/Dart)
* Clases: PascalCase → Ejemplo: UsuarioModel, LoginController.

* Variables: camelCase → Ejemplo: userName, tokenId.

* Constantes: UPPER_CASE → Ejemplo: API_URL, MAX_USERS.

* Archivos: snake_case → Ejemplo: login_page.dart, user_service.dart.

* Widgets personalizados: deben incluir el sufijo Widget → Ejemplo: ChatBotWidget.

4.2. Carpetas del proyecto

* /lib/screens/ → interfaces gráficas.
* /lib/services/ → conexión con la nube (API).
* /lib/models/ → estructuras de datos.
* /lib/utils/ → funciones auxiliares.
* /assets/images/ → recursos gráficos.
* /assets/pdf/ → recursos PDF
/assets/docs/ → documentos y políticas institucionales.

4.4. APIs y servicios distribuidos

Endpoints: en minúsculas y separados por guion.
Ejemplo: /api/usuarios/listar, /api/politicas/actualizar.

Versionado de API: v1, v2, etc.
Ejemplo: /api/v1/usuarios.
-----------------------------------------
5 Versionando del sistema
El control de versiones del sistema SIGE seguirá el formato:
SIGE v1.1.2
------------------------------------------
6 Nomenclatura Institucional y Documental 
* Políticas: POL_calidad.pdf
* Política: POL_ambiental.pdf
* Política: POL_Riesgos.pdf
* Política: POL_SGSI.pdf
* Política: POL_tratamiento de datos.pdf
* Política: POL_SST.pdf
Manuales: MAN_MovilSIGE.pdf
Reportes: REP_2025_10_Seguridad.pdf
-----------------------------------------
7.Cumplimiento
Todos miembro del equipo de desarrollo y mantenimiento deberá respetar esta política.
Las revisiones de código y despliegue incluirán las verificación del cumplimiento de las normas aquí descritas. 
----------------------------------------
8. Revisión y Actualización

La política será revisada cada 6 meses o cuando se integre un nuevo componente al sistema distribuido SIGE