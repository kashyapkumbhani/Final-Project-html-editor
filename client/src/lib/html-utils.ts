export function parseHtml(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

export function getXPath(element: HTMLElement): string {
  if (!element.parentNode) return '';
  
  let siblings = element.parentNode.childNodes;
  let count = 1;
  let index = 0;
  
  for (let i = 0; i < siblings.length; i++) {
    let sibling = siblings[i];
    if (sibling === element) {
      index = count;
      break;
    }
    if (sibling.nodeType === 1 && sibling.nodeName === element.nodeName) {
      count++;
    }
  }
  
  return getXPath(element.parentElement as HTMLElement) + '/' + element.tagName.toLowerCase() + '[' + index + ']';
}

export function evaluateXPath(document: Document, xpath: string): HTMLElement | null {
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  
  return result.singleNodeValue as HTMLElement;
}

export function updateHtml(html: string, element: HTMLElement): string {
  const doc = parseHtml(html);
  doc.body.appendChild(element.cloneNode(true));
  return doc.documentElement.outerHTML;
}
