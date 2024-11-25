import { useState, useMemo } from 'react';

export function useJsonViewer(initialJson: string) {
  const [jsonInput, setJsonInput] = useState(initialJson);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const parsedJson = useMemo(() => {
    try {
      return JSON.parse(jsonInput);
    } catch (error: any) {
console.log('Error parsing JSON:', error);
      return null;
    }
  }, [jsonInput]);

  const toggleExpand = (path: string) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const isExpanded = (path: string) => expandedPaths.has(path);

  return {
    jsonInput,
    setJsonInput,
    parsedJson,
    expandedPaths,
    toggleExpand,
    isExpanded,
    searchTerm,
    setSearchTerm,
  };
}

