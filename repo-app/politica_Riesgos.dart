import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:open_filex/open_filex.dart'; // 👈 Para abrir el PDF

class PoliticaRiesgosPage extends StatelessWidget {
  const PoliticaRiesgosPage({super.key});

  // === Función para guardar y abrir el PDF ===
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

      // Cargar el PDF desde assets
      final byteData = await rootBundle.load(assetPath);
      final buffer = byteData.buffer;

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
      await file.writeAsBytes(
        buffer.asUint8List(byteData.offsetInBytes, byteData.lengthInBytes),
      );

      // Mostrar mensaje
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('✅ PDF guardado en: ${file.path}')),
      );

      // 🔥 Abrir automáticamente el archivo
      await OpenFilex.open(file.path);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('❌ Error al guardar o abrir el PDF: $e')),
      );
    }
  }

  // === Botón reutilizable ===
  Widget _pdfButton(
    BuildContext context,
    String title,
    String assetPath,
    String fileName,
  ) {
    return ElevatedButton.icon(
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF4CAF50),
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        elevation: 4,
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
        title: const Text("Política de Riesgos"),
        backgroundColor: const Color(0xFF4CAF50),
        centerTitle: true,
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
                children: const [
                  Text(
                    "Política de Riesgos",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 12),
                  Text(
                    "En el ICBF estamos comprometidos con fortalecer la cultura de la prevención y la gestión "
                    "de los riesgos valorados como amenazas o debilidades, dirigiendo todos nuestros esfuerzos "
                    "institucionales a reducirlos, evitarlos, transferirlos o mitigarlos, llevando los riesgos residuales "
                    "a niveles de aceptación bajos.\n\n"
                    "Por otra parte, potenciamos los riesgos positivos entendidos como fortalezas y oportunidades, "
                    "teniendo en cuenta el marco normativo y el contexto de la entidad.\n\n"
                    "Para ello, desde el nivel nacional, regional y zonal se gestiona integralmente los riesgos de: calidad, "
                    "ambiental, seguridad y privacidad de la información, seguridad digital, continuidad de la operación y "
                    "corrupción, así como los riesgos y peligros de seguridad y salud en el trabajo en todos los procesos del Instituto.\n\n"
                    "La responsabilidad frente a la gestión de riesgos corresponde, en el marco de sus competencias, a las líneas de defensas: "
                    "Comité Institucional de Coordinación de Control Interno, alta dirección, líderes y responsables de proceso y colaboradores, "
                    "Dirección de Planeación y Control de Gestión y Oficina de Control Interno.\n\n"
                    "Con este propósito se propicia espacios de participación de los colaboradores y se adelanta desde la alta dirección, un proceso "
                    "permanente de comunicación, revisión, seguimiento y control a los planes de tratamiento para fortalecer las capacidades de las familias, "
                    "comunidades y territorios, promoviendo la equidad como expresión de justicia social, fundamento de paz y la protección integral de los derechos "
                    "de la niñez y la adolescencia.",
                    style: TextStyle(fontSize: 12, height: 1.4),
                    textAlign: TextAlign.justify,
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
                children: [
                  const Text(
                    "Objetivos",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    "1. Fortalecer la Cultura y la Capacidad Institucional\n\n"
                    "2. Gestionar Riesgos Negativos (Amenazas)\n\n"
                    "3. Gestionar Riesgos Positivos (Oportunidades)\n\n"
                    "4. Cobertura Integral de Riesgos\n\n"
                    "5. Finalidad Superior (Impacto en la Misión)",
                    style: TextStyle(fontSize: 12, height: 1.6),
                  ),
                  const SizedBox(height: 25),

                  // 🔘 Botón debajo de los objetivos
                  Builder(
                    builder: (context) => _pdfButton(
                      context,
                      "ABRIR POLÍTICA DE RIESGOS",
                      "assets/pdf/Politica_riesgos.pdf",
                      "Politica_riesgos.pdf",
                    ),
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
                  'assets/imagenes/Riesgos.png',
                  height: 400,
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
