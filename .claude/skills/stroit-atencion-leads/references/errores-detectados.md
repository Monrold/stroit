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
**Corrección:** manda el catálogo solo, sin recomendar modelos, y cierra con "¿Tienes algún tono o color en mente?". Cuando conteste, mándale al menos 6 modelos de ese color con foto y precio.

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

## 11. Recomendar modelos que no vienen en el catálogo enviado
Al lead de piso en León se le mandó el Flash Sale de septiembre (Lyfe Lunar $15,833, Strato $16,880, Crema Marfil $16,351…), pero la primera sugerencia de seguimiento proponía Kreta, Lunar y Aeris con precios de `modelos.md` que ya no coincidían (en el catálogo de octubre, Kreta está en $27,823). El cliente vería modelos y precios que no encuentra en su PDF.
**Corrección:** abre el PDF que se le envió y recomienda solo modelos de ahí, con ese precio. Si ya tiene los precios, no se los repitas: fíltrale el catálogo y recuérdale que se vende por placa completa y cuántos m² cubre (sin precio por m², salvo que lo pida).

## 12. Lo aprendido con Luis Montaño (Instagram, octubre 2026)
- **Mensajes largos**: la primera propuesta juntaba beneficios, precio, medidas y dos preguntas. **Corrección:** 2 o 3 líneas y una pregunta; el precio, cuando lo pida o al cotizar.
- **Pocos modelos**: con "blanco o beige" se propusieron 3. **Corrección:** al menos 6, agrupados por color.
- **Texto interno pegado al cliente**: se copió toda la nota, con la lista "Adjuntar fotos" y una comilla suelta. **Corrección:** en la nota, el mensaje va entre comillas y lo interno debajo, marcado 🔒.
- **Bot de Parrot cruzado**: programó "¿Ya tienes algún color?" y "Permíteme revisarlo con nuestro equipo" justo cuando el vendedor ya había respondido. **Corrección:** revisa los mensajes `scheduled` del bot y avisa que se cancelen.
- **Precio antes de tiempo**: al confirmar que alcanzaba 1 placa se proponía dar el precio y "no incluye instalación". **Corrección:** confirma placas, pide la ciudad y manda la cotización completa (material, envío y mano de obra).
- **Cotización sin mano de obra**: el cliente preguntó "¿en cuánto sale la mano de obra?". **Corrección:** la cotización siempre la incluye como referencia.

## 13. Lo aprendido con Cheli (WhatsApp desde la web, octubre 2026)
Pidió cotizar 6 modelos por nombre (Dekton Arga, Kovik, Adia, Ava; Silestone Blanco Norte; Sensa Taj Mahal) para una barra de terraza.
- **Descartar modelos por la aplicación antes de confirmar existencia**: Blanco Norte y Taj Mahal sí estaban en `modelos.md` (con foto), pero como la regla dice "exterior → Dekton", se omitieron de la lista de disponibles y la clienta no supo que había entrega inmediata. **Corrección:** primero confirma la existencia de cada modelo pedido, de las tres marcas; luego la restricción de uso.
- **No ofrecer alternativa**: Arga no está en bodega y solo se dijo "sobre pedido", sin ofrecer Taga, que es muy parecida y tiene el mismo acabado. **Corrección:** usa la tabla *Alternativas parecidas* de `modelos.md`.
- **Mensaje largo, con asteriscos y precios repetidos**: 3 burbujas con precio de cada modelo, cuando las fotos ya los traen. **Corrección:** una burbuja, texto plano, solo los nombres de los modelos.
- **Necesidad sin respaldar**: "aguanta sol y lluvia" no explica por qué Dekton sirve para su barra. **Corrección:** liga el beneficio a su uso (no se decolora con el sol, no se mancha con bebidas o grasa, 25 años de garantía).
- **Cierre plano**: "¿Cuánto mide tu barra?". **Corrección:** "Si me compartes cuánto mide tu barra, con gusto te ayudo con la cuantificación del material. ¿Te gustaría usarlo también en otra área de tu proyecto?".

## Lo que sí funciona (mantenerlo)
- Enviar al menos 6 modelos con foto y una línea de descripción cuando el cliente dice el estilo ("tengo este modelo con vetas doradas…").
- Comparar con la foto del cliente: "Este modelo se me hace súper parecido a tu fachada".
- Explicar el envío gratis por flete consolidado y el flete dedicado si es urgente.
- Pasar la ubicación con el QR de acceso para visitas.
- Las notas de seguimiento sugerido en ParrotCRM con la hora en que vence la ventana de 24 h.
