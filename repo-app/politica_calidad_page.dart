import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:open_filex/open_filex.dart';

class PoliticaCalidadPage extends StatelessWidget {
  const PoliticaCalidadPage({super.key});

  // 🔹 Función para guardar y abrir PDF (idéntica a SGSI)
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
        backgroundColor: Colors.orange,
        centerTitle: true,
        title: const Text(
          "Política de Calidad",
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🟧 Columna izquierda (texto + botones)
            Expanded(
              flex: 3,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Política",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    "En el ICBF trabajamos con calidad, compromiso, transparencia e integridad con el propósito de liderar la protección integral de los derechos de la niñez, la adolescencia y las familias mediante la consolidación de una cultura organizacional basada en la diligencia, el servicio, y la promoción de la equidad como expresión de justicia social y fundamento de la paz, articulando de manera eficiente los procesos de la entidad a nivel nacional y territorial, reconociendo las necesidades y expectativas de cada una de las partes interesadas para así contribuir al cumplimiento de la misión del instituto.",
                    style: TextStyle(fontSize: 12, height: 1.4),
                    textAlign: TextAlign.justify,
                  ),
                  const SizedBox(height: 30),

                  const Text(
                    "Documentos relacionados:",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),

                  // 🔸 Botones al estilo SGSI
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      _pdfButton(
                        context,
                        "Modelo de Planeación y Sistema Integrado de Gestión",
                        "assets/pdf/Modelo_de_Planeacion.pdf",
                        "Modelo_de_Planeacion.pdf",
                      ),
                      _pdfButton(
                        context,
                        "Partes Interesadas",
                        "assets/pdf/Partes_Interesadas.pdf",
                        "Partes_Interesadas.pdf",
                      ),
                      _pdfButton(
                        context,
                        "Modelo de Operación por Procesos",
                        "assets/pdf/Modelo_Operacion_Procesos.pdf",
                        "Modelo_Operacion_Procesos.pdf",
                      ),
                      _pdfButton(
                        context,
                        "Gestión de Riesgos",
                        "assets/pdf/Gestion_Riesgos.pdf",
                        "Gestion_Riesgos.pdf",
                      ),
                      _pdfButton(
                        context,
                        "Mejora Continua",
                        "assets/pdf/Mejora_Continua.pdf",
                        "Mejora_Continua.pdf",
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(width: 20),

            // 🟩 Imagen a la derecha
            Expanded(
              flex: 2,
              child: Center(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.asset(
                    'assets/imagenes/calidad.jpg',
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

  // 🔘 Botón PDF con mismo estilo de SGSI pero en color naranja
  Widget _pdfButton(
    BuildContext context,
    String title,
    String assetPath,
    String fileName,
  ) {
    return ElevatedButton.icon(
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.orange.shade700,
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
