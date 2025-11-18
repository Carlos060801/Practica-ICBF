// config.dart
import 'dart:io';

class Config {
  // URL del backend
  static String get apiUrl {
    if (Platform.isAndroid) {
      return "http://10.0.2.2:3000"; // Emulador Android
    }
    return "http://localhost:3000"; // Windows / Web
  }

  // 🔐 TOKEN GLOBAL
  static String token = "";
}
