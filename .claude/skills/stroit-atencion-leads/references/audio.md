# Notas de voz con ElevenLabs

Mandar una nota de voz con una voz femenina mexicana natural se siente más cercano que un texto y ayuda a que el cliente conteste. **Audio o texto se decide en cada mensaje, leyendo la conversación** (ver *Cuándo mandar audio* abajo): el audio se usa en los momentos en que ayuda a que el cliente avance, y el texto cuando lo que necesita es leer, guardar o ver un dato rápido. La prueba A/B por dígito solo decide los casos sin señales claras.

Si el usuario pide audio para un cliente concreto, se manda audio aunque las reglas digan texto (motivo `usuario`).

## Voz y modelo (`cotizador/config.json` › `audio`)

- Voz: **Ana María** (`m7yTemJqdIqrcNleANfX`), mexicana, cálida y natural. Si el usuario pide otra, búscala con `creative_list_voices` (`languages: ["es"]`, `accent: "mexican"`, `gender: "female"`). Alternativas ya probadas: Cristina (`EsHsbdAoFNIyDFJ5UnZx`) y Regina (`9Godp7dNohUvXk6qp0gS`).
- Modelo: `eleven_v4`, que acepta indicaciones entre corchetes como `[warm, casual]`, `[short pause]` o `[friendly]`.
- **Siempre se genera un solo audio** (`generations_count: 1`), nunca varias versiones: así lo pidió el usuario para ahorrar créditos. Cada audio de ≈35 s gasta ≈630 créditos. La cuenta es Free Tier y ya marcó "actividad inusual" una vez: si una generación falla por eso, avisa al usuario de que hace falta un plan de pago y entrega el mensaje en texto.

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

1. `creative_generate_speech` con `model_id: "eleven_v4"`, el `voice_id` de `config.json` y el guion como `prompt`. Pasa **`generations_count: 1`**: un solo audio por respuesta, nunca varias versiones.
2. Espera con `creative_get_flow_run_status` (con el `flow_id` y los `session_ids`) hasta que `all_completed` o `has_failures` sea verdadero. **No repitas la generación** si falla: cada llamada cobra de nuevo. Avisa al usuario y entrega el mensaje en texto.
3. Descarga el audio con el script, que también lo convierte a nota de voz de WhatsApp (`.ogg` con Opus, si hay ffmpeg):
   ```bash
   python3 .claude/skills/stroit-atencion-leads/audio/descargar_audio.py "<url del audio>" /mnt/project-files/audios/<cliente>/<nombre>
   ```
   Guarda `<nombre>.mp3` (Instagram y Facebook) y `<nombre>.ogg` (WhatsApp, se reproduce como nota de voz). Las URLs de ElevenLabs caducan a las 2 h, así que descarga en cuanto terminen.
4. Entrega al usuario el guion y el audio. **No lo envíes al cliente**: el vendedor lo manda desde Parrot.

## Ventana de mensajería

El audio es mensaje libre: solo se puede mandar **dentro de las 24 h** desde el último mensaje del cliente. En Instagram y Facebook, Parrot puede ampliarlo a 7 días con la etiqueta de agente humano, si la tiene. Fuera de la ventana, primero va la plantilla aprobada (`guiones.md` › Recontacto) y el audio, cuando el cliente responda.

## Cuándo mandar audio: decisión por conversación

Antes de cada mensaje, lee la conversación y decide el formato con estos pasos, en orden. El primero que aplique decide.

### Paso 1. Lo que no se puede
- **Fuera de la ventana de 24 h** → solo plantilla aprobada, sin audio (ver *Ventana de mensajería*).
- **Sin créditos de ElevenLabs** o la generación falló → texto, y avisa al usuario.

### Paso 2. Lo que pide el cliente (manda siempre)
- Pidió que se lo pasen **por escrito**, dice que **no puede escuchar audios** (trabajo, reunión) o ya ignoró un audio y contestó en texto pidiendo el dato → **texto**. Motivo `cliente-texto`; a partir de ahí, todo en texto con ese lead.
- Pidió **audio o llamada**, o **él manda notas de voz** → **audio**. Motivo `cliente-audio`: si él habla en audio, contestarle en audio se siente natural.

### Paso 3. Momentos de audio (ayudan a avanzar)
Manda audio cuando la conversación está en alguno de estos momentos:

