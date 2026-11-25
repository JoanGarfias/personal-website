---
title: Cómo construí la plataforma de eventos de Nexis Oaxaca en 7 horas
cover: /images/blog/nexis-oaxaca-en-7-horas/plataforma.png
coverAlt: 'Portada de la plataforma de Nexis Oaxaca: “Descubre hasta dónde puedes llegar en tecnología.”, con la iguana de circuitos y el acceso a Mi cuenta'
date: '2026-11-15'
description: Dejamos Meetup y armé una versión propia y acotada con Nuxt, Cloudflare Workers, Supabase y agentes de código. Qué decidí, cómo repartí el trabajo entre agentes y en qué me atoré.
draft: false
tags:
  - nuxt
  - cloudflare
  - supabase
  - claude-code
  - agentes
categoria: tecnico
---

En [Nexis Oaxaca](https://nexisoaxaca.tech) organizamos encuentros, charlas y talleres de tecnología. Durante un buen tiempo los gestionamos en Meetup, y funcionaba, pero llegó un punto en el que dejó de tener sentido. Este post cuenta cómo lo reemplacé con una plataforma propia en unas 7 horas de trabajo, apoyándome en agentes de código.

## Por qué dejamos Meetup

Fueron tres razones, y ninguna por sí sola habría bastado.

**1. El costo.** La suscripción de organizador la pagábamos nosotros. Para una comunidad sin fines de lucro, que se sostiene con el tiempo de sus voluntarios, es un gasto fijo difícil de justificar mes con mes.

**2. Cosas que no nos gustaban.** Meetup está pensado para cualquier grupo del mundo, así que la experiencia es genérica: la página del evento no se siente de Nexis, los correos que recibe la gente son los de la plataforma y lo que puedes personalizar es poco.

**3. No teníamos control sobre el flujo.** Cómo se registra alguien, qué datos se le piden, qué correo le llega, cómo se hace el check-in el día del evento: todo eso lo decidía Meetup. Y los datos de los asistentes vivían en su plataforma, no en la nuestra.

Para acabarla, el sitio de la comunidad leía su contenido de un CMS en Strapi que estaba caído. Era buen momento para empezar de cero.

## Primero entender, luego construir

Antes de escribir código me puse a analizar cómo funcionan algunas cosas de Meetup: cómo se publica un evento, qué pasa cuando alguien se registra, cómo se maneja el cupo, qué ve el organizador. No quería clonar Meetup; quería entender qué partes realmente usábamos para quedarme solo con esas.

La conclusión fue que necesitábamos una versión pequeña, con un alcance muy limitado, pero hecha a nuestra medida.

## Un PRD sencillo

Con eso escribí un PRD corto, con las funciones que sí o sí tenía que tener la plataforma. Todo lo demás quedaba fuera.

1. **Cuentas** con correo o con Google. Solo el nombre es obligatorio; profesión, intereses y cómo nos conociste son opcionales.
2. **Eventos** presenciales o en línea, con ponentes, flyer, descripción, galería y grabación de YouTube. Gratuitos o de paga; abiertos, con invitación o privados.
3. **Registro a eventos** con cupo opcional y un gafete con código QR que llega por correo, junto con un enlace para liberar el lugar si ya no vas a ir.
4. **Check-in en la puerta** desde el celular, para que los voluntarios escaneen los gafetes con la cámara.
5. **Eventos en línea** con un enlace personal que marca la asistencia y lleva a la reunión, sin publicar el link.
6. **Panel de administración** para gestionar eventos, ponentes, usuarios y roles, con exportación a CSV.
7. **Bitácora** de cada cambio que hace un administrador.

También dejé reglas que no se negociaban: seguir la guía de marca de Nexis (tipografía, paleta y logo), no inventar métricas en el copy y que todo corriera en planes gratuitos.

## Varios agentes trabajando al mismo tiempo

Construí la plataforma con [Claude Code](https://claude.com/claude-code). La clave para que cupiera en un día fue no trabajar en una sola conversación de forma lineal, sino repartir el trabajo entre varios agentes en paralelo.

Lo hice en dos fases:

- **Fase 1: el sitio.** Migrar el sitio de Astro a Nuxt con un rediseño completo, sacar el contenido del CMS caído a archivos JSON y desplegar en Cloudflare Workers.
- **Fase 2: la plataforma.** Cuentas, eventos, registro, check-in y panel sobre Supabase.

En la fase 2, mientras un agente trabajaba el esquema de la base y las políticas de seguridad, otro construía el panel de administración y otro el flujo de registro y los gafetes. Mi trabajo era más de director técnico que de programador: definir qué hacía cada uno, revisar lo que entregaba, probarlo e integrarlo.

Para que los agentes no se pisaran, el repositorio tenía un `CLAUDE.md` con la estructura del proyecto, los comandos y las reglas de marca, y un `LANZAMIENTO.md` con la lista única de pendientes. Así cada agente empezaba con el mismo contexto, sin que yo tuviera que repetirlo.

## El stack y por qué

| Pieza                  | Para qué                                                         |
| ---------------------- | ---------------------------------------------------------------- |
| **Nuxt 4**             | Un solo proyecto para el sitio, la cuenta del usuario y el panel |
| **Cloudflare Workers** | Hosting y API en el plan gratuito, sin servidores que mantener   |
| **Supabase**           | Autenticación (correo y Google) y PostgreSQL                     |
| **Cloudflare R2**      | Flyers, fotos y logos                                            |
| **Resend**             | Correos de bienvenida y gafetes                                  |
| **Turnstile**          | Frenar bots en los formularios                                   |

No cada página se sirve igual. Las páginas informativas se prerenderizan, los eventos se renderizan en el servidor con caché de 60 segundos para que un evento nuevo aparezca rápido, y la cuenta y el panel corren solo en el cliente porque dependen de la sesión:

```ts
routeRules: {
  '/**': { prerender: true },
  '/eventos/**': { prerender: false },
  '/cuenta/**': { prerender: false, ssr: false },
  '/admin/**': { prerender: false, ssr: false },
  '/checkin': { prerender: false, ssr: false },
}
```

La decisión más importante fue poner **toda la autorización en la base de datos** con Row Level Security. Los roles `miembro`, `voluntario` y `admin` viven en la tabla de perfiles y las políticas de Postgres deciden quién puede leer o escribir qué. Si mañana alguien se brinca el frontend y le pega directo a la API de Supabase, la base le dice que no. Con agentes generando código rápido, tener esa red de seguridad abajo me dio mucha tranquilidad.

## Los retos

### Me atoré con Google

Lo que más me detuvo fue el inicio de sesión con Google. El registro con correo ya funcionaba, pero con Google el flujo no regresaba al sitio: iniciabas sesión, Google te devolvía y la app no sabía qué hacer contigo.

Tardé en encontrarlo porque en el flujo de OAuth participan tres partes: Google, Supabase y la app. Investigando, el problema resultó estar en las **URLs de redirección en Supabase**, que estaban mal puestas. Google tiene que regresar al callback de Supabase (`https://<proyecto>.supabase.co/auth/v1/callback`), y Supabase tiene que tener permitidas las URLs de la app a las que redirige después (`/cuenta/**` en local, en `workers.dev` y en el dominio final). Al corregirlas, todo funcionó.

La lección: cuando un flujo de OAuth falla en silencio, hay que dibujar el viaje completo de la petición y revisar cada salto, no solo el código de la app.

### El cupo y las carreras

Si un evento tiene 30 lugares y dos personas se registran al mismo tiempo cuando queda uno, una validación en el servidor del tipo "cuenta y luego inserta" deja pasar a las dos. La solución fue llevar esa lógica a una función de Postgres que bloquea la fila del evento (`select ... for update`) mientras cuenta los lugares. El segundo registro espera a que termine el primero y ya ve el cupo lleno.

### El escáner de QR en iPhone

El check-in usa la cámara del celular. En Chrome y Android existe `BarcodeDetector`, que lee códigos QR de forma nativa, pero Safari en iPhone no lo soporta. Agregué una alternativa con jsQR para que funcione en cualquier teléfono. Además, la cámara solo funciona con HTTPS, así que para probar en un celular real durante el desarrollo usé un túnel con `cloudflared`.

### Confirmar el correo desde otro dispositivo

Por defecto, el enlace de confirmación de Supabase usa PKCE, y eso obliga a abrir el correo en el mismo navegador donde te registraste. Mucha gente se registra en la computadora y abre el correo en el celular. Cambié las plantillas para usar un enlace con `token_hash`, que funciona en cualquier dispositivo.

### Agentes en paralelo, archivos compartidos

Trabajar con varios agentes a la vez tiene su costo: a veces dos tocan lo mismo. Me pasó con la función que escribe la bitácora en la base: una migración posterior la redefinió para agregar las tablas del equipo, y había que cuidar que conservara todos los casos anteriores en lugar de reemplazarlos. Revisar con cuidado lo que cambia en las piezas compartidas es parte del trabajo cuando delegas.

### Privacidad para los voluntarios

Los voluntarios hacen check-in en la puerta, pero no tienen por qué ver la lista de asistentes ni sus correos. En lugar de darles permiso de lectura sobre la tabla de registros, validan un gafete a la vez mediante funciones de la base que solo devuelven el nombre y si es su primer encuentro. En la página pública de cada evento solo aparecen primeros nombres e iniciales; el apellido nunca sale de la base.

## Resultado

Al final del día, Nexis Oaxaca tiene una plataforma propia:

- **Costo de operación: $0.** Corre sobre los planes gratuitos de Cloudflare Workers y Supabase.
- **Control del flujo completo:** el registro, los correos, el gafete y el check-in funcionan como nosotros decidimos.
- **Los datos son de la comunidad**, en nuestra base y con políticas de seguridad que definimos nosotros.
- **Control sobre todo el código.** Conozco el stack de punta a punta, así que cualquier cambio lo podemos hacer sin depender de nadie.
- **Nada se perdió en la migración:** los 30 encuentros del CMS anterior pasaron a la nueva base, con sus ponentes, galerías y grabaciones, y las URLs viejas redirigen a las nuevas.

![Portada de la plataforma de Nexis Oaxaca: “Descubre hasta dónde puedes llegar en tecnología.”, con la iguana de circuitos y el acceso a Mi cuenta](/images/blog/nexis-oaxaca-en-7-horas/plataforma.png){height="923" width="1885"}

## Lo que me llevo

Siete horas suena a poco, y lo es, pero no fueron siete horas de escribir código. Fueron siete horas de decidir: qué entra y qué no, cómo se reparte el trabajo, qué revisar con lupa y qué dejar pasar. Los agentes aceleran muchísimo la parte de escribir; lo que no aceleran es saber qué quieres construir. Por eso el PRD corto fue lo que más valió la pena.

Si tienes una comunidad y estás pagando por una herramienta de la que solo usas una parte, vale la pena preguntarte si una versión pequeña y propia no te serviría más. Puedes ver el caso de estudio completo en [mi portafolio](/proyectos/nexis-oaxaca).
