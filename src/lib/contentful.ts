import contentful, { EntryFieldTypes } from "contentful";


export interface Surfaces {
  contentTypeId: "stroit",
  fields: {
    nombre: EntryFieldTypes.Text,
    marca: EntryFieldTypes.Text,
    coleccion: EntryFieldTypes.Text,
    espesores: EntryFieldTypes.Text,
    acabados: EntryFieldTypes.Text,
    tonos: EntryFieldTypes.Text,
    medidas: EntryFieldTypes.Text,
    estilo: EntryFieldTypes.Text,
    imagen: EntryFieldTypes.AssetLink,
    promocion: EntryFieldTypes.Boolean,
    price: EntryFieldTypes.Text,
    pricePromo: EntryFieldTypes.Text,
    restriccionPromo: EntryFieldTypes.Text,
    restriccionPrecio: EntryFieldTypes.Text,
    precio4mm: EntryFieldTypes.Number,
    precio8Mm: EntryFieldTypes.Number,
    precio12Mm: EntryFieldTypes.Number,
    precio20Mm: EntryFieldTypes.Number,
    medidaSensa: EntryFieldTypes.Text,
  }
}

const deliveryToken = import.meta.env.CONTENTFUL_DELIVERY_TOKEN;

console.log("TEST CLOUDFLARE:", import.meta.env.TEST_CONTENTFUL);
console.log("Contentful Space:", !!import.meta.env.CONTENTFUL_SPACE_ID);
console.log("Contentful Delivery Token:", !!deliveryToken);

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : deliveryToken,
  host: import.meta.env.DEV
    ? "preview.contentful.com"
    : "cdn.contentful.com",
});