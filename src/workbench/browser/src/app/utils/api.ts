/**
 * get rest param from url,format like {restName}
 *
 * @param url
 * @returns
 */
export const getRest: (url: string) => string[] = (url) => [...url.replace(/{{(.*?)}}/g, '').matchAll(/{(.*?)}/g)].map((val) => val[1]);
