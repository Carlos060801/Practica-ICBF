// =====================================================
// LOGIN (Versión Final para SIGE + Flutter)
// =====================================================

export const login = async (req, res) => {
  try {
    console.log("BODY RECIBIDO EN LOGIN:", req.body); // 👀 Debug en Render

    const { email, password } = req.body;

    // Validación obligatoria
    if (!email || !password) {
      return res.status(400).json({
        message: "Faltan email o password",
        bodyRecibido: req.body
      });
    }

    const emailLower = email.toLowerCase();
    const user = await User.findOne({ email: emailLower });

    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Notificación
    await createNotification({
      type: "info",
      title: "Nuevo inicio de sesión",
      message: `El usuario ${emailLower} inició sesión`,
    });

    // Respuesta completa para Flutter
    return res.json({
      message: "Login exitoso",
      token,
      role: user.role,
      name: user.name ?? "",
      email: user.email,
      fotoUrl: user.photo ?? "",
      phone: user.phone ?? "",
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error en login",
      error: err.message,
    });
  }
};
