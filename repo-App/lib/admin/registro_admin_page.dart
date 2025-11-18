import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class RegistroAdminPage extends StatefulWidget {
  const RegistroAdminPage({super.key});

  @override
  State<RegistroAdminPage> createState() => _RegistroAdminPageState();
}

class _RegistroAdminPageState extends State<RegistroAdminPage> {
  final TextEditingController emailCtrl = TextEditingController();
  final TextEditingController passCtrl = TextEditingController();

  String? rolSeleccionado;
  bool cargando = false;

  // ✅ Cambiar a 10.0.2.2 si ejecutas en emulador Android
  final String apiUrl = "http://localhost:3000/api/auth/register";

  Future<void> registrar() async {
    final email = emailCtrl.text.trim().toLowerCase();
    final password = passCtrl.text.trim();

    if (email.isEmpty || password.isEmpty || rolSeleccionado == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("⚠️ Todos los campos son obligatorios")),
      );
      return;
    }

    setState(() => cargando = true);

    try {
      final respuesta = await http.post(
        Uri.parse(apiUrl),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "email": email,
          "password": password,
          "role": rolSeleccionado,
        }),
      );

      setState(() => cargando = false);

      if (respuesta.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("✅ Usuario registrado correctamente")),
        );
        Navigator.pop(context); // Volver atrás
      } else {
        final data = jsonDecode(respuesta.body);
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text("❌ ${data['message']}")));
      }
    } catch (e) {
      setState(() => cargando = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("❌ Error al conectar con el servidor")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF4CAF50),
        title: const Text(
          "Registro de Administradores",
          style: TextStyle(color: Colors.white),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(22),
        child: Column(
          children: [
            const SizedBox(height: 10),
            const Icon(
              Icons.admin_panel_settings,
              size: 100,
              color: Color(0xFF4CAF50),
            ),
            const SizedBox(height: 25),

            // ✅ Campo Email
            TextField(
              controller: emailCtrl,
              decoration: const InputDecoration(
                labelText: "Correo institucional ICBF",
                prefixIcon: Icon(Icons.email),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),

            // ✅ Campo Contraseña
            TextField(
              controller: passCtrl,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: "Contraseña",
                prefixIcon: Icon(Icons.lock),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),

            // ✅ Dropdown Rol
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: "Rol del Usuario",
              ),
              value: rolSeleccionado,
              items: const [
                DropdownMenuItem(
                  value: "admin_app",
                  child: Text("Admin de la Aplicación"),
                ),
                DropdownMenuItem(
                  value: "planeacion",
                  child: Text("Coordinadora de Planeación"),
                ),
                DropdownMenuItem(
                  value: "principal_icbf",
                  child: Text("Coordinadora Principal ICBF"),
                ),
              ],
              onChanged: (value) => setState(() => rolSeleccionado = value),
            ),
            const SizedBox(height: 26),

            // ✅ Botón Registrar
            cargando
                ? const CircularProgressIndicator()
                : ElevatedButton.icon(
                    onPressed: registrar,
                    icon: const Icon(Icons.save, color: Colors.white),
                    label: const Text(
                      "Registrar Usuario",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4CAF50),
                      padding: const EdgeInsets.symmetric(
                        vertical: 14,
                        horizontal: 50,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}
