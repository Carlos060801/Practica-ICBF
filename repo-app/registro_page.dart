import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'chat/respuestas_data.dart';

// ✅ Importaciones de las pantallas admin
import 'admin/login_admin_page.dart';
import 'admin/registro_admin_page.dart';

class RegistroPage extends StatefulWidget {
  const RegistroPage({super.key});

  @override
  State<RegistroPage> createState() => _RegistroPageState();
}

class _RegistroPageState extends State<RegistroPage> {
  final String _formUrl = 'https://forms.office.com/r/crmPVenmjy';
  final TextEditingController _chatController = TextEditingController();
  final List<Map<String, String>> _mensajes = [];
  bool _mostrandoChat = false;
  bool _cargando = false;

  Future<void> _abrirFormulario() async {
    final Uri url = Uri.parse(_formUrl);
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      throw Exception('No se pudo abrir el enlace: $url');
    }
  }

  Future<void> _enviarMensaje() async {
    final textoUsuario = _chatController.text.trim().toLowerCase();
    if (textoUsuario.isEmpty) return;

    setState(() {
      _mensajes.add({'emisor': 'usuario', 'texto': _chatController.text.trim()});
      _chatController.clear();
      _cargando = true;
    });

    await Future.delayed(const Duration(milliseconds: 600));

    String? respuesta;
    for (final entrada in respuestasLocales.entries) {
      if (textoUsuario.contains(entrada.key.toLowerCase())) {
        respuesta = entrada.value;
        break;
      }
    }

    respuesta ??=
        "⚠️ Lo siento, no tengo información sobre eso.\n\nPuedes preguntar por ejemplo:\n"
        "- Política SGSI\n- Política SST\n- Política Ambiental\n- Política de Tratamiento de Datos";

    setState(() {
      _mensajes.add({'emisor': 'asistente', 'texto': respuesta!});
      _cargando = false;
    });
  }

  Widget _chatWidget() {
    return Align(
      alignment: Alignment.bottomRight,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        width: _mostrandoChat ? 330 : 0,
        height: _mostrandoChat ? 420 : 0,
        margin: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 8)],
        ),
        child: _mostrandoChat
            ? Column(
                children: [
                  Container(
                    decoration: const BoxDecoration(
                      color: Color(0xFF4CAF50),
                      borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text("🤖 Asistente ICBF",
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        IconButton(
                          icon: const Icon(Icons.close, color: Colors.white),
                          onPressed: () => setState(() => _mostrandoChat = false),
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: ListView.builder(
                      padding: const EdgeInsets.all(10),
                      itemCount: _mensajes.length,
                      itemBuilder: (context, index) {
                        final msg = _mensajes[index];
                        final esUsuario = msg['emisor'] == 'usuario';
                        return Align(
                          alignment: esUsuario ? Alignment.centerRight : Alignment.centerLeft,
                          child: Container(
                            margin: const EdgeInsets.symmetric(vertical: 4),
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: esUsuario ? const Color(0xFF4CAF50) : Colors.grey.shade300,
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Text(msg['texto'] ?? '',
                                style: TextStyle(color: esUsuario ? Colors.white : Colors.black)),
                          ),
                        );
                      },
                    ),
                  ),
                  if (_cargando) const Padding(padding: EdgeInsets.all(6), child: CircularProgressIndicator()),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _chatController,
                            decoration: const InputDecoration(
                              hintText: "Escribe tu mensaje...",
                              border: OutlineInputBorder(),
                              isDense: true,
                            ),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.send, color: Color(0xFF4CAF50)),
                          onPressed: _enviarMensaje,
                        ),
                      ],
                    ),
                  ),
                ],
              )
            : const SizedBox(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF4CAF50),
        title: const Text("Registro de Usuarios", style: TextStyle(color: Colors.white)),
      ),
      body: Stack(
        children: [
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const Icon(Icons.app_registration, size: 100, color: Color(0xFF4CAF50)),
                  const SizedBox(height: 20),
                  const Text("Bienvenido al módulo de registro del ICBF",
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF2E7D32)),
                      textAlign: TextAlign.center),
                  const SizedBox(height: 25),

                  ElevatedButton.icon(
                    onPressed: _abrirFormulario,
                    icon: const Icon(Icons.assignment, color: Colors.white),
                    label: const Text("Regístrese Aquí",
                        style: TextStyle(fontSize: 18, color: Colors.white, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4CAF50),
                      padding: const EdgeInsets.symmetric(horizontal: 45, vertical: 18),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                    ),
                  ),

                  const SizedBox(height: 45),

                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginAdminPage())),
                          icon: const Icon(Icons.lock, color: Colors.white),
                          label: const Text("Login Admin", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF2E7D32),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegistroAdminPage())),
                          icon: const Icon(Icons.admin_panel_settings, color: Colors.white),
                          label: const Text("Registro Admin", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF4CAF50),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          _chatWidget(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF4CAF50),
        onPressed: () => setState(() => _mostrandoChat = !_mostrandoChat),
        child: const Icon(Icons.chat),
      ),
    );
  }
}
