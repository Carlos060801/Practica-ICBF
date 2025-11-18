import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:open_filex/open_filex.dart'; // 👈 Para abrir el PDF automáticamente

class PoliticaSSTPage extends StatelessWidget {
  const PoliticaSSTPage({super.key});

  // 🔽 Función para guardar y abrir PDF automáticamente
  Future<void> _saveAndOpenPdf(
    BuildContext context,
    String assetPath,
    String fileName,
  ) async {
    try {
      // Solicitar permisos (solo Android)
      if (Platform.isAndroid) {
        final status = await Permission.storage.request();
        if (!status.isGranted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Permiso de almacenamiento denegado')),
          );
          return;
        }
      }

      // Cargar PDF desde assets
      final byteData = await rootBundle.load(assetPath);
      final buffer = byteData.buffer;

      // Obtener carpeta de descargas según plataforma
      Directory? downloadsDir;
      if (Platform.isAndroid) {
        downloadsDir = Directory('/storage/emulated/0/Download');
      } else if (Platform.isWindows) {
        downloadsDir = Directory(
          '${Platform.environment['USERPROFILE']}\\Downloads',
        );
      } else {
        downloadsDir = await getApplicationDocumentsDirectory();
      }

      // Guardar el archivo
      final file = File('${downloadsDir.path}/$fileName');
      await file.writeAsBytes(
        buffer.asUint8List(byteData.offsetInBytes, byteData.lengthInBytes),
      );

      // Mostrar mensaje y abrir PDF
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('✅ PDF guardado en: ${file.path}')),
      );

      await OpenFilex.open(file.path); // 👈 Se abre automáticamente
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('❌ Error al guardar o abrir el PDF: $e')),
      );
    }
  }

  // 🔘 Botón PDF (solo uno)
  Widget _pdfButton(
    BuildContext context,
    String title,
    String assetPath,
    String fileName,
  ) {
    return ElevatedButton.icon(
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.yellow.shade200,
        foregroundColor: Colors.black,
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        elevation: 3,
      ),
      onPressed: () => _saveAndOpenPdf(context, assetPath, fileName),
      icon: const Icon(Icons.picture_as_pdf, size: 20),
      label: Text(
        title,
        textAlign: TextAlign.center,
        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.yellow,
        centerTitle: true,
        title: const Text(
          "Política de Seguridad y Salud en el Trabajo (SST)",
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🟨 Columna izquierda (texto + botón PDF)
            Expanded(
              flex: 3,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Política SST",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    "En el ICBF estamos comprometidos con la Seguridad y Salud en el Trabajo "
                    "a nivel nacional, regional y zonal, encaminados en la prevención y "
                    "disminución de incidentes, accidentes, lesiones y enfermedades laborales "
                    "de los colaboradores, desarrollando acciones preventivas y participativas "
                    "que fomenten el compromiso de todos frente a la cultura del autocuidado y "
                    "conlleven a condiciones óptimas de salud física, mental y social.\n\n"
                    "Para ello, anticipamos, reconocemos, evaluamos y controlamos de forma eficaz "
                    "los peligros, los riesgos, así como las amenazas presentes en el entorno, "
                    "identificando oportunidades y fortalezas para la mejora continua, respondiendo "
                    "a los requisitos legales aplicables y otros que suscriba la entidad acorde con "
                    "las necesidades de los colaboradores y partes interesadas.\n\n"
                    "Es un compromiso de la Alta Dirección liderar el SG-SST promoviendo la consulta "
                    "y la participación, así como asignando los recursos necesarios para propiciar "
                    "un ambiente de trabajo sano y seguro.",
                    style: TextStyle(fontSize: 12, height: 1.4),
                    textAlign: TextAlign.justify,
                  ),

                  const SizedBox(height: 30),

                  const Text(
                    "Documento relacionado:",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),

                  // 🟨 Único botón que abre el PDF
                  Builder(
                    builder: (context) => _pdfButton(
                      context,
                      "Inducción SG SST",
                      "assets/pdf/Politica_SST.pdf",
                      "Politica_SST.pdf",
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(width: 20),

            // 🖼️ Imagen SST
            Expanded(
              flex: 2,
              child: Center(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.asset(
                    "assets/imagenes/sst01.png",
                    fit: BoxFit.contain,
                    height: 300,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
