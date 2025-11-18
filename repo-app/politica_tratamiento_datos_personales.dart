import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:open_filex/open_filex.dart'; // 👈 Import para abrir PDF

class PoliticaTratamientoDatosPersonalesPage extends StatelessWidget {
  const PoliticaTratamientoDatosPersonalesPage({super.key});

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

      // 🔹 Abrir el PDF automáticamente
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
          "Tratamiento de Datos Personales",
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // -------- Columna Izquierda - Política --------
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
                    "El Instituto Colombiano de Bienestar Familiar, en desarrollo de su misión de "
                    "promover el desarrollo y la protección integral de los niños, niñas y adolescentes, "
                    "fortaleciendo las capacidades de las familias como entornos protectores y principales "
                    "agentes de transformación social, realiza la recolección y tratamiento de datos personales "
                    "de los niños, niñas, adolescentes y familias, siempre atendiendo a su interés superior.\n\n"
                    "Ante la necesidad de asegurar una adecuada y eficiente gestión institucional, y en ejercicio "
                    "de los deberes contenidos en la Ley 1581 de 2012 y el capítulo 25 del Título 2 de la Parte 2 "
                    "del Libro 2 del Decreto 1074 de 2015, el ICBF tratará los datos personales de sus partes "
                    "interesadas, informando de manera clara su finalidad y garantizando el ejercicio de los "
                    "derechos del titular a través de canales de atención adecuados y procedimientos claros para "
                    "que puedan ejercerlos.",
                    style: TextStyle(fontSize: 12, height: 1.4),
                    textAlign: TextAlign.justify,
                  ),

                  const SizedBox(height: 20),

                  // 🔹 Fila con los 3 botones en orden
                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      // Botón 1
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue.shade700,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(18),
                          ),
                          padding: const EdgeInsets.symmetric(
                            vertical: 10,
                            horizontal: 12,
                          ),
                        ),
                        onPressed: () => _saveAndOpenPdf(
                          context,
                          'assets/pdf/Politica_tratamiento_datos1.pdf',
                          'Politica_tratamiento_datos1.pdf',
                        ),
                        icon: const Icon(Icons.picture_as_pdf, size: 18),
                        label: const Text(
                          'Política Tratamiento Datos 1',
                          style: TextStyle(fontSize: 11),
                        ),
                      ),
                      const SizedBox(width: 8),

                      // Botón 2
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue.shade700,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(18),
                          ),
                          padding: const EdgeInsets.symmetric(
                            vertical: 10,
                            horizontal: 12,
                          ),
                        ),
                        onPressed: () => _saveAndOpenPdf(
                          context,
                          'assets/pdf/manual_tratamiento_datos.pdf',
                          'manual_tratamiento_datos.pdf',
                        ),
                        icon: const Icon(Icons.picture_as_pdf, size: 18),
                        label: const Text(
                          'Manual Tratamiento de Datos',
                          style: TextStyle(fontSize: 11),
                        ),
                      ),
                      const SizedBox(width: 8),

                      // Botón 3
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue.shade700,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(18),
                          ),
                          padding: const EdgeInsets.symmetric(
                            vertical: 10,
                            horizontal: 12,
                          ),
                        ),
                        onPressed: () => _saveAndOpenPdf(
                          context,
                          'assets/pdf/Politica_tratamiento_datos.pdf',
                          'Politica_tratamiento_datos.pdf',
                        ),
                        icon: const Icon(Icons.picture_as_pdf, size: 18),
                        label: const Text(
                          'Política Tratamiento Datos',
                          style: TextStyle(fontSize: 11),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(width: 20),

            // -------- Columna Centro - Objetivos --------
            Expanded(
              flex: 1,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    "Objetivos",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 12),
                  Text(
                    "• Brindar mecanismos de aseguramiento para el cumplimiento de la confidencialidad, "
                    "integridad, disponibilidad, legalidad y confiabilidad de la información del ICBF.\n\n"
                    "• Mitigar los incidentes de Seguridad y Privacidad de la Información, Seguridad Digital "
                    "y Continuidad de la Operación en el ICBF.\n\n"
                    "• Gestionar los riesgos de seguridad y privacidad de la información, Seguridad Digital "
                    "y Continuidad de la operación del ICBF.\n\n"
                    "• Establecer los lineamientos necesarios para el manejo de la información y los recursos "
                    "tecnológicos del ICBF.\n\n"
                    "• Fortalecer las capacidades y cultura organizacional de Seguridad de la Información "
                    "en los colaboradores y contratistas del ICBF.",
                    style: TextStyle(fontSize: 12, height: 1.4),
                    textAlign: TextAlign.justify,
                  ),
                ],
              ),
            ),

            const SizedBox(width: 20),

            // -------- Columna Derecha - Imagen --------
            Expanded(
              flex: 1,
              child: Center(
                child: Image.asset(
                  'assets/imagenes/datos personales.PNG',
                  height: 350,
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
