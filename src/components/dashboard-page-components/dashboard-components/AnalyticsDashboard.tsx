"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shadcn-ui/card";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import {
  Users,
  ShoppingBag,
  Tags,
  Layers,
  Award,
  TrendingUp,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shadcn-ui/chart";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface AnalyticsData {
  userCounts: number;
  productCounts: number;
  categoryCounts: number;
  subcategoryCounts: number;
  brandCounts: number;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  const { data: session, status } = useSession();

  useEffect(() => {
    // Check screen size and update screenWidth state
    const checkScreenSize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    const fetchData = async (accessToken: string) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analytics/counts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        setError("Failed to load analytics data");
        console.error("Error fetching analytics data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.accessTokensToken) {
      fetchData(session.user.accessToken as string);
    } else if (status === "unauthenticated") {
      setIsLoading(false);
      setError("Authentication required to load analytics data.");
    }

    // Cleanup event listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [session, status]);

  const cards = [
    {
      title: "Total Users",
      value: data?.userCounts,
      icon: Users,
      description: "Active users in the platform",
      color: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Total Products",
      value: data?.productCounts,
      icon: ShoppingBag,
      description: "Products listed in store",
      color: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Categories",
      value: data?.categoryCounts,
      icon: Tags,
      description: "Main product categories",
      color: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Subcategories",
      value: data?.subcategoryCounts,
      icon: Layers,
      description: "Product subcategories",
      color: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Brands",
      value: data?.brandCounts,
      icon: Award,
      description: "Registered brands",
      color: "bg-pink-50 dark:bg-pink-950",
    },
  ];

  const chartData = data
    ? [
        { name: "Users", value: data.userCounts },
        { name: "Products", value: data.productCounts },
        { name: "Categories", value: data.categoryCounts },
        { name: "Subcategories", value: data.subcategoryCounts },
        { name: "Brands", value: data.brandCounts },
      ]
    : [];

  // Determine chart configuration based on screen width
  const getChartHeight = () => {
    if (screenWidth < 640) {
      return "h-[250px]";
    } else if (screenWidth < 1024) {
      return "h-[300px]";
    } else {
      return "h-[350px]";
    }
  };

  const chartHeightClass = getChartHeight();
  // Determine chart configuration based on screen width
  const getChartConfig = () => {
    if (screenWidth < 640) {
      // Mobile
      return {
        height: 250,
        margin: { top: 10, right: 10, left: 10, bottom: 40 },
        xAxisAngle: -90,
        xAxisHeight: 40,
        xAxisFontSize: 8,
        yAxisFontSize: 8,
      };
    } else if (screenWidth < 1024) {
      // Tablet
      return {
        height: 300,
        margin: { top: 20, right: 20, left: 20, bottom: 60 },
        xAxisAngle: -45,
        xAxisHeight: 60,
        xAxisFontSize: 10,
        yAxisFontSize: 10,
      };
    } else {
      // Desktop
      return {
        height: 350,
        margin: { top: 20, right: 30, left: 20, bottom: 60 },
        xAxisAngle: -45,
        xAxisHeight: 60,
        xAxisFontSize: 12,
        yAxisFontSize: 12,
      };
    }
  };

  const chartConfig = getChartConfig();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Overview of key metrics and performance indicators
            </p>
          </div>
          <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>

        {error ? (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-center text-red-600 dark:text-red-400">
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
              {cards.map((card, index) => (
                <Card
                  key={index}
                  className={`transition-all duration-300 hover:shadow-lg ${card.color}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <div
                      className={`p-1 sm:p-2 rounded-full bg-white/80 dark:bg-gray-800/80`}
                    >
                      <card.icon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-6 sm:h-8 w-16 sm:w-20" />
                    ) : (
                      <>
                        <div className="text-xl sm:text-2xl font-bold">
                          {card.value?.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {card.description}
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl md:text-2xl">
                  Analytics Overview
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Comparative view of all metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <Skeleton className={`${chartHeightClass} w-full`} />
                ) : (
                  <ChartContainer
                    config={{
                      value: {
                        label: "Count",
                      },
                    }}
                    className={`${chartHeightClass} w-full md:w-1/2`}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={chartConfig.margin}>
                        <CartesianGrid
                          vertical={false}
                          stroke="#f3f4f6"
                          strokeDasharray="3 3"
                        />
                        <XAxis
                          dataKey="name"
                          angle={chartConfig.xAxisAngle}
                          textAnchor="end"
                          height={chartConfig.xAxisHeight}
                          interval={0}
                          tick={{
                            fontSize: chartConfig.xAxisFontSize,
                            fill: "currentColor",
                            opacity: 0.7,
                          }}
                          strokeOpacity={0.5}
                        />
                        <YAxis
                          stroke="currentColor"
                          strokeOpacity={0.5}
                          tick={{
                            fontSize: chartConfig.yAxisFontSize,
                            fill: "currentColor",
                            opacity: 0.7,
                          }}
                        />
                        <Bar
                          dataKey="value"
                          radius={[4, 4, 0, 0]}
                          fill="var(--primary)"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
