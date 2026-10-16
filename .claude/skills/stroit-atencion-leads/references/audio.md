# Notas de voz con ElevenLabs

Mandar una nota de voz con una voz femenina mexicana natural se siente más cercano que un texto y ayuda a que el cliente conteste. Se usa en dos momentos:
1. **Preguntas de perfilamiento** (aplicación, color, medidas, ciudad, fecha): solo si al lead le tocó la variante *audio* de la prueba A/B de formato (abajo).
2. **Cotización**: el PDF siempre va como archivo y, si el lead está en la variante *audio*, se acompaña de una nota de voz que resume el total y cierra con "¿Te aparto la placa?".

Si el usuario pide audio para un cliente concreto, se manda audio aunque la variante diga texto, y la variante se registra como `fuera`.

## Voz y modelo (`cotizador/config.json` › `audio`)

- Voz: **Ana María** (`m7yTemJqdIqrcNleANfX`), mexicana, cálida y natural. Si el usuario pide otra, búscala con `creative_list_voices` (`languages: ["es"]`, `accent: "mexican"`, `gender: "female"`). Alternativas ya probadas: Cristina (`EsHsbdAoFNIyDFJ5UnZx`) y Regina (`9Godp7dNohUvXk6qp0gS`).
- Modelo: `eleven_v4`, que acepta indicaciones entre corchetes como `[warm, casual]`, `[short pause]` o `[friendly]`.
- Cada audio de ≈35 s gasta ≈630 créditos por variación. La cuenta es Free Tier y ya marcó "actividad inusual" una vez: si una generación falla por eso, avisa al usuario de que hace falta un plan de pago y entrega el mensaje en texto.

## Cómo escribir el guion

Se escribe para el oído, no para leerse:
- **Máximo ≈40 s** (unas 90 a 110 palabras). Si hay más que decir, lo que se lee (lista de modelos, enlaces, cuentas) va en texto.
- **Cifras con palabras**: "treinta mil setenta y un pesos", "tres veinte por uno cuarenta y cinco", "dieciséis de octubre". Nada de `$`, `m²`, `x`, asteriscos, viñetas ni emojis.
- Tono de nota de voz: "¡Hola Luis! ¿Cómo estás?", "Oye", "te cuento", "ojo". Tutea y usa el nombre.
- Igual que en texto: responde **todo** lo que preguntó y cierra con **una sola pregunta**.
- Si ya pasó tiempo, empieza con "una disculpa por la demora".
- Empieza el guion con `[warm, casual]` y usa `[short pause]` antes de cambiar de tema.

Ejemplo (Luis Montaño, cotización, octubre 2026):
> [warm, casual] ¡Hola Luis! ¿Cómo estás? Oye, una disculpa por la demora. Te cuento: la placa de Dekton Borealis te queda en treinta mil setenta y un pesos, y el envío a la Ciudad de México va sin costo. [short pause] Ahora, la mano de obra la cobra directamente el instalador, pero para que te des una idea, el corte e instalación de tu cocina en L, con la tarja, la parrilla y el zoclo, anda más o menos en unos diez mil trescientos pesos. Nosotros no instalamos, pero con mucho gusto te recomendamos a alguien de confianza. [friendly] Y ojo, que la promo está vigente hasta mañana, dieciséis de octubre. ¿Te aparto la placa?

## Generar y entregar

1. `creative_generate_speech` con `model_id: "eleven_v4"`, el `voice_id` de `config.json` y el guion como `prompt`. Deja `generations_count` en su valor por defecto, para que el vendedor elija la toma que suene más natural.
2. Espera con `creative_get_flow_run_status` (con el `flow_id` y los `session_ids`) hasta que `all_completed` o `has_failures` sea verdadero. **No repitas la generación** si una toma falla: cada llamada cobra de nuevo.
3. Descarga cada toma terminada con el script, que también la convierte a nota de voz de WhatsApp (`.ogg` con Opus, si hay ffmpeg):
   ```bash
   python3 .claude/skills/stroit-atencion-leads/audio/descargar_audio.py "<url de la toma>" /mnt/project-files/audios/<cliente>/<nombre>
   ```
   Guarda `<nombre>.mp3` (Instagram y Facebook) y `<nombre>.ogg` (WhatsApp, se reproduce como nota de voz). Las URLs de ElevenLabs caducan a las 2 h, así que descarga en cuanto terminen.
4. Entrega al usuario el guion y los audios. **No los envíes al cliente**: el vendedor los manda desde Parrot.

## Ventana de mensajería

El audio es mensaje libre: solo se puede mandar **dentro de las 24 h** desde el último mensaje del cliente. En Instagram y Facebook, Parrot puede ampliarlo a 7 días con la etiqueta de agente humano, si la tiene. Fuera de la ventana, primero va la plantilla aprobada (`guiones.md` › Recontacto) y el audio, cuando el cliente responda.

## Prueba A/B: texto vs. audio

Qué medimos: ¿el cliente contesta y avanza más si le preguntamos con nota de voz o con texto?

**Asignación** (independiente de la prueba de precio, que usa el último dígito): **penúltimo dígito** del WhatsApp del cliente, o de su ID de Instagram o Facebook (`attrs.ig_id`) si no hay WhatsApp.
- **Par** (0, 2, 4, 6, 8) → `texto`: todo se manda en texto, como siempre.
- **Impar** (1, 3, 5, 7, 9) → `audio`: las preguntas y explicaciones van en nota de voz.

La variante se asigna una vez, desde el primer mensaje que mandamos, y se mantiene en todos los mensajes y seguimientos del lead.

**Qué cambia en la variante audio**: solo el formato. El contenido es el mismo mensaje que en texto (mismos datos, misma pregunta de cierre). Lo que el cliente necesita leer o guardar sigue en texto, en un mensaje corto junto al audio: la lista de modelos con precio y sus fotos, los enlaces (catálogo, cuentas, Mercado Pago, mapa) y el PDF de la cotización.

**No aplica** (`fuera`) cuando el cliente pidió explícitamente texto o audio, cuando el usuario pide audio para ese cliente, o cuando estamos fuera de la ventana de 24 h y solo se puede mandar plantilla.

**Registro en ParrotCRM** (con aprobación del usuario):
- `update_lead` con `attrs.abFormato`: `texto`, `audio` o `fuera`.
- En la nota, una línea `🎙️ A/B formato: audio` (o `texto` o `fuera`), y en `Adjuntar:` el nombre del archivo de audio.

**Qué medir**, por variante y contando desde el primer mensaje con esa variante:
1. **Respuesta en 24 h** a cada pregunta (la métrica principal de esta prueba: ¿contesta más rápido?).
2. **Avance**: cuántos datos del perfil completa (aplicación, color, medidas, ciudad) y si llega a cotización.
3. **Venta** y monto.

Revisa resultados con **al menos 20 leads por variante**. Cuando el usuario pida el reporte, busca en ParrotCRM los leads con `abFormato` y arma una tabla con leads, % de respuesta en 24 h, % que llega a cotización, ventas y venta por lead. Cruza con `abPrecio` solo si hay suficientes leads en cada combinación.
