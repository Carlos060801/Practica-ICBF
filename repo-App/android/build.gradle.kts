// 👇 Bloque que debes agregar al inicio del archivo
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        // 🔥 Este plugin permite que Firebase use google-services.json
        classpath("com.google.gms:google-services:4.4.2")
    }
}

// 👇 Resto del contenido original de tu archivo
allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}

subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
