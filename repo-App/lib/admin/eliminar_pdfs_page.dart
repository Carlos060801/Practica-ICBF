import 'package:flutter/material.dart';

class EliminarPDFsPage extends StatelessWidget {
  const EliminarPDFsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.red,
        title: const Text("Eliminar PDFs"),
      ),
      body: const Center(
        child: Text(
          "Aquí podrás ver la lista de PDFs y eliminarlos",
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        ),
      ),
    );
  }
}
