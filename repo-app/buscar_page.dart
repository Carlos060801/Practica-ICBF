import 'package:flutter/material.dart';

// Importa todas tus páginas de políticas
import 'politica_integrada_page.dart';
import 'politica_ambiental_page.dart';
import 'politica_calidad_page.dart';
import 'politica_SGSI.dart';
import 'politica_sst_page.dart';
import 'politica_Riesgos.dart';
import 'politica_tratamiento_datos_personales.dart';

class BuscarPage extends StatefulWidget {
  const BuscarPage({super.key});

  @override
  State<BuscarPage> createState() => _BuscarPageState();
}

class _BuscarPageState extends State<BuscarPage> {
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, dynamic>> _pages = [
    {"titulo": "Política Integrada", "widget": const PoliticaIntegradaPage()},
    {"titulo": "Política Ambiental", "widget": const PoliticaAmbientalPage()},
    {"titulo": "Política de Calidad", "widget": const PoliticaCalidadPage()},
    {"titulo": "Política SGSI", "widget": const PoliticaSGSIPage()},
    {"titulo": "Política SST", "widget": const PoliticaSSTPage()},
    {"titulo": "Política de Riesgos", "widget": const PoliticaRiesgosPage()},
    {
      "titulo": "Tratamiento de Datos Personales",
      "widget": const PoliticaTratamientoDatosPersonalesPage(),
    },
  ];

  List<Map<String, dynamic>> _filteredPages = [];

  @override
  void initState() {
    super.initState();
    _filteredPages = _pages;
  }

  void _search(String query) {
    setState(() {
      _filteredPages = _pages
          .where(
            (page) =>
                page["titulo"].toLowerCase().contains(query.toLowerCase()),
          )
          .toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Buscar Información")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _searchController,
              decoration: InputDecoration(
                labelText: "Buscar...",
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onChanged: _search,
            ),
            const SizedBox(height: 20),
            Expanded(
              child: _filteredPages.isEmpty
                  ? const Center(
                      child: Text(
                        "No se encontraron resultados.",
                        style: TextStyle(fontSize: 16, color: Colors.grey),
                      ),
                    )
                  : ListView.builder(
                      itemCount: _filteredPages.length,
                      itemBuilder: (context, index) {
                        final item = _filteredPages[index];
                        return Card(
                          child: ListTile(
                            leading: const Icon(Icons.article_outlined),
                            title: Text(item["titulo"]),
                            onTap: () {
                              // 🔹 Navega directamente a la página correspondiente
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => item["widget"],
                                ),
                              );
                            },
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
