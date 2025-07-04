"use client";

import { useState, useEffect } from "react";
import { Info, ListChecks } from "lucide-react";

export const FeaturesList = ({ product }: { product: any }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hasFeatures =
    Array.isArray(product?.features) && product?.features.length > 0;

  return (
    <div className="bg-white rounded-lg border p-6 mt-8 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <ListChecks className="w-5 h-5 text-pink-600" />
        <h3 className="font-semibold text-lg">
          {hasFeatures ? "Key Features" : "Description"}
        </h3>
      </div>
      {hasFeatures ? (
        <ul className="list-disc list-inside space-y-2 ml-2">
          {product.features.map((feature: any, index: number) => (
            <li key={index} className="flex items-start gap-2">
              <span className="font-medium text-pink-600">
                {feature?.name}:
              </span>
              <span className="text-gray-700">{feature?.value}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-start gap-2 mt-2 text-gray-700">
          <Info className="w-4 h-4 mt-1 text-gray-400" />
          <span className="whitespace-pre-wrap font-sans leading-relaxed">
            {isClient ? product?.description : ""}
          </span>
        </div>
      )}
    </div>
  );
};
