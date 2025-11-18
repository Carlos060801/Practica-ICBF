import 'package:flutter/material.dart';

class PoliticaIntegradaPage extends StatelessWidget {
  const PoliticaIntegradaPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text(
          "Política Integrada",
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF4CAF50),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        child: LayoutBuilder(
          builder: (context, constraints) {
            if (constraints.maxWidth < 900) {
              // 📱 Para pantallas pequeñas: apilado en columna
              return Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  _buildTextSection(),
                  const SizedBox(height: 20),
                  _buildBrightImage(),
                ],
              );
            } else {
              // 💻 Para pantallas grandes: texto a la izquierda e imagen a la derecha
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(flex: 3, child: _buildTextSection()),
                  const SizedBox(width: 16),
                  Expanded(flex: 2, child: _buildBrightImage()),
                ],
              );
            }
          },
        ),
      ),
    );
  }

  /// 🔹 Texto: Política a la izquierda, Objetivos a la derecha
  Widget _buildTextSection() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 🟩 Política Integrada
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text(
                "Política Integrada",
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF2E7D32),
                ),
              ),
              SizedBox(height: 10),
              Text(
                "En el ICBF lideramos la protección integral de los derechos de la niñez, la adolescencia y las familias en las comunidades y territorios, en el marco de la garantía de derechos, la gestión de riesgos, la operación por procesos, la seguridad y privacidad de la información, la seguridad digital, la identificación y gestión de los aspectos e impactos ambientales; y la prevención de los incidentes, accidentes y enfermedades laborales en los niveles Nacional, Regional y Zonal.\n\n"
                "Para ello promovemos una cultura basada en la diligencia, el servicio, la comunicación efectiva, la innovación, el control, la mejora continua, el desarrollo del talento humano con el propósito de contribuir a la construcción de un país, donde los niños, niñas y adolescentes puedan desarrollarse en condiciones de equidad como expresión de la justicia social y fundamento de la paz.",
                style: TextStyle(
                  fontSize: 12,
                  height: 1.6,
                  color: Colors.black87,
                ),
                textAlign: TextAlign.justify,
              ),
            ],
          ),
        ),

        const SizedBox(width: 25),

        // 🟩 Objetivos de la Política Integrada
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text(
                "Objetivos de la Política Integrada",
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF2E7D32),
                ),
              ),
              SizedBox(height: 10),
              Text(
                "• Liderar la protección integral de los derechos de la niñez, la adolescencia y las familias en las comunidades y territorios.\n\n"
                "• Garantizar los derechos.\n\n"
                "• Gestionar los riesgos.\n\n"
                "• Operar por procesos.\n\n"
                "• Garantizar la seguridad y privacidad de la información.\n\n"
                "• Asegurar la seguridad digital.\n\n"
                "• Identificar y gestionar los aspectos e impactos ambientales.\n\n"
                "• Prevenir los incidentes, accidentes y enfermedades laborales.\n\n"
                "• Contribuir a la construcción de un país donde los niños, niñas y adolescentes puedan desarrollarse en condiciones de equidad como expresión de la justicia social y fundamento de la paz.",
                style: TextStyle(
                  fontSize: 12,
                  height: 1.6,
                  color: Colors.black87,
                ),
                textAlign: TextAlign.justify,
              ),
            ],
          ),
        ),
      ],
    );
  }

  /// 🔹 Imagen nítida (sin alterar posición)
  Widget _buildBrightImage() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 10,
            offset: Offset(2, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: ColorFiltered(
          colorFilter: ColorFilter.matrix([
            1.2, 0, 0, 0, 40,
            0, 1.2, 0, 0, 40,
            0, 0, 1.2, 0, 40,
            0, 0, 0, 1, 0,
          ]),
          child: Image.asset(
            "assets/imagenes/politica_integral.png",
            fit: BoxFit.cover,
            filterQuality: FilterQuality.high,
            width: double.infinity,
          ),
        ),
      ),
    );
  }
}
