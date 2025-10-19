# 🧮 Modelo de Regresión Lineal - Proyecto SIGE Bienestar familiar 
-------------------------------------
1. Objetivo del modelo 
Desarrollar un modelo predictivo que estime el nivel de participación o interacción de los usuarios en la aplicación SIGE, con base en variables relacionadas con su comportamiento dentro de la plataforma.
---------------------------------------
2. Variables del modelo
| Tipo                        | Variable                                    | Descripción                                                       |
| --------------------------- | ------------------------------------------- | ----------------------------------------------------------------- |
| Variable dependiente (Y)    | **Interacción del usuario**                 | Número de accesos o tiempo de uso en la app (minutos por semana). |
| Variable independiente (X₁) | **Número de políticas consultadas**         | Cuántas políticas institucionales visualizó el usuario.           |
| Variable independiente (X₂) | **Consultas al chatbot**                    | Número de interacciones con el chatbot.                           |
| Variable independiente (X₃) | **Sesiones iniciadas**                      | Cantidad de veces que el usuario ingresó en la aplicación.        |
| Variable independiente (X₄) | **Tiempo total en la aplicación (minutos)** | Duración total acumulada de uso.                                  |
----------------------------------------- 
3. Fórmula general
Donde: 
* Y = Nivel de Intereacción del usuario
* B0 = Intercepto 
* B1, B2, B3, B4 = Coeficiente de regresión 
* e = Error o término residual 
------------------------------------------
4. Interpretación

El modelo permitirá determinar cómo influyen las variables independientes (consultas, sesiones, uso del chatbot) en la interacción total.
Por ejemplo:

* Si 𝛽 2 > 0, significa que a más consultas al chatbot, mayor interacción total del usuario. 
* Si 𝛽1 es muy pequeño, las políticas consultadas no impactan tanto en la participación.
----------------------------------------
5. Aplicación dentro del sistema SIGE

El modelo puede integrarse en un panel administrativo que muestre métricas como:

* Nivel promedio de interacción semanal.
* Pilares más consultados.
* Actividad del chatbot.

Predicción del comportamiento futuro de los usuarios (por ejemplo, qué tipo de usuario necesita más acompañamiento).