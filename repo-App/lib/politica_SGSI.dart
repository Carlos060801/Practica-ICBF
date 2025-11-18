import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:open_filex/open_filex.dart';

class PoliticaSGSIPage extends StatelessWidget {
  const PoliticaSGSIPage({super.key});

  // 🔹 Función para guardar y abrir PDF
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
        backgroundColor: Colors.blue,
        centerTitle: true,
        title: const Text(
          "Política SGSI",
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🧱 Columna izquierda - Política + imagen sgsi.png
            Expanded(
              flex: 2,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Política",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    "Política General de Seguridad y Privacidad de la Información, Seguridad Digital y Continuidad de la Operación.\n\n"
                    "El ICBF protege, preserva y administra la integridad, confidencialidad, disponibilidad de la información, así como la seguridad digital y la gestión de la continuidad de la operación, conforme al mapa de procesos y en cumplimiento de los requisitos legales y reglamentarios. "
                    "Asimismo la entidad previene incidentes mediante la gestión de riesgos integrales en seguridad y privacidad de la información y seguridad digital y continuidad del negocio, con la implementación de controles de seguridad físicos y digitales, orientados a la mejora continua en la gestión y el alto desempeño del Sistema de Gestión de Seguridad de la Información, "
                    "con el fin de prestar servicios con calidad y transparencia, partiendo de las necesidades y expectativas de las partes interesadas, promoviendo por la protección integral de los derechos de los niños, niñas, adolescentes, familias y colaboradores del ICBF.",
                    style: TextStyle(fontSize: 12, height: 1.4),
                    textAlign: TextAlign.justify,
                  ),
                  const SizedBox(height: 12),

                  // 🖼️ Imagen debajo de la Política
                  Center(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.asset(
                        'assets/imagenes/sgsi.png',
                        width: 4500,
                        height: 350,
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(width: 20),

            // 📄 Columna derecha - Objetivos + imagen sgsi.jpg + botones
            Expanded(
              flex: 3,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Texto del objetivo + botones
                  Expanded(
                    flex: 2,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Objetivos",
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          "Fortalecer la Confidencialidad, Integridad, Disponibilidad, Confiabilidad, Legalidad, Privacidad, Autenticidad, Seguridad Digital de la información y los entornos donde es tratada, gestionada, administrada y custodiada, así como la Continuidad de la Operación del servicio público de bienestar familiar; promoviendo con ello la gestión del conocimiento Institucional.\n\n"
                          "• Brindar mecanismos de aseguramiento para el cumplimiento de la confidencialidad, integridad, disponibilidad, legalidad y confiabilidad de la información del ICBF.\n\n"
                          "• Mitigar los incidentes de Seguridad y Privacidad de la Información, Seguridad Digital y Continuidad de la Operación en el ICBF.\n\n"
                          "• Gestionar los riesgos de seguridad y privacidad de la información, Seguridad Digital y Continuidad de la operación del ICBF.\n\n"
                          "• Establecer los lineamientos necesarios para el manejo de la información y los recursos tecnológicos del ICBF.\n\n"
                          "• Fortalecer las capacidades y cultura organizacional de Seguridad de la Información en los colaboradores y contratista del ICBF.",
                          style: TextStyle(fontSize: 12, height: 1.4),
                          textAlign: TextAlign.justify,
                        ),
                        const SizedBox(height: 20),

                        // 🔹 Botones horizontales
                        Wrap(
                          alignment: WrapAlignment.center,
                          spacing: 10,
                          runSpacing: 10,
                          children: [
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.blue.shade700,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 10,
                                  horizontal: 12,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                elevation: 4,
                              ),
                              onPressed: () => _saveAndOpenPdf(
                                context,
                                'assets/pdf/formato_pruebas_sgsi.pdf',
                                'formato_pruebas_sgsi.pdf',
                              ),
                              icon: const Icon(Icons.picture_as_pdf, size: 20),
                              label: const Text(
                                'Formato de Pruebas SGSI',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.blue.shade700,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 10,
                                  horizontal: 12,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                elevation: 4,
                              ),
                              onPressed: () => _saveAndOpenPdf(
                                context,
                                'assets/pdf/cartilla_seguridad.pdf',
                                'cartilla_seguridad.pdf',
                              ),
                              icon: const Icon(Icons.picture_as_pdf, size: 20),
                              label: const Text(
                                'Cartilla de Seguridad',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.blue.shade700,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 10,
                                  horizontal: 12,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                elevation: 4,
                              ),
                              onPressed: () => _saveAndOpenPdf(
                                context,
                                'assets/pdf/seguridad_digital_trabajo_en_casa.pdf',
                                'seguridad_digital_trabajo_en_casa.pdf',
                              ),
                              icon: const Icon(Icons.picture_as_pdf, size: 20),
                              label: const Text(
                                'Seguridad Digital Trabajo en Casa',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(width: 10),

                  // 🖼️ Imagen derecha (NO SE MUEVE)
                  Expanded(
                    flex: 2,
                    child: Center(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.asset(
                          'assets/imagenes/sgsi.jpg',
                          fit: BoxFit.contain,
                          height: 300,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
