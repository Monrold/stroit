# Prueba A/B: económicos vs. premium

Qué medimos: cuando recomendamos modelos a un lead que **todavía no ha elegido**, ¿qué convierte mejor?
- **A · Económicos**: los modelos más baratos en existencia (ver `modelos.md`).
- **B · Premium**: modelos más caros pero que lucen más (vetas, piedra, dorado).

**Solo cambia la selección de modelos** (cuáles y en qué rango de precio). Todo lo demás se queda igual en las dos variantes: la estructura del mensaje, la referencia por m², la aclaración de que se vende por placa completa, el envío gratis, la muestra gratis y la pregunta de cierre. Si cambias otra cosa, ya no sabremos qué funcionó.

## Cuándo aplica
- El primer mensaje en que le recomiendas modelos a un lead sin modelo elegido. Puede ser una respuesta en modo prisa o un recontacto, como el de "ya tiene catálogo y no ha elegido".
- **No aplica** si el cliente ya pidió algo concreto ("lo más barato", "algo de lujo", un modelo o estilo específico) o si dijo "está caro". En esos casos manda lo que pidió y marca la variante como `fuera`.

## Asignación (para que no sea a gusto del vendedor)
Usa el **último dígito del WhatsApp** del cliente:
- **Par** (0, 2, 4, 6, 8) → **A · Económicos**
- **Impar** (1, 3, 5, 7, 9) → **B · Premium**

La variante se asigna una vez por lead y se mantiene en los seguimientos. Si el vendedor ya mandó la otra variante, registra **la que realmente se envió**.

## Cómo elegir los modelos
- Toma los modelos **de un catálogo que el cliente tenga o que le vayas a mandar**, con el precio de ese catálogo (ver SKILL.md › Enviar modelos adecuados).
- **A**: los 3 más baratos en existencia que encajen con la aplicación. En octubre 2026, para piso Dekton mate: *Kovik*, *Eter* y *Danae*, a $21,048 por placa (≈ $4,400 a $4,600/m²). Para cubierta interior, Silestone desde $14,220 (*Lyra*, *Blanco Orion*).
- **B**: 3 modelos en existencia de $27,000 a $34,000 por placa (≈ $5,800 a $6,300/m²) con look llamativo, como *Sabbia*, *Kelya* o *Laurent* para piso. Adjunta sus fotos de `modelos.md`.
- En las dos variantes, el precio por m² es solo una referencia: **se vende por placa completa**.

## Ejemplo con el mismo lead (piso en León, octubre 2026)

> Ejemplo histórico: la variante A usaba el Flash Sale de septiembre, que **ya no aparece en las fotos de existencia de octubre**. Para leads nuevos, toma los modelos de `modelos.md`.

**A · Económicos** (Flash Sale septiembre):
> ¡Hola Roberto, buen día! 😊 Para que no tengas que revisar todo el catálogo: para piso, los mejores son los del *Flash Sale* que te mandé, son mate y los más económicos. Te recomiendo *Lyfe Lunar* (gris claro), *Strato* (gris oscuro) o *Crema Marfil* (crema).
> Se venden por placa completa (≈4.6 a 4.8 m² cada una); como referencia, te sale en ≈ $3,400 por m². Un piso de 20 m² lleva unas 5 placas y el envío a León es sin costo.
> Cuando midas, mándame largo x ancho y te paso el total exacto. ¿Te mando fotos de alguno ya instalado?

**B · Premium** (catálogo de promociones octubre):
> ¡Hola Roberto, buen día! 😊 Para que no tengas que revisar todo el catálogo: para piso, estos son los que más lucen, en acabado mate. Te recomiendo *Sabbia* (piedra clara tipo travertino), *Kelya* (oscuro con vetas claras) o *Laurent* (oscuro con vetas doradas).
> Se venden por placa completa (≈4.6 a 5.5 m² cada una); como referencia, te sale en ≈ $6,000 por m². Un piso de 20 m² lleva 4 o 5 placas y el envío a León es sin costo.
> Cuando midas, mándame largo x ancho y te paso el total exacto. ¿Te mando fotos de alguno ya instalado?

Precios de referencia, octubre 2026:

| Modelo | Placa | m² por placa | Precio por placa | ≈ precio por m² |
|---|---|---|---|---|
| Lyfe Lunar | 321 x 145 cm, 12 mm, mate | 4.65 | $15,833 | $3,400 |
| Strato | 320 x 144 cm, 20 mm, mate | 4.61 | $16,880 | $3,660 |
| Crema Marfil | 327 x 147 cm, 12 mm, mate | 4.81 | $16,351 | $3,400 |
| Sabbia | 322 x 144 cm, 12 mm, mate | 4.64 | $27,068 | $5,830 |
| Kelya | 325 x 147 cm, 12 mm, mate | 4.78 | $29,222 | $6,110 |
| Laurent | 332 x 166 cm, 12 mm, mate | 5.51 | $33,078 | $6,000 |

## Registro en ParrotCRM (indispensable para medir)
Al entregar el mensaje, indica la variante y, con aprobación del usuario:
- `update_lead` con `attrs.abPrecio`: `A-economicos`, `B-premium` o `fuera`.
- En la nota de seguimiento, agrega una línea `🧪 A/B precio: A-economicos` (o `B-premium`) para poder buscarla con `read_crm`.

## Qué medir y cuándo decidir
Por variante, contando desde el mensaje con la recomendación:
1. **Respuesta en 24 h** (cualquier respuesta del cliente).
2. **Avance**: manda medidas, elige un modelo, pide muestra o visita.
3. **Venta** y **monto de la venta** (en `sale`).

La métrica principal es la **venta por lead** (cuánto se vende en promedio por cada lead que recibió esa variante), no solo la tasa de respuesta: B puede responder menos y aun así vender más.

Revisa resultados cuando haya **al menos 20 leads por variante**. Con menos de eso, la diferencia puede ser suerte. Cuando el usuario pida el reporte, busca los leads con `abPrecio` en ParrotCRM y arma una tabla por variante con leads, % de respuesta, % de avance, ventas, monto y venta por lead.
