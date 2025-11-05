# Práctica 12 — Protocolo DNS

Este repositorio contiene el desarrollo de la **Práctica 12** de la asignatura **Aplicaciones para Comunicaciones en Red (6CV2)**, enfocada en la implementación de un **servidor proxy DNS** con filtrado de dominios mediante una lista negra en **Node.js** y **MySQL**:contentReference[oaicite:4]{index=4}.

---

## Objetivo
Implementar un **servidor proxy DNS** que actúe como intermediario entre clientes y un servidor DNS real, aplicando un sistema de **filtrado de dominios no deseados** mediante una **lista negra (blacklist)**.  
Cuando un cliente solicita un dominio restringido, el servidor devuelve una respuesta de “No existe el dominio"

---

## Funcionamiento
El sistema consiste en un **servidor DNS proxy** desarrollado con Node.js que:

1. **Recibe solicitudes DNS** de los clientes a través del puerto 53 (UDP).  
2. **Consulta una base de datos MySQL** para verificar si el dominio solicitado se encuentra en la lista negra.  
3. Si el dominio está bloqueado, responde con un código **NXDOMAIN**.  
4. Si no está bloqueado, **reenvía la consulta** al servidor DNS real (por ejemplo, 8.8.8.8 de Google) y devuelve la respuesta al cliente.  

El filtrado se configura mediante una base de datos llamada `dns_proxy`, donde se registran los dominios prohibidos. 

---

# Práctica 13 — Ejemplo Protocolo DNS

## Objetivo
Desarrollar un sistema para manipular y procesar registros DNS, permitiendo la identificación, configuración y presentación de diversos tipos de registros DNS en un formato comprensible, con el fin de facilitar la interpretación de respuestas DNS y su utilidad en el análisis de red y diagnóstico de problemas.

## Funcionamiento
El programa implementa un cliente DNS en C que envía solicitudes de resolución de dominios a un servidor DNS (como 8.8.8.8) utilizando el protocolo UDP.  
El flujo se compone de cinco etapas principales:

1. **Configuración del socket:** Se abre un socket UDP para enviar y recibir paquetes entre el cliente y el servidor.  
2. **Preparación del paquete:** Se construye el encabezado DNS y el cuerpo de la consulta, incluyendo el tipo de registro (A, CNAME, MX, AAAA, etc.).  
3. **Envío de la solicitud:** El paquete se envía al servidor DNS y el programa espera una respuesta.  
4. **Procesamiento de la respuesta:** Se interpreta el paquete recibido, mostrando el tipo de registro, dirección IP o alias.  
5. **Visualización y control de errores:** Se imprimen los resultados y se manejan errores de red o consultas inválidas.

El sistema también puede ampliarse para incluir filtros o bloqueos de dominios mediante listas negras, operando como un proxy DNS de análisis y diagnóstico.  
