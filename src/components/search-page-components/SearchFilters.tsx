import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Input } from "@/components/shadcn-ui/input";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Button } from "@/components/shadcn-ui/button";
import { Category, SearchParams } from "@/types";

interface SearchFiltersProps {
  categories: Category[];
  currentFilters: SearchParams;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories,
  currentFilters,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Filters</CardTitle>
    </CardHeader>
    <CardContent>
      <form action="/search" className="space-y-6">
        <div>
          <Input
            type="text"
            name="searchTerm"
            placeholder="Search products..."
            defaultValue={currentFilters.searchTerm}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Categories</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${cat.id}`}
                  name="category"
                  value={cat.id}
                  defaultChecked={currentFilters.category === cat.id}
                />
                <label
                  htmlFor={`category-${cat.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {cat.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Price Range</h3>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              name="minPrice"
              placeholder="Min"
              defaultValue={currentFilters.minPrice}
              className="w-24"
            />
            <span>to</span>
            <Input
              type="number"
              name="maxPrice"
              placeholder="Max"
              defaultValue={currentFilters.maxPrice}
              className="w-24"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Apply Filters
        </Button>
      </form>
    </CardContent>
  </Card>
);
