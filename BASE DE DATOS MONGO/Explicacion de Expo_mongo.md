# para exportar la base de datos de Mongo DB attlas se necesita dos cosas importantes como: 
Instalar primero database-tools ya que hace como referencia primero database-tools de Mongo Attlas 
1. https://www.mongodb.com/try/download/database-tools
Luego instalar shell de Mongo para poder Descargar la base de datos de Mongo como se ve en la carpeta de Mongo Attlas 
2. https://www.mongodb.com/try/download/shell

luego en power shell o CMD darle el comando para saber la version de Shell que ha descargado: 
mongosh --version
probar este enlace para saber la conexion de la base de datos 
mongosh "mongodb+srv://admin_sige:Sige2025@sige.ayilmi5.mongodb.net/sige_db"

luego identificamos donde quedo mongo  con esté comando en powershell o mongo

C:\Program Files\MongoDB\Tools\100\bin\
luego vamos al comando para identificar que versión se instalo 
"C:\Program Files\MongoDB\Tools\100\bin\mongodump.exe" --version

Luego vamos a este comando para que pueda realizar la descarga de la base de datos de Sige en Mongo: 
& "C:\Program Files\MongoDB\Tools\100\bin\mongodump.exe" --uri="mongodb+srv://admin_sige:Sige2025@sige.ayilmi5.mongodb.net/sige_db" --out="C:\backup-sige"

