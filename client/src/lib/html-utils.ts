export function parseHtml(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

export function updateHtml(html: string, element: HTMLElement): string {
  const doc = parseHtml(html);
  doc.body.appendChild(element.cloneNode(true));
  return doc.documentElement.outerHTML;
}
