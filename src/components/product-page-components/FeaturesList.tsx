"use client";

import { useState, useEffect } from "react";
export const FeaturesList = ({ product }: { product: any }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-semibold mb-2">Description:</h3>
      {/* <ul className="list-disc list-inside space-y-1">
      {features.map((feature, index) => (
        <li key={index}>
          <span className="font-medium">{feature.name}:</span> {feature.value}
        </li>
      ))}
    </ul> */}
      <pre className="whitespace-pre-wrap mt-2 font-sans">
        {isClient ? product.description : ""}
      </pre>
    </div>
  );
};
