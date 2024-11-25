export function isObject(value: any): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  export function getDataType(value: any): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  export function formatValue(value: any): string {
    const type = getDataType(value);
    switch (type) {
      case 'string':
        return `"${value}"`;
      case 'null':
        return 'null';
      case 'undefined':
        return 'undefined';
      default:
        return String(value);
    }
  }

  export function getObjectSize(obj: object | any[]): number {
    return Array.isArray(obj) ? obj.length : Object.keys(obj).length;
  }
