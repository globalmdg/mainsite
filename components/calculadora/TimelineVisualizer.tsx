import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Sector,
  LineChart,
  Line
} from "recharts";
import { ChevronDown, Calendar, BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { TimelineVisualizerProps } from "@/types/data";
import { formatCurrency, formatPercentage, groupByQuarter, groupByYear } from "@/lib/utils";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { ActiveShape } from "recharts/types/util/types";



export default function TimelineVisualizer({
  breakdown,
}: TimelineVisualizerProps) {
  const [view, setView] = useState<"monthly" | "yearly" | "quarterly">("yearly");
  const [chartType, setChartType] = useState<"area" | "bar" | "line" | "summary">("summary");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  // Initial animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimationProgress(prev => {
          const newValue = prev + 1;
          if (newValue >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newValue;
        });
      }, 20);

      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, []);


  // Format data based on selected view
  const getFormattedData = () => {
    switch (view) {
      case "monthly":
        return breakdown.map((entry) => ({
          name: `Mes ${entry.month}`,
          Principal: entry.principal,
          Intereses: entry.interest,
          "Capital pendiente": entry.remainingPrincipal,
          month: entry.month, // Keep original month for filtering
        }));
      case "quarterly":
        return groupByQuarter(breakdown);
      case "yearly":
      default:
        return groupByYear(breakdown);
    }
  };

  const formattedData = getFormattedData();

  // For better performance with large datasets
  const visibleData = formattedData.slice(0, Math.ceil((animationProgress / 100) * formattedData.length));

  // Calculate summary data - improved with more metrics
  const totalInterest = breakdown.reduce((sum, entry) => sum + entry.interest, 0);
  const totalPrincipal = breakdown.reduce((sum, entry) => sum + entry.principal, 0);
  const totalAmount = totalInterest + totalPrincipal;
  const loanYears = Math.ceil(breakdown.length / 12);
  const averageMonthlyPayment = totalAmount / breakdown.length;

  // Calculate principal/interest ratio per period
  const principalInterestRatioData = formattedData.map(item => ({
    name: item.name,
    ratio: item.Principal / (item.Principal + item.Intereses) * 100
  }));

  const summaryData = [
    { name: "Principal", value: totalPrincipal, color: "#4ade80" },
    { name: "Intereses", value: totalInterest, color: "#60a5fa" }
  ];

  // Enhanced milestones with better labels and calculation
  const milestones = [0.25, 0.5, 0.75, 1].map(percent => {
    const targetAmount = totalPrincipal * percent;
    let cumulativeAmount = 0;
    const milestone = {
      month: 0,
      percent: percent * 100,
      date: '',
      formattedDate: ''
    };

    for (let i = 0; i < breakdown.length; i++) {
      cumulativeAmount += breakdown[i].principal;
      if (cumulativeAmount >= targetAmount && milestone.month === 0) {
        milestone.month = i + 1;

        // Calculate approximate date based on start date (assuming today as start)
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);

        milestone.date = futureDate.toISOString();
        milestone.formattedDate = futureDate.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short'
        });
        break;
      }
    }

    return milestone;
  });

  // Improved tooltip for charts
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color?: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 dark:text-white">{label}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: { name: string; value: number; color?: string }, index: number) => (
              <div key={index} className="flex justify-between gap-4">
                <span className="text-sm font-medium" style={{ color: entry.color }}>
                  {entry.name}:
                </span>
                <span className="text-sm font-bold" style={{ color: entry.color }}>
                  {entry.name === "ratio"
                    ? `${entry.value.toFixed(1)}%`
                    : formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom pie chart active shape with improved visuals
  const renderActiveShape = ((props: PieSectorDataItem & { percent: number; value: number }) => {
    const { cx = 0, cy = 0, innerRadius, outerRadius = 0, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
      <g>
        <text x={cx} y={cy - 25} textAnchor="middle" fill="#888" className="text-lg font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#333" className="text-xl font-bold">
          {formatCurrency(value)}
        </text>
        <text x={cx} y={cy + 25} textAnchor="middle" fill="#666" className="text-md">
          {(percent * 100).toFixed(1)}%
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  }) as ActiveShape<PieSectorDataItem>;

  // Handle pie chart hover
  const onPieEnter = (_: { name: string; value: number; color?: string }, index: number) => {
    setActiveIndex(index);
  };

  // Function to render specific milestone tooltip
  const renderMilestoneTooltip = (index: number) => {
    if (showTooltip !== index) return null;

    const milestone = milestones[index];

    return (
      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 w-48">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {milestone.percent}% pagado en {Math.ceil(milestone.month / 12)} años y {milestone.month % 12} meses
        </p>
        {milestone.formattedDate && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Aprox. {milestone.formattedDate}
          </p>
        )}
      </div>
    );
  };

  // Chart type selection buttons with improved UX
  const ChartTypeButton = ({ type, icon, label }: { type: typeof chartType, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => setChartType(type)}
      className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-lg transition text-sm ${chartType === type
        ? "bg-blue-600 text-white"
        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <section className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Evolución de tu hipoteca
        </h2>
        <div className="flex flex-wrap gap-2">
          <ChartTypeButton
            type="area"
            icon={<TrendingUp size={16} />}
            label="Área"
          />
          <ChartTypeButton
            type="bar"
            icon={<BarChart3 size={16} />}
            label="Barras"
          />
          <ChartTypeButton
            type="line"
            icon={<TrendingUp size={16} />}
            label="Línea"
          />
          <ChartTypeButton
            type="summary"
            icon={<PieChartIcon size={16} />}
            label="Resumen"
          />

          {chartType !== "summary" && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm"
              >
                <Calendar size={16} />
                {view === "monthly" ? "Mensual" : view === "quarterly" ? "Trimestral" : "Anual"}
                <ChevronDown size={14} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 w-36">
                  <button
                    onClick={() => { setView("yearly"); setIsDropdownOpen(false); }}
                    className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg text-sm"
                  >
                    Anual
                  </button>
                  <button
                    onClick={() => { setView("quarterly"); setIsDropdownOpen(false); }}
                    className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    Trimestral
                  </button>
                  <button
                    onClick={() => { setView("monthly"); setIsDropdownOpen(false); }}
                    className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg text-sm"
                  >
                    Mensual
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Duración del préstamo</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{loanYears} años</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{breakdown.length} meses en total</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total a pagar</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalAmount)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">~{formatCurrency(averageMonthlyPayment)}/mes</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total intereses</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalInterest)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatPercentage(totalInterest / totalAmount * 100)} del total</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Relación interés/principal</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatPercentage(totalInterest / totalPrincipal * 100)}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${(totalInterest / totalAmount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Milestone Progress - Enhanced with tooltips and better visualization */}
      {chartType !== "summary" && breakdown.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Hitos de amortización</h3>

          {/* Progress bar with better visuals */}
          <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
              style={{
                width:
                  breakdown[0].remainingPrincipal > 0
                    ? `${Math.min(100, (
                      (breakdown[0].remainingPrincipal -
                        (breakdown[Math.floor((animationProgress / 100) * (breakdown.length - 1))]?.remainingPrincipal || 0)) /
                      breakdown[0].remainingPrincipal
                    ) * 100)}%`
                    : "0%",
              }}
            ></div>

            {/* Milestone markers */}
            {milestones.map((milestone, i) => milestone.month > 0 && (
              <div
                key={i}
                className="absolute top-0 h-full flex items-center justify-center"
                style={{
                  left: `${(milestone.month / breakdown.length) * 100}%`,
                  transform: 'translateX(-50%)',
                  zIndex: 2
                }}
              >
                <div
                  className="h-8 w-2 bg-gray-800 dark:bg-white opacity-70 rounded-full cursor-pointer"
                  onMouseEnter={() => setShowTooltip(i)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  {renderMilestoneTooltip(i)}
                </div>
              </div>
            ))}
          </div>

          {/* Milestones display - Improved layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {milestones.map((milestone, i) => (
              <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="font-semibold text-gray-600 dark:text-gray-300">{milestone.percent}% pagado</div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  {milestone.month > 0
                    ? `Mes ${milestone.month} (Año ${Math.ceil(milestone.month / 12)})`
                    : "Pendiente"}
                </div>
                {milestone.formattedDate && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    ~{milestone.formattedDate}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Chart Section - Improved with a progress indicator */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl">
        {chartType === "area" && (
          <ResponsiveContainer width="100%" height={500}>
            <AreaChart data={visibleData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorIntereses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={{ stroke: "#9ca3af" }}
                interval={view === "monthly" ? 5 : 0}
              />
              <YAxis
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={{ stroke: "#9ca3af" }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M €`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K €`;
                  return `${value} €`;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ paddingBottom: "20px" }}
              />
              <Area
                type="monotone"
                dataKey="Principal"
                stackId="1"
                stroke="#16a34a"
                fill="url(#colorPrincipal)"
                strokeWidth={2}
                animationDuration={1000}
              />
              <Area
                type="monotone"
                dataKey="Intereses"
                stackId="1"
                stroke="#2563eb"
                fill="url(#colorIntereses)"
                strokeWidth={2}
                animationDuration={1000}
              />
              <Area
                type="monotone"
                dataKey="Capital pendiente"
                stroke="#dc2626"
                fill="url(#colorCapital)"
                strokeWidth={2}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {chartType === "bar" && (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={visibleData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={{ stroke: "#9ca3af" }}
                interval={view === "monthly" ? 5 : 0}
              />
              <YAxis
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={{ stroke: "#9ca3af" }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M €`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K €`;
                  return `${value} €`;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ paddingBottom: "20px" }}
              />
              <Bar dataKey="Principal" name="Principal" fill="#4ade80" radius={[4, 4, 0, 0]} animationDuration={1000} />
              <Bar dataKey="Intereses" name="Intereses" fill="#60a5fa" radius={[4, 4, 0, 0]} animationDuration={1000} />
              <Bar dataKey="Capital pendiente" name="Capital pendiente" fill="#f87171" radius={[4, 4, 0, 0]} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === "line" && (
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={visibleData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={{ stroke: "#9ca3af" }}
                interval={view === "monthly" ? 5 : 0}
              />
              <YAxis
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={{ stroke: "#9ca3af" }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M €`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K €`;
                  return `${value} €`;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ paddingBottom: "20px" }}
              />
              <Line
                type="monotone"
                dataKey="Principal"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
              <Line
                type="monotone"
                dataKey="Intereses"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
              <Line
                type="monotone"
                dataKey="Capital pendiente"
                stroke="#dc2626"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === "summary" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-center text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Desglose total del préstamo
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={summaryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    animationDuration={1000}
                  >
                    {summaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Principal ({formatPercentage(totalPrincipal / totalAmount * 100)})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Intereses ({formatPercentage(totalInterest / totalAmount * 100)})</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="text-center text-lg font-semibold mb-6 text-gray-800 dark:text-white">
                Información del préstamo
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Total del préstamo:</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalPrincipal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Total de intereses:</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Coste total:</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalPrincipal + totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Duración:</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">{loanYears} años ({breakdown.length} meses)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Cuota mensual media:</span>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(averageMonthlyPayment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Amortizado:</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatPercentage(breakdown.reduce((sum, entry) => sum + entry.principal, 0) / totalPrincipal * 100)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional insights section */}
        {chartType === "summary" && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Evolución de la ratio principal/intereses
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={principalInterestRatioData.slice(0, Math.min(20, principalInterestRatioData.length))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280" }}
                    axisLine={{ stroke: "#9ca3af" }}
                    tickLine={{ stroke: "#9ca3af" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#6b7280" }}
                    axisLine={{ stroke: "#9ca3af" }}
                    tickLine={{ stroke: "#9ca3af" }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="ratio"
                    name="% Principal"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#8b5cf6" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              Este gráfico muestra cómo evoluciona el porcentaje del pago que va destinado a amortizar el préstamo en comparación con los intereses.
              Al inicio del préstamo, una mayor parte va a intereses, mientras que al final, la mayoría del pago reduce el capital.
            </p>
          </div>
        )}
      </div>

      {/* Bottom tip section */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Consejo financiero</h4>
        <p className="text-blue-700 dark:text-blue-400 text-sm">
          Realizar pagos adicionales al inicio del préstamo puede reducir significativamente los intereses totales.
          Un aumento de la cuota mensual o la realización de pagos extraordinarios puede acortar la duración de tu hipoteca.
        </p>
      </div>
    </section>
  );
}