/**
 * Dev Test Tools module contract v1.
 *
 * The hub (agent bc-14b90a7f, Dev Test Tools) loads tools/dev/registry.js
 * and calls createModule() on each entry. This file is the agreement.
 * Spinners do not add links on index.html, world.html, jr.html, or adventure.html.
 *
 *   const { ZD_DEV_MODULES } = await import('./registry.js');
 *   const { showModule } = await import('./hub.js');
 *
 * createModule() returns:
 *   {
 *     id: string,
 *     title: string,
 *     mount(container, ctx): Promise<void>,
 *     unmount(): void,
 *     save(): object,
 *     load(settings): void,
 *   }
 *
 * ctx: { onSave(), signal }
 * save() is plain JSON. The hub stores it. unmount() is safe to call twice.
 * A throw from import or mount is caught by showModule. One bad module
 * leaves the other tabs working.
 */
export const ZD_DEV_CONTRACT = 1;

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
