export const filterXSS = (str: string): string =>
  str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const getUrlParam = (url: string, param: string): string | undefined => {
  const reg = new RegExp(`[?&#]${param}=([^&#]+)`, 'gi');
  const matches = url.match(reg);
  let strs;
  if (matches && matches.length > 0) {
    strs = matches[matches.length - 1].split('=');
    if (strs && strs.length > 0) {
      return filterXSS(strs[1]);
    }
    return;
  }
  return;
};

export const getHost = (url: string): string | undefined => url.match(/\/\/([^/]+)/)?.[1];

export const isHttpUrl = (url: string): boolean => /^(http[s]?:)?\/\//.test(url);

export const isSameDomain = (targetUrl: string, sourceHost: string = globalThis.location.host): boolean => {
  if (!isHttpUrl(targetUrl)) {
    return true;
  }
  return getHost(targetUrl) === sourceHost;
};
