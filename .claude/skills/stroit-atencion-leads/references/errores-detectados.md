# Errores detectados en conversaciones reales (ParrotCRM, sep–oct 2026)

Úsalos para auditar las respuestas de los vendedores y para no repetirlos.

## 1. Tardar horas o días en responder
Un cliente de Dekton escribió "¿en cuánto tienen la hoja?" y la respuesta llegó **5 h después**. En otro caso pasaron **3 días**: el cliente volvió a entrar por el anuncio 3 veces antes de recibir un precio. En el lead de prisa (piso, León) la respuesta real llegó al **día siguiente**, con plantilla.
**Corrección:** en horario laboral, responde en menos de 10 minutos. Si el bot contestó, el vendedor debe tomar la conversación en cuanto el cliente pregunte precio.

## 2. Esquivar el precio
- "El costo varía de acuerdo al modelo, así como las medidas…" + "¿Buscas algún color?"
- Al bot: "Permíteme revisarlo con nuestro equipo".
- "Te comparto enseguida los banners" (cuando pidió precio).
**Corrección:** da 2 o 3 precios concretos de inmediato (ver `guiones.md` §2) y después pregunta.

## 3. Preguntar en vez de contestar (modo prisa ignorado)
Cliente: "No, ¿cómo lo vendes, cuánto cuesta? Estoy en León, solo quiero saber las medidas, los precios y el modo de instalación". El bot ya le había hecho 2 preguntas de perfil.
**Corrección:** cuando el cliente lo dice explícitamente, se cancela el perfilamiento: respondes las 3 cosas (precio, medidas e instalación) en un mensaje y haces una sola pregunta (m²).

## 4. Contestar solo una de varias preguntas
Cliente: "¿Se puede colocar sobre muro de ladrillo? ¿Y en qué tamaño vienen?" → bien, se respondieron ambas. Pero en otro caso el cliente preguntó "¿Y qué pegamento lleva?" y "¿cuánto cuesta?", y se respondió primero la instalación y el precio hasta después de insistir 2 veces.
**Corrección:** haz un checklist de las preguntas abiertas antes de enviar.

## 5. Plantilla genérica para recontactar
"Hola excelente día! Me apoyas respondiendo este mensaje para enviarte la información", enviada a clientes que **ya** habían platicado (incluso a uno que ya tenía precio de Laurent). No aporta valor y suena a bot.
**Corrección:** plantillas con variables (nombre y proyecto) y, al responder el cliente, un mensaje inmediato con contexto (`guiones.md` §9).

## 6. "Enseguida te lo comparto" y no llega nada con valor
Catálogo enviado sin comentario, o "Claro que sí" sin seguimiento.
**Corrección:** acompaña el catálogo con 2 recomendaciones concretas y una pregunta.

## 7. No hacer el cálculo cuando el cliente no tiene medidas
"No lo sé, todavía no he medido" → "Perfecto, claro que sí, no te preocupes" y la conversación se enfría.
**Corrección:** da un estimado típico, explica cómo medir (largo x ancho, una foto) y deja agendado el seguimiento: "¿Te escribo mañana para ver las medidas?".

## 8. Rendirse ante "está caro"
Cliente: "El precio es casi de $4,800 el m², necesito ahorrar". El vendedor ofreció alternativas en Flash Sale ✅, pero sin precios y sin seguimiento después del "en cuanto pueda me comunico".
**Corrección:** pon el precio de las alternativas, ofrece la muestra gratis y programa un recontacto en 2 o 3 semanas con la promo vigente.

## 9. No retomar a los leads que vuelven
El mismo cliente entró 4 veces por anuncios a lo largo de 2 meses y cada vez se le trató como nuevo (el bot repitió el párrafo sobre la sinterización).
**Corrección:** revisa el historial; retoma con "¡Hola de nuevo!" y el último estado.

## 10. Párrafos técnicos al inicio
El mensaje automático de bienvenida explica "sinterización de partículas que replica cambios metamórficos…" antes de saber qué necesita el cliente.
**Corrección:** usa beneficios en una línea (calor, rayones, manchas, sol, 25 años) y pregunta por la aplicación.

## Lo que sí funciona (mantenerlo)
- Enviar 3 o 4 modelos con foto y una línea de descripción cuando el cliente dice el estilo ("tengo este modelo con vetas doradas…").
- Comparar con la foto del cliente: "Este modelo se me hace súper parecido a tu fachada".
- Explicar el envío gratis por flete consolidado y el flete dedicado si es urgente.
- Pasar la ubicación con el QR de acceso para visitas.
- Las notas de seguimiento sugerido en ParrotCRM con la hora en que vence la ventana de 24 h.
