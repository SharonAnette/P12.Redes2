# Práctica 12 — Protocolo DNS

Este repositorio contiene el desarrollo de la **Práctica 12** de la asignatura **Aplicaciones para Comunicaciones en Red (6CV2)**, enfocada en la implementación de un **servidor proxy DNS** con filtrado de dominios mediante una lista negra en **Node.js** y **MySQL**:contentReference[oaicite:4]{index=4}.

---

## Objetivo
Implementar un **servidor proxy DNS** que actúe como intermediario entre clientes y un servidor DNS real, aplicando un sistema de **filtrado de dominios no deseados** mediante una **lista negra (blacklist)**.  
Cuando un cliente solicita un dominio restringido, el servidor devuelve una respuesta de “No existe el dominio"

---

## Cómo funciona
El sistema consiste en un **servidor DNS proxy** desarrollado con Node.js que:

1. **Recibe solicitudes DNS** de los clientes a través del puerto 53 (UDP).  
2. **Consulta una base de datos MySQL** para verificar si el dominio solicitado se encuentra en la lista negra.  
3. Si el dominio está bloqueado, responde con un código **NXDOMAIN**.  
4. Si no está bloqueado, **reenvía la consulta** al servidor DNS real (por ejemplo, 8.8.8.8 de Google) y devuelve la respuesta al cliente.  

El filtrado se configura mediante una base de datos llamada `dns_proxy`, donde se registran los dominios prohibidos. 
