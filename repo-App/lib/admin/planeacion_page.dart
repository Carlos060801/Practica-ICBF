import 'package:flutter/material.dart';

class PlaneacionPage extends StatelessWidget {
  const PlaneacionPage({super.key});

  Widget _seccionTitulo(String titulo) {
    return Padding(
      padding: const EdgeInsets.only(left: 16, top: 12, bottom: 6),
      child: Text(
        titulo,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Color(0xFF2E7D32),
        ),
      ),
    );
  }

  Widget _seccionCard({
    required Color color,
    required String titulo,
    required List<Widget> opciones,
  }) {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              titulo,
              style: const TextStyle(
                  fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            ...opciones
          ],
        ),
      ),
    );
  }

  Widget _botonOpcion(String texto, IconData icon, {VoidCallback? onPressed}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: ElevatedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, color: Colors.white),
        label: Text(texto),
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF4CAF50),
          minimumSize: const Size(double.infinity, 45),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F4F4),
      appBar: AppBar(
        backgroundColor: const Color(0xFF4CAF50),
        title: const Text("Coordinación de Planeación de Sistemas",
            style: TextStyle(color: Colors.white)),
        actions: [
          PopupMenuButton(
            icon: const Icon(Icons.settings, color: Colors.white),
            itemBuilder: (context) => [
              PopupMenuItem(
                child: ListTile(
                  leading: const Icon(Icons.person),
                  title: const Text("Configuración de Cuenta"),
                  onTap: () {
                    Navigator.pop(context);
                    // Ir a Configuración Cuenta
                  },
                ),
              ),
              PopupMenuItem(
                child: ListTile(
                  leading: const Icon(Icons.logout, color: Colors.red),
                  title: const Text("Cerrar Sesión", style: TextStyle(color: Colors.red)),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                ),
              ),
            ],
          )
        ],
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            // Panel superior
            _seccionTitulo("Panel de Control"),
            const Text("Funciones Estratégicas",
                style: TextStyle(fontSize: 14, color: Colors.black54)),
            const SizedBox(height: 10),

            // Gestión de Roles
            _seccionCard(
              color: Colors.blue,
              titulo: "Gestión de Roles",
              opciones: [
                _botonOpcion("Asignar Roles Admin", Icons.manage_accounts),
                _botonOpcion("Ver Usuarios y Permisos", Icons.group),
                _botonOpcion("Historial de Cambios", Icons.history),
              ],
            ),

            // Gestión de Políticas
            _seccionCard(
              color: Colors.orange,
              titulo: "Gestión de Políticas",
              opciones: [
                _botonOpcion("Administrar Políticas SGSI", Icons.policy),
                _botonOpcion("Publicar Nuevas Normativas", Icons.upload_file),
                _botonOpcion("Dashboard de Sistemas", Icons.dashboard),
                _botonOpcion("Revisar Documentación Legal", Icons.library_books),
              ],
            ),

            // Monitoreo y Analíticas
            _seccionCard(
              color: Colors.green,
              titulo: "Monitoreo y Analíticas",
              opciones: [
                _botonOpcion("Reportes de Rendimiento", Icons.insert_chart),
                _botonOpcion("Alertas y Notificaciones", Icons.notifications_active),
              ],
            ),
          ],
        ),
      ),

      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF4CAF50),
        child: const Icon(Icons.add, size: 32),
        onPressed: () {
          // Modal para crear nueva tarea / función
        },
      ),
    );
  }
}