| Momento | Señales en la conversación | Por qué el audio ayuda | Motivo |
|---|---|---|---|
| **Cliente enfriándose** | Contesta con monosílabos ("No", "Ok", "Sí"), tarda cada vez más o ya no hace preguntas | Una voz humana rompe el ritmo de bot y reactiva la plática | `enfriandose` |
| **Seguimiento tras silencio** | No contestó el último mensaje (2–3 h después del catálogo, a las 24 h, 3 o 7 días) y seguimos dentro de la ventana | Un audio corto destaca entre los chats y no se siente como mensaje automático | `seguimiento` |
| **Explicación o comparación** | "¿Qué diferencia hay entre Dekton y Silestone?", "¿sirve para exterior?", "¿cuántas placas necesito?" | Se entiende mejor hablado que en un párrafo, y evita mensajes largos | `explicacion` |
| **Objeción o duda** | "Está caro", "lo voy a pensar", "¿es confiable?", "lo vi más barato" | El tono cálido baja la tensión; en texto la respuesta suena a defensa | `objecion` |
| **Preguntas de dolor, deseo o urgencia** | Ya tenemos aplicación y color y toca el método Campamento de Ventas ("¿Para cuándo te gustaría tenerla lista?", "¿qué es lo que más te preocupa?") | Se siente como plática con un asesor, no como cuestionario | `calificacion` |
| **Cotización y cierre** | Se manda el PDF o se pregunta "¿Te aparto la placa?" | Un resumen con voz da confianza para decidir; el PDF va igual como archivo | `cierre` |
| **Disculpa por demora** | Pasaron varias horas sin contestarle (como el cliente ".😗", que pidió el catálogo tres veces) | Una disculpa en voz se siente sincera | `disculpa` |

### Paso 4. Momentos de texto (aunque al lead le toque audio)
| Momento | Señales | Motivo |
|---|---|---|
| **Modo PRISA** | Pide precio, medidas o envío, escribe corto, repite la pregunta | `prisa` |
| **Contenido para leer** | Catálogo, lista de modelos con fotos, cuentas, Mercado Pago, dirección o mapa (un audio no se puede guardar ni reenviar) | `para-leer` |
| **Profesional que pide datos técnicos** | Arquitecto, constructor o carpintero que pide fichas, espesores o especificaciones para reenviar a su cliente | `tecnico` |
| **Audio anterior sin respuesta** | Ya mandamos un audio y no contestó: no mandes dos audios seguidos sin respuesta | `audio-sin-respuesta` |
| **Primer mensaje** | Es la primera respuesta a "Quiero más información": todavía no sabemos cómo se comunica | `primer-mensaje` |

Si el mensaje tiene una parte para leer y otra para platicar (por ejemplo, catálogo y una pregunta de urgencia), manda **el texto con los enlaces y un audio corto** con la parte de plática; motivo del audio según el paso 3.

### Paso 5. Zona gris → prueba A/B
Si no aplica ninguna regla de los pasos 2 a 4, decide con el **penúltimo dígito** del WhatsApp del cliente, o de su ID de Instagram o Facebook (`attrs.ig_id`) si no hay WhatsApp. Par → texto, impar → audio. Motivo `ab`. Es independiente de la prueba de precio, que usa el último dígito. Esta parte al azar es la que nos dice si el audio, por sí solo, hace que el cliente conteste más.

### Límites siempre
- **Máximo un audio por turno**, de ≈40 s. Lo que hay que leer va en texto junto al audio.
- **El contenido no cambia** entre audio y texto: mismos datos y misma pregunta de cierre.
- Si con un lead ya van 2 audios sin respuesta, vuelve a texto hasta que conteste.

### Ejemplo (cliente ".😗", WhatsApp, 23 de octubre de 2026)
1. "Quiero más información" + "¿Me envías tu catálogo?" → **texto** (`primer-mensaje` y `para-leer`): el enlace del catálogo y "¿Para qué lo quieres?".
2. "Para cubierta en cocina" → zona gris → **audio** por dígito (penúltimo 3, impar; motivo `ab`).
3. "No" + "Por eso quiero el catálogo" (llevaba 8 min sin respuesta) → **texto** con el catálogo (`para-leer`) + **audio corto** con la disculpa y la oferta de muestras (`disculpa`).
4. Si no contesta en 2–3 h → **audio** de seguimiento (`seguimiento`): "¿Pudiste ver el catálogo? Si quieres te hago una selección para tu cocina".

## Registro en ParrotCRM (con aprobación del usuario)
- En la nota, una línea `🎙️ Formato: audio (enfriandose)` (o `texto (para-leer)`, `audio (ab)`, etc.) y en `Adjuntar:` el nombre del archivo de audio.
- `update_lead` con `attrs.abFormato`: la variante por dígito del lead (`texto` o `audio`), aunque una regla la haya cambiado, y `attrs.formatoMotivo`: el motivo del último mensaje enviado.

## Qué medir
Cuando el usuario pida el reporte, busca en ParrotCRM las notas con `🎙️ Formato` y la respuesta del cliente al mensaje siguiente, y arma dos tablas:
1. **Por motivo** (`enfriandose`, `seguimiento`, `objecion`, `cierre`…): % de respuesta en 24 h con audio, comparado con los mismos momentos de leads que se quedaron en texto. Dice **en qué momentos el audio sí ayuda** y en cuáles no: ajusta las reglas de los pasos 3 y 4 con eso.
2. **Zona gris (`ab`)**: audio vs. texto por dígito. Respuesta en 24 h, % que llega a cotización, ventas y venta por lead. Necesita **al menos 20 leads por variante**.

Cruza con `abPrecio` solo si hay suficientes leads en cada combinación.
