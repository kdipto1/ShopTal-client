"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-ui/table";
import { Button } from "@/components/shadcn-ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shadcn-ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Loader2,
  PackageCheck,
  Percent,
  Receipt,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  getDashboardAnalyticsAPI,
  AnalyticsRange,
  DashboardAnalytics,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const RANGE_OPTIONS: { value: AnalyticsRange; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "hsl(38 92% 50%)",
  PROCESSING: "hsl(217 91% 60%)",
  SHIPPED: "hsl(262 83% 58%)",
  DELIVERED: "hsl(142 71% 45%)",
  CANCELED: "hsl(0 84% 60%)",
};

const CATEGORY_PALETTE = [
  "hsl(217 91% 60%)",
  "hsl(142 71% 45%)",
  "hsl(262 83% 58%)",
  "hsl(38 92% 50%)",
  "hsl(199 89% 48%)",
  "hsl(330 81% 60%)",
  "hsl(24 95% 53%)",
  "hsl(173 80% 40%)",
];

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 1000 ? 0 : 2,
  }).format(n || 0);

const compact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact" }).format(n || 0);

const formatDateLabel = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_BADGE: Record<string, string> = {
  PENDING:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  PROCESSING:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  SHIPPED:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  DELIVERED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  CANCELED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export default function AnalyticsDashboard() {
  const { data: session, status } = useSession();
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (accessToken: string, isRefresh = false) => {
      try {
        if (isRefresh) setIsRefreshing(true);
        else setIsLoading(true);
        setError(null);
        const res = await getDashboardAnalyticsAPI(range, accessToken);
        setData(res.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load analytics data",
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [range],
  );

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      fetchData(session.user.accessToken as string);
    } else if (status === "unauthenticated") {
      setIsLoading(false);
      setError("Authentication required to load analytics data.");
    }
  }, [session, status, fetchData]);

  const kpiCards = useMemo(() => {
    if (!data) return null;
    const k = data.kpis;
    return [
      {
        title: "Revenue",
        value: currency(k.totalRevenue),
        delta: k.revenueDelta,
        icon: DollarSign,
        gradient:
          "from-emerald-50/80 to-white dark:from-emerald-950/40 dark:to-gray-900/80",
        iconColor: "text-emerald-600 dark:text-emerald-400",
      },
      {
        title: "Orders",
        value: compact(k.totalOrders),
        delta: k.ordersDelta,
        icon: Receipt,
        gradient:
          "from-blue-50/80 to-white dark:from-blue-950/40 dark:to-gray-900/80",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      {
        title: "Customers",
        value: compact(k.totalCustomers),
        icon: Users,
        gradient:
          "from-violet-50/80 to-white dark:from-violet-950/40 dark:to-gray-900/80",
        iconColor: "text-violet-600 dark:text-violet-400",
      },
      {
        title: "Avg. Order Value",
        value: currency(k.averageOrderValue),
        icon: ShoppingCart,
        gradient:
          "from-amber-50/80 to-white dark:from-amber-950/40 dark:to-gray-900/80",
        iconColor: "text-amber-600 dark:text-amber-400",
      },
      {
        title: "Cart Abandonment",
        value: `${k.cartAbandonmentRate.toFixed(1)}%`,
        icon: Percent,
        gradient:
          "from-rose-50/80 to-white dark:from-rose-950/40 dark:to-gray-900/80",
        iconColor: "text-rose-600 dark:text-rose-400",
        invertDelta: true,
      },
    ];
  }, [data]);

  const revenueChartData = useMemo(
    () =>
      data?.revenueTimeseries.map((p) => ({
        date: formatDateLabel(p.date),
        Revenue: Number(p.revenue.toFixed(2)),
        Orders: p.orderCount,
      })) ?? [],
    [data],
  );

  const orderStatusData = useMemo(
    () =>
      data?.orderStatusBreakdown
        .filter((s) => s.count > 0)
        .map((s) => ({
          name: s.status,
          value: s.count,
          fill: STATUS_COLORS[s.status] ?? "hsl(var(--muted))",
        })) ?? [],
    [data],
  );

  const totalStatusCount = useMemo(
    () => orderStatusData.reduce((sum, s) => sum + s.value, 0),
    [orderStatusData],
  );

  const salesByCategoryData = useMemo(
    () =>
      data?.salesByCategory.map((c, i) => ({
        name: c.categoryName,
        value: Number(c.revenue.toFixed(2)),
        fill: CATEGORY_PALETTE[i % CATEGORY_PALETTE.length],
      })) ?? [],
    [data],
  );

  const revenueChartConfig = {
    Revenue: { label: "Revenue", color: "hsl(142 71% 45%)" },
    Orders: { label: "Orders", color: "hsl(217 91% 60%)" },
  };

  if (status === "loading" || (isLoading && !data)) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-2 sm:px-4 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {data
                ? `Updated ${formatDateTime(data.generatedAt)}`
                : "Key metrics at a glance"}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-0.5">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRange(opt.value)}
                  disabled={isRefreshing}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded transition-colors disabled:opacity-50",
                    range === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                session?.user?.accessToken &&
                fetchData(session.user.accessToken as string, true)
              }
              disabled={isRefreshing}
              className="h-8 w-8"
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
            </Button>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-6" />

        {error ? (
          <div className="rounded-md bg-red-50 dark:bg-red-900/10 p-4 text-center text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {kpiCards?.map((card, i) => (
                <KpiCard key={i} {...card} />
              ))}
            </div>

            {/* Low stock alert */}
            {data && data.kpis.lowStockCount > 0 && (
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 p-3 sm:p-4">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="font-medium text-amber-900 dark:text-amber-200">
                    {data.kpis.lowStockCount} product
                    {data.kpis.lowStockCount === 1 ? "" : "s"} low on stock
                  </p>
                  <p className="text-amber-700/80 dark:text-amber-300/80">
                    Items with fewer than 5 units in inventory. Restock soon.
                  </p>
                </div>
              </div>
            )}

            {/* Revenue trend (hero chart) */}
            <Card className="border border-gray-100 dark:border-gray-800 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">
                  Revenue Trend
                </CardTitle>
                <CardDescription className="text-xs">
                  Daily revenue and order count over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isRefreshing && !data ? (
                  <Skeleton className="h-[280px] w-full rounded-md" />
                ) : revenueChartData.length === 0 ? (
                  <EmptyState message="No sales in this period yet." />
                ) : (
                  <ChartContainer
                    config={revenueChartConfig}
                    className="h-[280px] w-full"
                  >
                    <AreaChart
                      data={revenueChartData}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="revenueGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="hsl(142 71% 45%)"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(142 71% 45%)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        vertical={false}
                        stroke="#f3f4f6"
                        strokeDasharray="2 2"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "#888" }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                        minTickGap={20}
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 11, fill: "#888" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `$${compact(v)}`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 11, fill: "#888" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => {
                              if (name === "Revenue")
                                return [
                                  currency(Number(value)),
                                  "Revenue",
                                ];
                              return [String(value), "Orders"];
                            }}
                          />
                        }
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="Revenue"
                        stroke="hsl(142 71% 45%)"
                        strokeWidth={2}
                        fill="url(#revenueGradient)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="Orders"
                        stroke="hsl(217 91% 60%)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Two-up: Order status donut + Sales by category pie */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border border-gray-100 dark:border-gray-800 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg">
                    Order Status
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Distribution of orders by status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orderStatusData.length === 0 ? (
                    <EmptyState message="No orders yet." />
                  ) : (
                    <ChartContainer
                      config={{
                        PENDING: { label: "Pending", color: STATUS_COLORS.PENDING },
                        PROCESSING: {
                          label: "Processing",
                          color: STATUS_COLORS.PROCESSING,
                        },
                        SHIPPED: { label: "Shipped", color: STATUS_COLORS.SHIPPED },
                        DELIVERED: {
                          label: "Delivered",
                          color: STATUS_COLORS.DELIVERED,
                        },
                        CANCELED: {
                          label: "Canceled",
                          color: STATUS_COLORS.CANCELED,
                        },
                      }}
                      className="h-[260px] w-full"
                    >
                      <PieChart>
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value, name) => [
                                `${value} (${(
                                  (Number(value) / totalStatusCount) *
                                  100
                                ).toFixed(1)}%)`,
                                String(name),
                              ]}
                            />
                          }
                        />
                        <Pie
                          data={orderStatusData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={2}
                          strokeWidth={2}
                        >
                          {orderStatusData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          wrapperStyle={{ fontSize: 12 }}
                        />
                      </PieChart>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-gray-100 dark:border-gray-800 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg">
                    Sales by Category
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Revenue contribution per category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {salesByCategoryData.length === 0 ? (
                    <EmptyState message="No category sales yet." />
                  ) : (
                    <ChartContainer
                      config={{}}
                      className="h-[260px] w-full"
                    >
                      <PieChart>
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value) => currency(Number(value))}
                            />
                          }
                        />
                        <Pie
                          data={salesByCategoryData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={2}
                          strokeWidth={2}
                        >
                          {salesByCategoryData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          wrapperStyle={{ fontSize: 12 }}
                        />
                      </PieChart>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top products + Recent orders */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Card className="border border-gray-100 dark:border-gray-800 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <PackageCheck className="h-4 w-4" /> Top Selling Products
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Best performers by units sold
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.topSellingProducts.length === 0 ? (
                    <EmptyState message="No product sales yet." />
                  ) : (
                    <div className="space-y-3">
                      {data?.topSellingProducts.map((p, i) => {
                        const maxUnits =
                          data.topSellingProducts[0]?.unitsSold || 1;
                        const pct = (p.unitsSold / maxUnits) * 100;
                        return (
                          <div key={p.id} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                              <span className="truncate flex items-center gap-2 min-w-0">
                                <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">
                                  {i + 1}
                                </span>
                                <span className="truncate font-medium text-gray-900 dark:text-gray-100">
                                  {p.name}
                                </span>
                              </span>
                              <span className="shrink-0 text-gray-500 dark:text-gray-400 text-xs">
                                {p.unitsSold} sold · {currency(p.revenue)}
                              </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-gray-100 dark:border-gray-800 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg">
                    Recent Orders
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Latest 5 orders
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {data?.recentOrders.length === 0 ? (
                    <div className="p-6">
                      <EmptyState message="No orders yet." />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Order</TableHead>
                          <TableHead className="text-xs">Customer</TableHead>
                          <TableHead className="text-xs text-right">
                            Total
                          </TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.recentOrders.map((o) => (
                          <TableRow key={o.id}>
                            <TableCell className="text-xs font-mono text-gray-500 dark:text-gray-400">
                              {o.id.slice(0, 8)}
                            </TableCell>
                            <TableCell className="text-xs">
                              <div className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[160px]">
                                {o.customer.name}
                              </div>
                              <div className="text-[10px] text-gray-500 truncate max-w-[160px]">
                                {formatDateTime(o.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-right font-semibold">
                              {currency(o.totalAmount)}
                            </TableCell>
                            <TableCell>
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                  STATUS_BADGE[o.status] ??
                                    "bg-gray-100 text-gray-700",
                                )}
                              >
                                {o.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface KpiCardProps {
  title: string;
  value: string;
  delta?: number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconColor: string;
  invertDelta?: boolean;
}

function KpiCard({
  title,
  value,
  delta,
  icon: Icon,
  gradient,
  iconColor,
  invertDelta,
}: KpiCardProps) {
  const hasDelta = typeof delta === "number" && delta !== 0;
  const isPositive = (delta ?? 0) > 0;
  const goodDirection = invertDelta ? !isPositive : isPositive;
  const DeltaIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  return (
    <Card
      className={cn(
        "border border-gray-100 dark:border-gray-800 shadow-none hover:shadow-md transition-shadow rounded-lg bg-gradient-to-tr",
        gradient,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-5 pt-3 sm:pt-5">
        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </CardTitle>
        <div className="p-1.5 rounded-md bg-white/70 dark:bg-gray-900/60">
          <Icon className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", iconColor)} />
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-5 pb-3 sm:pb-5">
        <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        {hasDelta ? (
          <div
            className={cn(
              "mt-1 flex items-center gap-1 text-[10px] sm:text-xs",
              goodDirection
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400",
            )}
          >
            <DeltaIcon className="h-3 w-3" />
            <span className="font-semibold">{Math.abs(delta as number)}%</span>
            <span className="text-gray-500 dark:text-gray-400">vs prev</span>
          </div>
        ) : (
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
            vs previous period
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="h-[200px] flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
      {message}
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-2 sm:px-4 py-6 space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="h-px bg-gray-200 dark:bg-gray-800" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[320px] w-full rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
        <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading dashboard...
        </div>
      </div>
    </div>
  );
}
