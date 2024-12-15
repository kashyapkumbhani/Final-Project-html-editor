export function parseHtml(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

export function getXPath(element: HTMLElement): string {
  if (!element || !element.parentElement) {
    return element.tagName.toLowerCase();
  }
  
  const parent = element.parentElement;
  const siblings = Array.from(parent.children).filter(
    child => child.tagName === element.tagName
  );
  
  const index = siblings.indexOf(element) + 1;
  
  const parentPath = parent.tagName === 'BODY' 
    ? '/html/body'
    : getXPath(parent);
    
  return `${parentPath}/${element.tagName.toLowerCase()}[${index}]`;
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

export function updateHtml(html: string, updatedElement: HTMLElement): string {
  const doc = parseHtml(html);
  const existingElement = doc.querySelector(`[data-element-id="${updatedElement.getAttribute('data-element-id')}"]`);
  
  if (existingElement) {
    existingElement.replaceWith(updatedElement.cloneNode(true));
  } else {
    doc.body.appendChild(updatedElement.cloneNode(true));
  }
  
  return doc.documentElement.outerHTML;
}
