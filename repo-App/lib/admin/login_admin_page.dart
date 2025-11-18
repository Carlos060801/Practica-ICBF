import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// Pantallas según rol
import 'admin_app_page.dart';
import 'planeacion_page.dart';
import 'principal_page.dart';

// 🔐 Importar configuración global
import '../config.dart';

class LoginAdminPage extends StatefulWidget {
  const LoginAdminPage({super.key});

  @override
  State<LoginAdminPage> createState() => _LoginAdminPageState();
}

class _LoginAdminPageState extends State<LoginAdminPage> {
  final TextEditingController emailCtrl = TextEditingController();
  final TextEditingController passCtrl = TextEditingController();
  bool cargando = false;

  // URL del login
  final String apiUrl = "${Config.apiUrl}/api/auth/login";

  Future<void> login() async {
    setState(() => cargando = true);

    try {
      final respuesta = await http.post(
        Uri.parse(apiUrl),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "email": emailCtrl.text.trim(),
          "password": passCtrl.text.trim(),
        }),
      );

      setState(() => cargando = false);

      if (respuesta.statusCode == 200) {
        final data = jsonDecode(respuesta.body);

        // =======================================================
        // 🔐  GUARDAR TOKEN GLOBALMENTE
        // =======================================================
        Config.token = data["token"] ?? "";

        print("🔐 TOKEN GUARDADO:");
        print(Config.token);

        final rol = data["role"];

        // =======================================================
        // 🚀 Redirección por rol
        // =======================================================
        if (rol == "admin_app") {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const AdminAppPage()),
          );
        } else if (rol == "planeacion") {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const PlaneacionPage()),
          );
        } else if (rol == "principal_icbf") {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const PrincipalPage()),
          );
        } else {
          _mensaje("⚠️ Este usuario no tiene permisos válidos");
        }
      } else {
        _mensaje("❌ Credenciales incorrectas");
      }
    } catch (e) {
      setState(() => cargando = false);
      _mensaje("⚠️ No se pudo conectar con el servidor");
    }
  }

  void _mensaje(String texto) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(texto)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF4CAF50),
        title: const Text(
          "Login Administrativo",
          style: TextStyle(color: Colors.white),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(22),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // LOGO
              Image.asset('assets/imagenes/logo_icbf.png', height: 130),
              const SizedBox(height: 35),

              // CAMPO EMAIL
              TextField(
                controller: emailCtrl,
                decoration: const InputDecoration(
                  labelText: "Correo ICBF",
                  prefixIcon: Icon(Icons.email),
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 18),

              // CAMPO PASSWORD
              TextField(
                controller: passCtrl,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: "Contraseña",
                  prefixIcon: Icon(Icons.lock),
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 30),

              // BOTÓN LOGIN
              cargando
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                      onPressed: login,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4CAF50),
                        padding: const EdgeInsets.symmetric(
                          vertical: 14,
                          horizontal: 60,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        "Ingresar",
                        style: TextStyle(color: Colors.white, fontSize: 16),
                      ),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
