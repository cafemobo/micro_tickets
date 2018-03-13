# micro_tickets

Microservicio de quejas y reclamos para Lumen Concept



Dockerfile	- Archivo de configuración para uso en Docker

config.js	- Archivo de configuración de mongoDB

docker-compose.yml	- Archivo de configuración para uso en Docker

package.json	- Archivo de descripción JSON de código

server.js	- Archivo de configuración principal

servicio.yml	- Archivo de servicio

ticket.js - Archivo de variables y despliegue



# USO:

Localmente se puede validar el microservicio de la sigueinte manera:

- Registro de queja

curl -X PUT http://127.0.0.1:9999/tickets/1 -d "cliente=Lument: Se queja por los altos costos de los bombillos"

- Consulta de queja:

curl -X GET http://127.0.0.1:9999/tickets/1
