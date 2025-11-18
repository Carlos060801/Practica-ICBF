import 'package:flutter/material.dart';
import 'dart:math';

// Importa las páginas de detalle
import 'politica_integrada_page.dart';
import 'politica_ambiental_page.dart';
import 'politica_calidad_page.dart';
import 'politica_SGSI.dart';
import 'politica_sst_page.dart';
import 'politica_Riesgos.dart';
import 'politica_tratamiento_datos_personales.dart';
// importa las paginas del menu de registro y busqueda
import 'registro_page.dart';
import 'buscar_page.dart';

void main() {
  runApp(const SigeApp());
}

class SigeApp extends StatelessWidget {
  const SigeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SIGE',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF004884),
        scaffoldBackgroundColor: const Color(0xFFE5E5E5),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF4CAF50),
          foregroundColor: Colors.white,
          centerTitle: true,
        ),
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("SIGE")),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Banner superior
            Stack(
              children: [
                Image.network(
                  "https://media.meer.com/attachments/1d334761b4d6b7f0e6a11de3e33ec416151467c5/store/fill/1090/613/cfa7d57c9ed10b7f570cabaaff5c118ab13b66d29130656076dfda507b6b/Ninos-felices-en-plena-naturaleza.jpg",
                  width: double.infinity,
                  height: 180,
                  fit: BoxFit.cover,
                ),
                Positioned(
                  bottom: 15,
                  left: 15,
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    color: Colors.black54,
                    child: const Text(
                      "Sistema Integrado de Gestión",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // ===== MENÚ DE QUE ES ICBF, MISIÓN, VISIÓN, VALORES Y OBJETIVOS =====
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 8.0,
              ),
              child: Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.0),
                ),
                elevation: 3,
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(
                        Icons.emoji_objects,
                        color: Color(0xFF004884),
                      ),
                      title: const Text(
                        'Misión',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      subtitle: const Text(
                        'Ver en detalle la misión institucional ',
                      ),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const MisionPage(),
                          ),
                        );
                      },
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(
                        Icons.visibility,
                        color: Color(0xFF004884),
                      ),
                      title: const Text(
                        'Visión',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      subtitle: const Text(
                        'Ver en detalle la visión institucional',
                      ),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const VisionPage(),
                          ),
                        );
                      },
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(Icons.star, color: Color(0xFF004884)),
                      title: const Text(
                        'Valores',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      subtitle: const Text(
                        'Ver en detalle los valores institucionales',
                      ),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ValoresPage(),
                          ),
                        );
                      },
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(
                        Icons.track_changes,
                        color: Color(0xFF004884),
                      ),
                      title: const Text(
                        'Objetivos Estratégicos',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      subtitle: const Text(
                        'Ver en detalle los objetivos estratégicos',
                      ),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ObjetivosPage(),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Grid de tarjetas
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                children: [
                  buildCard(Icons.policy, "Política Integrada", () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const PoliticaIntegradaPage(),
                      ),
                    );
                  }, const Color(0xFF4CAF50)), // Verde SIGE ✅

                  buildCard(Icons.eco, "Política Ambiental", () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const PoliticaAmbientalPage(),
                      ),
                    );
                  }, const Color(0xFF1B5E20)), // Verde oscuro

                  buildCard(Icons.check_circle, "Política de Calidad", () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const PoliticaCalidadPage(),
                      ),
                    );
                  }, Colors.orange), // Naranja

                  buildCard(Icons.security, "Política SGSI", () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const PoliticaSGSIPage(),
                      ),
                    );
                  }, const Color(0xFF0D47A1)), // Azul oscuro

                  buildCard(
                    Icons.health_and_safety,
                    "Política SST",
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const PoliticaSSTPage(),
                        ),
                      );
                    },
                    Colors.yellow, // Amarillo para SST ✅
                  ),

                  buildCard(Icons.warning, "Política de Riesgos", () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const PoliticaRiesgosPage(),
                      ),
                    );
                  }, const Color(0xFF4CAF50)), // Verde SIGE ✅

                  buildCard(
                    Icons.privacy_tip,
                    "Tratamiento Datos Personales",
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              const PoliticaTratamientoDatosPersonalesPage(),
                        ),
                      );
                    },
                    const Color(0xFF004884),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),

      // Menú inferior con navegación a Buscar y Registro
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        selectedItemColor: const Color(0xFF4CAF50),
        unselectedItemColor: Colors.grey[600],
        onTap: (index) {
          if (index == 1) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const BuscarPage()),
            );
          } else if (index == 2) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const RegistroPage()),
            );
          }
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Inicio"),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: "Buscar"),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: "Registro"),
        ],
      ),
    );
  }

  // Tarjetas con estilo gov.co
  Widget buildCard(
    IconData icon,
    String title,
    VoidCallback onTap,
    Color color,
  ) {
    return Card(
      color: Colors.white,
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 40, color: color),
              const SizedBox(height: 10),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF004884),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ===== PÁGINAS QUE YA TENÍAS (MISIÓN, VISIÓN, VALORES, OBJETIVOS) =====
// (No las toqué porque no pediste cambios, solo copié las que ya estaban)

