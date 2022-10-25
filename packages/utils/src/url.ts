export const filterXSS = (str: string) =>
  str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const getUrlParam = (param: string, url?: string) => {
  const u = url || location.href;
  const reg = new RegExp(`[?&#]${param}=([^&#]+)`, 'gi');

  const matches = u.match(reg);
  let strArr;
  if (matches && matches.length > 0) {
    strArr = matches[matches.length - 1].split('=');
    if (strArr && strArr.length > 1) {
      // 过滤XSS字符
      return filterXSS(strArr[1]);
    }
    return '';
  }
  return '';
};

export const getHost = (targetUrl: string) => targetUrl.match(/\/\/([^/]+)/)?.[1];

export const isSameDomain = (targetUrl = '', source = globalThis.location.host) => {
  const isHttpUrl = /^(http[s]?:)?\/\//.test(targetUrl);

  if (!isHttpUrl) return true;

  return getHost(targetUrl) === source;
};
