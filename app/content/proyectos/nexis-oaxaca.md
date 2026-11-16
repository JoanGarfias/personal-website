---
id: nexis-oaxaca
period: Noviembre de 2026
team: Individual
teamSize: 1
location: Oaxaca, México
---

## Contexto
Nexis Oaxaca es una iniciativa juvenil que organiza encuentros, charlas y talleres para aprender, conectar y descubrir oportunidades en tecnología. Hasta ahora los eventos se publicaban y se gestionaban en Meetup, y el sitio de la comunidad era una web en Astro que leía su contenido de un CMS en Strapi.

## Problema
Meetup nos cubría lo básico, pero pagar la suscripción de organizador salía caro para una comunidad sin fines de lucro que se sostiene con el tiempo de sus voluntarios. Además, había cosas que no podíamos ajustar: el flujo de registro era el de la plataforma, los datos de los asistentes no vivían en nuestra base, no había un check-in con gafete propio y la experiencia no se sentía de Nexis. Al mismo tiempo, el CMS anterior estaba caído, así que actualizar el sitio dependía de un servidor que ya no respondía.

## Solución
Una versión pequeña de Meetup hecha a la medida de la comunidad, integrada en el sitio oficial:

*   **Cuentas** con correo o Google, perfil con intereses y profesión, y un correo de bienvenida con el grupo de WhatsApp.
*   **Eventos** presenciales o en línea, con ponentes, flyer, galería, grabación, cupo opcional y visibilidad abierta, por invitación o privada.
*   **Registro a eventos** con un gafete que lleva un código QR único y un enlace para liberar el lugar. El registro cierra 15 minutos después del inicio.
*   **Check-in en la puerta** desde el celular: los voluntarios escanean el gafete con la cámara o validan con el código o el correo.
*   **Eventos en línea** con un enlace personal que marca la asistencia y lleva al link privado de la reunión.
*   **Panel de administración** con usuarios, roles, exportación a CSV, eventos, ponentes, alianzas, equipo e historial de asistencia.
*   **Bitácora** de cada cambio que hace un administrador: quién, cuándo y qué cambió.

## Qué hice yo
Diseñé y desarrollé la plataforma completa: el rediseño del sitio público, el modelo de datos y las políticas de seguridad en Supabase, la API en Cloudflare Workers, los gafetes con QR, el escáner de check-in, el panel de administración y la migración de los encuentros que ya existían en el CMS anterior. Escribí un documento de requisitos con las funciones indispensables y trabajé con agentes de código para construir varias partes en paralelo, revisando e integrando cada una.

## Decisiones técnicas
*   **Nuxt 4:** un solo proyecto para el sitio público, la cuenta del usuario y el panel. Las páginas informativas se prerenderizan, los eventos se renderizan en el servidor con caché de 60 segundos y la cuenta y el panel corren como SPA.
*   **Cloudflare Workers:** el sitio y la API corren en el plan gratuito, sin servidores que mantener, junto con Turnstile para frenar bots en los formularios.
*   **Supabase (PostgreSQL + Auth):** autenticación con correo y Google, y toda la autorización en la base de datos con Row Level Security. Los roles `miembro`, `voluntario` y `admin` se resuelven en las políticas, no en el frontend.
*   **Cupo validado en la base:** el registro bloquea la fila del evento mientras cuenta los lugares, así dos personas que se registran al mismo tiempo no rebasan el cupo.
*   **Privacidad por diseño:** los voluntarios validan un gafete a la vez mediante funciones de la base y no ven la lista de registros ni los correos. En la página pública solo aparecen primeros nombres e iniciales.
*   **Cloudflare R2:** flyers, fotos y logos se guardan en el mismo ecosistema que el sitio.
*   **Resend:** correos de bienvenida, gafetes y notificaciones con el dominio de la comunidad.
*   **Migración desde Strapi:** un script genera un SQL idempotente con los 30 encuentros anteriores, sus ponentes, galerías y grabaciones; las URLs viejas redirigen con 301 a los nuevos slugs.

## Retos
El inicio de sesión con Google fue lo que más me detuvo: el flujo de OAuth no regresaba al sitio porque las URLs de redirección en Supabase estaban mal configuradas. Revisando el flujo completo entre Google, Supabase y la app encontré el error y lo corregí. Otro reto fue el escáner de QR: Safari en iPhone no soporta `BarcodeDetector`, así que agregué una alternativa con jsQR para que el check-in funcione en cualquier celular.

## Resultado
Una plataforma de eventos propia con costo de operación de $0: corre en los planes gratuitos de Cloudflare y Supabase, la comunidad es dueña de sus datos y del flujo de registro, y cualquier cambio se hace sobre un código que conocemos de punta a punta.
