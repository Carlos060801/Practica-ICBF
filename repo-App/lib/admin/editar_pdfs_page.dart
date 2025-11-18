import 'package:flutter/material.dart';

class EditarPDFsPage extends StatelessWidget {
  const EditarPDFsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.blue,
        title: const Text("Editar PDFs"),
      ),
      body: const Center(
        child: Text(
          "Aquí podrás seleccionar un PDF y reemplazarlo por una versión nueva",
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        ),
      ),
    );
  }
}
