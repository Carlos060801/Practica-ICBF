import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:open_filex/open_filex.dart';

class PoliticaAmbientalPage extends StatelessWidget {
  const PoliticaAmbientalPage({super.key});

  // 🔹 Función para guardar y abrir PDF (idéntica a SGSI y Calidad)
  Future<void> _saveAndOpenPdf(
    BuildContext context,
    String assetPath,
    String fileName,
  ) async {
    try {
      if (Platform.isAndroid) {
        final status = await Permission.storage.request();
        if (!status.isGranted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Permiso de almacenamiento denegado')),
          );
          return;
        }
      }

      final byteData = await rootBundle.load(assetPath);
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

      final file = File('${downloadsDir.path}/$fileName');
      await file.writeAsBytes(byteData.buffer.asUint8List());

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('✅ PDF guardado en: ${file.path}')),
      );

      // 📂 Abrir el PDF automáticamente
      await OpenFilex.open(file.path);
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('❌ Error al guardar el PDF: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.green[900],
        centerTitle: true,
        title: const Text(
          "Política Ambiental",
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🟩 Columna izquierda - Política + Botones
            Expanded(
              flex: 3,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Política Ambiental",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    "El ICBF, con presencia a nivel nacional y consciente de la mejora continua y de su compromiso con la protección del medioambiente, promueve la implementación de buenas prácticas ambientales, cumple con los requisitos legales y otros requisitos, previene la contaminación y controla los aspectos ambientales asociados a la generación de residuos y al consumo de recursos como el agua, la energía y el papel. "
                    "Con el propósito de mitigar el impacto adverso del cambio climático, implementa estrategias que fomentan la sostenibilidad y el cuidado del entorno, respondiendo así a las demandas de sus colaboradores. "
                    "Con ello, contribuye al bienestar de los niños, niñas, adolescentes, familias y colaboradores del ICBF.",
                    style: TextStyle(fontSize: 12, height: 1.4),
                    textAlign: TextAlign.justify,
                  ),
                  const SizedBox(height: 25),

                  const Text(
                    "Documentos relacionados:",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 15),

                  // 🔹 Botones PDF (idénticos en estilo)
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      _pdfButton(
                        context,
                        "Inducción SGA Ambiental",
                        "assets/pdf/INDUCCION SGA.pdf",
                        "INDUCCION_SGA.pdf",
                      ),
                      _pdfButton(
                        context,
                        "Gestión Ambiental Institucional",
                        "assets/pdf/Gestion_Ambiental.pdf",
                        "Gestion_Ambiental.pdf",
                      ),
                      _pdfButton(
                        context,
                        "Buenas Prácticas Ambientales",
                        "assets/pdf/Buenas_Practicas_Ambientales.pdf",
                        "Buenas_Practicas_Ambientales.pdf",
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(width: 20),

            // 🌿 Columna central - Objetivos
            Expanded(
              flex: 3,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    "Objetivo del Eje Ambiental",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 12),
                  Text(
                    "Reducir los impactos ambientales generados por nuestra actividad a través de:\n\n"
                    "• La promoción de buenas prácticas ambientales entre servidores públicos, contratistas y operadores.\n\n"
                    "• La reducción en el consumo de recursos como el agua, la energía y el papel.\n\n"
                    "• La eficiencia en el aprovechamiento de los residuos sólidos generados por la Entidad.",
                    style: TextStyle(fontSize: 12, height: 1.4),
                    textAlign: TextAlign.justify,
                  ),
                ],
              ),
            ),

            const SizedBox(width: 20),

            // 🖼️ Imagen derecha (NO SE MUEVE)
            Expanded(
              flex: 2,
              child: Center(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.asset(
                    'assets/imagenes/ambiental.jpg',
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

  // 🔘 Botón PDF con estilo uniforme (verde institucional)
  Widget _pdfButton(
    BuildContext context,
    String title,
    String assetPath,
    String fileName,
  ) {
    return ElevatedButton.icon(
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.green[900],
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        elevation: 4,
      ),
      onPressed: () => _saveAndOpenPdf(context, assetPath, fileName),
      icon: const Icon(Icons.picture_as_pdf, size: 20),
      label: Text(
        title,
        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
        textAlign: TextAlign.center,
      ),
    );
  }
}
