/**
 * Initiates the real APK download from the server directly to the user's Android phone or browser.
 */
export function triggerApkDownload() {
  const downloadUrl = '/api/download/zafoot.apk';
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = 'ZaFoot.apk';
  anchor.setAttribute('target', '_blank');
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
