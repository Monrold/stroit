import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://stroitsurfaces.com", // URL base de tu sitio
  base: "/", // Raíz del dominio
  integrations: [tailwind()]
});
