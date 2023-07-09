/**
 * This function returns executable script as string by removing container string.
 * @param {string} scriptContainerString This argument is string that contains executable script.
 * @return {string} Return value is executable script as string.
 */
export function extractScriptAsString(scriptContainerString: string): string {
  return scriptContainerString.replace(/^.+?\{/s, '').replace(/\};?$/s, '');
}

/**
 * This function deletes namespaces that are attached on bundling.
 * @param {string} scriptString This argument is executable script.
 * @return {string} Return value is script that does not have namespace.
 */
export function deleteNamespace(scriptString: string): string {
  return scriptString
    .replace(/(.*= new) .*GraphicEqualizer/g, '$1 GraphicEqualizer')
    .replace(/(.*?)_.*\.FREQUENCIES(.*)/g, '$1FREQUENCIES$2')
    .replace(/(.*?)_.*\.PRESETS(.*)/g, '$1PRESETS$2')
    .replace(/(.*= new) .*Knob/g, '$1 Knob');
}
