// Datos de cada sucursal. Se usan en el pie de página, las fichas de producto
// y los datos estructurados (LocalBusiness) que lee Google.
//
// IMPORTANTE: nombre, dirección y teléfono deben ser IDÉNTICOS a los del
// perfil de Google Business de cada sucursal.
// Los campos vacíos ("" o []) simplemente no se muestran en la web.

export interface Horario {
  /** Días en formato schema.org: "Monday", "Tuesday"... */
  dias: string[];
  /** Texto para mostrar: "Lunes a viernes" */
  etiqueta: string;
  abre: string; // "09:00"
  cierra: string; // "18:00"
}

export interface Sucursal {
  id: "pachuca" | "queretaro";
  nombre: string;
  /** Nombre corto para mostrar: "Pachuca", "Bajío (Querétaro)" */
  etiqueta: string;
  /** Página de la plaza en el sitio. */
  pagina: string;
  /** Estados y ciudades que atiende esta sucursal (datos estructurados). */
  areaServida: string[];
  ciudad: string;
  estado: string;
  calle: string;
  colonia: string;
  cp: string;
  /** Teléfono para mostrar, ej. "771 262 0413" */
  telefono: string;
  /** Teléfono en formato internacional para enlaces y Google, ej. "+527712620413" */
  telefonoE164: string;
  /** Número de WhatsApp sin "+" ni espacios, ej. "527713473810" */
  whatsapp: string;
  mapa: string;
  lat?: number;
  lng?: number;
  horarios: Horario[];
}

export const sucursales: Sucursal[] = [
  {
    id: "pachuca",
    nombre: "Stroit Surfaces Pachuca",
    etiqueta: "Pachuca",
    pagina: "/showroom/",
    areaServida: ["Hidalgo", "Pachuca de Soto", "Mineral de la Reforma", "Estado de México", "Ciudad de México"],
    ciudad: "Pachuca de Soto",
    estado: "Hidalgo",
    calle: "Boulevard Colonias 2503, letra K, Bodega 11",
    colonia: "Col. Santiago Tlapacoya",
    cp: "42110",
    telefono: "771 262 0413",
    telefonoE164: "+527712620413",
    whatsapp: "527713473810",
    mapa: "https://maps.app.goo.gl/uo1CnNAdzJ8jg7YA8",
    lat: 20.1080799,
    lng: -98.8167114,
    // Lunes a viernes según Google Business. TODO: confirmar sábado
    // (Google muestra "9:00 a 2:00 a. m.", probablemente 2:00 p. m.).
    horarios: [
      {
        dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        etiqueta: "Lunes a viernes",
        abre: "09:00",
        cierra: "18:00",
      },
    ],
  },
  {
    id: "queretaro",
    nombre: "Stroit Surfaces Bajío",
    etiqueta: "Bajío (Querétaro)",
    pagina: "/bajio/",
    areaServida: [
      "Querétaro",
      "Guanajuato",
      "Aguascalientes",
      "San Luis Potosí",
      "Santiago de Querétaro",
      "El Marqués",
      "Corregidora",
      "San Juan del Río",
      "León",
      "Celaya",
      "Irapuato",
      "San Miguel de Allende",
    ],
    ciudad: "Querétaro",
    estado: "Querétaro",
    // Dirección tal como aparece en Google Business (TerraPark Centenario).
    // TODO: agregar número exterior y nave/bodega si Google lo tiene.
    calle: "Paseo Centenario del Ejército Mexicano, TerraPark Centenario",
    colonia: "Parque Industrial Terra Park Centenario",
    cp: "76269",
    telefono: "442 269 0555",
    telefonoE164: "+524422690555",
    whatsapp: "524422690555",
    mapa: "https://maps.app.goo.gl/bWQVc9GkzbP1Fh6y7",
    lat: 20.6657243,
    lng: -100.2948123,
    // Martes a viernes 9:00–18:00 según Google; el lunes aparece mal
    // ("9:00 a 6:00 a. m."). Sábado y domingo cerrado.
    horarios: [
      {
        dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        etiqueta: "Lunes a viernes",
        abre: "09:00",
        cierra: "18:00",
      },
    ],
  },
];

export function direccionCompleta(s: Sucursal): string {
  return [s.calle, s.colonia, s.cp && `C.P. ${s.cp}`, s.ciudad, s.estado].filter(Boolean).join(", ");
}

/** Datos estructurados LocalBusiness de una sucursal (solo campos con valor). */
export function localBusinessSchema(s: Sucursal, sitio = "https://stroitsurfaces.com") {
  const schema: Record<string, unknown> = {
    "@type": "HomeAndConstructionBusiness",
    "@id": `${sitio}/#${s.id}`,
    name: s.nombre,
    url: `${sitio}${s.pagina}`,
    priceRange: "$$$",
    image: "https://cdn.stroitsurfaces.com/new-web-images/locations-mexio-showroom-2.jpg",
    brand: ["Dekton", "Silestone", "Sensa"].map((name) => ({ "@type": "Brand", name })),
    areaServed: s.areaServida.map((name) => ({ "@type": "AdministrativeArea", name })),
    hasMap: s.mapa,
  };
  if (s.calle) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: [s.calle, s.colonia].filter(Boolean).join(", "),
      addressLocality: s.ciudad,
      addressRegion: s.estado,
      postalCode: s.cp || undefined,
      addressCountry: "MX",
    };
  }
  if (s.telefonoE164) schema.telephone = s.telefonoE164;
  if (s.lat && s.lng) schema.geo = { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lng };
  if (s.horarios.length) {
    schema.openingHoursSpecification = s.horarios.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias,
      opens: h.abre,
      closes: h.cierra,
    }));
  }
  return schema;
}
