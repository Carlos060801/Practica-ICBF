import 'respuestas_data.dart';

class ChatController {
  String obtenerRespuesta(String mensajeUsuario) {
    mensajeUsuario = mensajeUsuario.toLowerCase();

    for (final key in respuestasLocales.keys) {
      if (mensajeUsuario.contains(key)) {
        return respuestasLocales[key]!;
      }
    }

    return "Lo siento, no tengo información sobre eso. Por favor contacta con un asesor del ICBF.";
  }
}
