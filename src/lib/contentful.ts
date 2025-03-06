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
      price: EntryFieldTypes.Number,
    }
  }

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});