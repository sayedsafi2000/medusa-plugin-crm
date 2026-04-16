# Adding the CRM Plugin to your Medusa configuration

To use the CRM plugin in a Medusa project, you need to add it to the `plugins` array in your `medusa-config.ts` (or `medusa-config.js`).

```ts
import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  // ...other config options
  plugins: [
    // ...other plugins
    "@sayedsafi2000/medusa-plugin-crm",
  ],
})
```

If you are developing the plugin locally, you can reference it via a relative path instead of the npm package name:

```ts
export default defineConfig({
  plugins: [
    "../medusa-plugin-crm",
  ],
})
```

Make sure to run `npm install` (or `yarn`) after adding the plugin, then restart your Medusa server.
