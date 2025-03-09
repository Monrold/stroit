import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://stroitsurfaces.com", // URL base de tu sitio
  base: "/", // Raíz del dominio
  integrations: [tailwind(), react()]
});