class MisionPage extends StatelessWidget {
  const MisionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Misión")),
      body: Center(child: MisionCircleWidget()),
    );
  }
}

class MisionCircleWidget extends StatelessWidget {
  const MisionCircleWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        CustomPaint(size: const Size(420, 420), painter: CircleDotsPainter()),
        Container(
          width: 350,
          height: 350,
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: SingleChildScrollView(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Text(
                    "Misión",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.teal,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 10),
                  Text(
                    "Liderar la protección integral de los derechos de la niñez, la adolescencia y las familias, a través de la articulación e implementación de las políticas públicas, el fortalecimiento de la oferta del servicio público de bienestar familiar para la promoción de su pleno desarrollo, la consolidación de proyectos de vida y el fortalecimiento de las capacidades de las familias, comunidades y territorios, promoviendo la equidad como expresión de justicia social y fundamento de la paz.",
                    style: TextStyle(fontSize: 14, color: Colors.black87),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class CircleDotsPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final Paint paintCircle = Paint()
      ..color = Colors.teal
      ..style = PaintingStyle.fill;

    canvas.drawCircle(
      Offset(size.width / 2, size.height / 2),
      size.width / 2,
      paintCircle,
    );

    final Paint paintDots = Paint()
      ..color = Colors.yellow.shade600
      ..style = PaintingStyle.fill;

    const int numDots = 24;
    final double radius = size.width / 2;
    const double dotRadius = 8;

    for (int i = 0; i < numDots; i++) {
      double angle = (2 * pi / numDots) * i;
      double dx = size.width / 2 + (radius - 10) * cos(angle);
      double dy = size.height / 2 + (radius - 10) * sin(angle);
      canvas.drawCircle(Offset(dx, dy), dotRadius, paintDots);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class VisionPage extends StatelessWidget {
  const VisionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Visión")),
      body: Center(child: VisionCircleWidget()),
    );
  }
}

class VisionCircleWidget extends StatelessWidget {
  const VisionCircleWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        CustomPaint(size: const Size(420, 420), painter: CircleDotsPainter()),
        Container(
          width: 350,
          height: 350,
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
          child: Padding(
            padding: const EdgeInsets.all(25.0),
            child: SingleChildScrollView(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Text(
                    "Visión",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.teal,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 10),
                  Text(
                    "En el 2030 el ICBF, como entidad articuladora de los diferentes sectores y actores territoriales que conforman el Sistema Nacional de Bienestar Familiar, consolidará la materialización de condiciones que permitan el desarrollo y la protección integral de los derechos de niñas, niños, adolescentes y familias, posicionándoles como la generación de la vida, la paz y la justicia social.",
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.black87,
                      height: 1.4,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class ValoresPage extends StatelessWidget {
  const ValoresPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Valores")),
      body: Center(
        child: Stack(
          alignment: Alignment.center,
          children: [
            CustomPaint(
              size: const Size(320, 320),
              painter: CircleDotsPainter(),
            ),
            Container(
              width: 260,
              height: 260,
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Text(
                        "Nuestros Valores",
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.teal,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 12),
                      Text(
                        "1. Honestidad.\n2. Respeto.\n3. Diligencia.\n4. Servicio.\n5. Justicia.\n6. Compromiso.\n7. Integridad.",
                        style: TextStyle(
                          fontSize: 15,
                          color: Colors.black87,
                          height: 1.5,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ObjetivosPage extends StatelessWidget {
  const ObjetivosPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Objetivos Estratégicos")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Table(
          border: TableBorder.all(color: Colors.black54),
          columnWidths: const {0: FlexColumnWidth(1), 1: FlexColumnWidth(4)},
          children: [
            buildRow(
              "1",
              "Fortalecer la protección integral de la niñez y adolescencia.",
              Colors.blue.shade100,
            ),
            buildRow(
              "2",
              "Impulsar políticas públicas para el bienestar familiar.",
              Colors.green.shade100,
            ),
            buildRow(
              "3",
              "Promover la equidad y la paz como principios sociales.",
              Colors.yellow.shade100,
            ),
            buildRow(
              "4",
              "Consolidar proyectos de vida y desarrollo comunitario.",
              Colors.orange.shade100,
            ),
            buildRow(
              "5",
              "Garantizar la participación activa de las familias en la toma de decisiones.",
              Colors.purple.shade100,
            ),
            buildRow(
              "6",
              "Fortalecer la transparencia y la rendición de cuentas institucional.",
              Colors.red.shade100,
            ),
            buildRow(
              "7",
              "Fomentar la innovación en programas de protección y bienestar.",
              Colors.teal.shade100,
            ),
            buildRow(
              "8",
              "Ampliar la cobertura de servicios en zonas vulnerables.",
              Colors.pink.shade100,
            ),
            buildRow(
              "9",
              "Contribuir al cumplimiento de los ODS relacionados con la niñez y la familia.",
              Colors.cyan.shade100,
            ),
          ],
        ),
      ),
    );
  }

  TableRow buildRow(String num, String texto, Color color) {
    return TableRow(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          color: color,
          child: Center(
            child: Text(
              num,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        ),
        Container(
          padding: const EdgeInsets.all(12),
          child: Text(texto, style: const TextStyle(fontSize: 14)),
        ),
      ],
    );
  }
}
