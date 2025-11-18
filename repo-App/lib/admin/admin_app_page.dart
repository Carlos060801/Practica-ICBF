import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:url_launcher/url_launcher.dart';

import '../config.dart';

class AdminAppPage extends StatefulWidget {
  const AdminAppPage({super.key});

  @override
  State<AdminAppPage> createState() => _AdminAppPageState();
}

class _AdminAppPageState extends State<AdminAppPage> {
  List policies = [];
  bool loading = false;

  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _categoryController = TextEditingController();
  File? selectedFile;

  @override
  void initState() {
    super.initState();
    fetchPolicies();
  }

  // ===========================================================
  // 📌 Cargar PDFs desde MongoDB
  // ===========================================================
  Future<void> fetchPolicies() async {
    setState(() => loading = true);

    try {
      final response = await http.get(
        Uri.parse("${Config.apiUrl}/api/policies"),
      );

      if (response.statusCode == 200) {
        setState(() => policies = json.decode(response.body));
      }
    } catch (e) {
      _msg("⚠️ Error cargando documentos");
    }

    setState(() => loading = false);
  }

  // ===========================================================
  // 📌 Subir PDF a Firebase
  // ===========================================================
  Future<void> pickAndUploadFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );

    if (result == null) return;

    selectedFile = File(result.files.single.path!);

    try {
      var request = http.MultipartRequest(
        "POST",
        Uri.parse("${Config.apiUrl}/api/policies/upload"),
      );

      // TOKEN
      request.headers.addAll({"Authorization": "Bearer ${Config.token}"});

      request.files.add(
        await http.MultipartFile.fromPath('file', selectedFile!.path),
      );

      request.fields['title'] = _titleController.text.trim();
      request.fields['category'] = _categoryController.text.trim();

      var response = await request.send();
      var responseBody = await response.stream.bytesToString();

      if (response.statusCode == 200) {
        _msg("📄 PDF subido correctamente");
        fetchPolicies();
      } else {
        _msg("❌ Error al subir: $responseBody");
      }
    } catch (e) {
      _msg("⚠️ Error enviando archivo");
    }
  }

  // ===========================================================
  // 📌 Abrir PDF
  // ===========================================================
  void openPDF(String url) async {
    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      _msg("⚠️ Error al abrir PDF");
    }
  }

  // ===========================================================
  // 📌 SnackBar
  // ===========================================================
  void _msg(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  // ===========================================================
  // 📌 UI
  // ===========================================================
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("SIGE - Admin Panel"),
        backgroundColor: Colors.green.shade700,
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator(color: Colors.green))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF7F1FF),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      children: [
                        const Text(
                          "Upload New PDF Document",
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 20),

                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: _titleController,
                                decoration: const InputDecoration(
                                  labelText: "Document Title",
                                  border: OutlineInputBorder(),
                                ),
                              ),
                            ),
                            const SizedBox(width: 15),
                            Expanded(
                              child: TextField(
                                controller: _categoryController,
                                decoration: const InputDecoration(
                                  labelText: "Category",
                                  border: OutlineInputBorder(),
                                ),
                              ),
                            ),
                            const SizedBox(width: 15),
                            ElevatedButton.icon(
                              icon: const Icon(Icons.upload),
                              label: const Text("Upload & Save"),
                              onPressed: pickAndUploadFile,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.green,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 25,
                                  vertical: 16,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 30),

                  const Text(
                    "Existing PDF Documents",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),

                  policies.isEmpty
                      ? const Center(
                          child: Padding(
                            padding: EdgeInsets.only(top: 40),
                            child: Text(
                              "No hay documentos registrados",
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.grey,
                              ),
                            ),
                          ),
                        )
                      : DataTable(
                          columnSpacing: 25,
                          headingRowColor: WidgetStateColor.resolveWith(
                            (_) => Colors.green.shade600,
                          ),
                          headingTextStyle: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                          columns: const [
                            DataColumn(label: Text("Title")),
                            DataColumn(label: Text("Category")),
                            DataColumn(label: Text("Actions")),
                          ],
                          rows: policies.map((doc) {
                            return DataRow(
                              cells: [
                                DataCell(Text(doc["title"])),
                                DataCell(Text(doc["category"])),
                                DataCell(
                                  IconButton(
                                    icon: const Icon(
                                      Icons.picture_as_pdf,
                                      color: Colors.red,
                                    ),
                                    onPressed: () => openPDF(doc["fileUrl"]),
                                  ),
                                ),
                              ],
                            );
                          }).toList(),
                        ),
                ],
              ),
            ),
    );
  }
}
