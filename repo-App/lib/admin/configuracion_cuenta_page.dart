import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ConfiguracionCuentaPage extends StatefulWidget {
  final String token;

  const ConfiguracionCuentaPage({
    Key? key,
    required this.token,
  }) : super(key: key);

  @override
  State<ConfiguracionCuentaPage> createState() => _ConfiguracionCuentaPageState();
}

class _ConfiguracionCuentaPageState extends State<ConfiguracionCuentaPage> {
  final TextEditingController nameCtrl = TextEditingController();
  final TextEditingController phoneCtrl = TextEditingController();

  bool _cargando = false;

  Future<void> guardarCambios() async {
    setState(() => _cargando = true);

    final url = Uri.parse("http://10.0.2.2:3000/api/user/update-profile");

    final respuesta = await http.put(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${widget.token}",
      },
      body: jsonEncode({
        "name": nameCtrl.text.trim(),
        "phone": phoneCtrl.text.trim(),
      }),
    );

    final data = jsonDecode(respuesta.body);

    setState(() => _cargando = false);

    if (respuesta.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("✅ Cambios guardados correctamente")),
      );
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("⚠️ Error: ${data["message"] ?? "No se pudo actualizar"}")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF4CAF50),
        title: const Text("Configuración de Cuenta",
            style: TextStyle(color: Colors.white)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const Text(
              "Actualiza tus datos personales",
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 25),

            TextField(
              controller: nameCtrl,
              decoration: const InputDecoration(
                labelText: "Nombre completo",
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 15),

            TextField(
              controller: phoneCtrl,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                labelText: "Número de teléfono",
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 30),

            _cargando
                ? const CircularProgressIndicator()
                : ElevatedButton.icon(
                    onPressed: guardarCambios,
                    icon: const Icon(Icons.save),
                    label: const Text("Guardar Cambios"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4CAF50),
                      padding:
                          const EdgeInsets.symmetric(horizontal: 35, vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  )
          ],
        ),
      ),
    );
  }
}
