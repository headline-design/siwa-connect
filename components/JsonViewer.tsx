import { useJsonViewer } from "@/hooks/useJsonViewer";
import { formatValue, getDataType, getObjectSize } from "@/utils/jsonUtils";
import React, { useState } from "react";

interface JSONViewerProps {
  initialJson?: string;
}

const JSONViewer: React.FC<JSONViewerProps> = ({ initialJson = "{}" }) => {
  const {
    jsonInput,
    setJsonInput,
    parsedJson,
    expandedPaths,
    toggleExpand,
    isExpanded,
    searchTerm,
    setSearchTerm,
  } = useJsonViewer(initialJson);

  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const renderJsonNode = (
    node: any,
    path: string = "$",
    depth: number = 0
  ): React.ReactNode => {
    const dataType = getDataType(node);

    if (dataType === "array" || dataType === "object") {
      const isExp = isExpanded(path);
      const size = getObjectSize(node);

      return (
        <div className={`${depth > 0 ? "ml-4" : ""}`}>
          <span
            className="cursor-pointer select-none hover:bg-gray-100 px-1 rounded inline-block"
            onClick={() => toggleExpand(path)}
          >
            {isExp ? "▼" : "▶"} {dataType === "array" ? "[" : "{"} {size}{" "}
            {size === 1 ? "item" : "items"}
          </span>
          {isExp && (
            <div>
              {Object.entries(node).map(([key, value], index) => (
                <div key={key} className="flex flex-wrap items-start">
                  <span
                    className="text-blue-600 mr-2 cursor-pointer hover:underline"
                    onClick={() => handleCopyPath(`${path}.${key}`)}
                    title="Click to copy path"
                  >
                    {formatValue(key)}:
                  </span>
                  {renderJsonNode(value, `${path}.${key}`, depth + 1)}
                  {index < Object.entries(node).length - 1 && ","}
                </div>
              ))}
            </div>
          )}
          <span>
            {dataType === "array" ? "]" : "}"}
            {!isExp && " ..."}
          </span>
        </div>
      );
    }

    if (dataType === "error") {
      return (
        <div className="text-red-600">
          <strong>Error:</strong> {node.message}
          {node.stack && (
            <pre className="mt-2 text-xs whitespace-pre-wrap">{node.stack}</pre>
          )}
        </div>
      );
    }

    return (
      <span
        className={`${
          dataType === "string"
            ? "text-green-600"
            : dataType === "number"
            ? "text-purple-600"
            : dataType === "boolean"
            ? "text-red-600"
            : "text-gray-600"
        } break-all`}
      >
        {formatValue(node)}
      </span>
    );
  };

  const filteredJson = (json: any, term: string): any => {
    if (!term) return json;
    if (typeof json !== "object" || json === null) return json;

    const result: any = Array.isArray(json) ? [] : {};

    Object.entries(json).forEach(([key, value]) => {
      if (
        key.toLowerCase().includes(term.toLowerCase()) ||
        JSON.stringify(value).toLowerCase().includes(term.toLowerCase())
      ) {
        result[key] =
          typeof value === "object" && value !== null
            ? filteredJson(value, term)
            : value;
      }
    });

    return Object.keys(result).length ? result : undefined;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white shadow-sm rounded-lg">
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={5}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Paste your JSON here"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search JSON"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {parsedJson ? (
        <div className="font-mono text-sm overflow-x-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {renderJsonNode(filteredJson(parsedJson, searchTerm))}
        </div>
      ) : (
        <div className="text-red-600">Invalid JSON</div>
      )}
      {copiedPath && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300">
          Copied: {copiedPath}
        </div>
      )}
    </div>
  );
};

export default JSONViewer;
