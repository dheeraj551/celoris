import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Eye, 
  MessageSquare, 
  ShoppingBag, 
  ArrowUpRight, 
  Calendar,
  Sparkles,
  Layers,
  Filter
} from 'lucide-react';
import { INITIAL_ANALYTICS } from '../data/mockData';

export const AnalyticsDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | 'all'>('30d');
  const data = INITIAL_ANALYTICS;

  return (
    <div className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE6DF]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6239] mb-1">
            <span>Boutique Performance Studio</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Instagram Commerce</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#181716]">
            Engagement Trends & Revenue Growth
          </h2>
          <p className="text-xs sm:text-sm text-[#6B655B] mt-0.5">
            Holistic attribution linking Instagram Reels, direct styling messages, and shop conversions.
          </p>
        </div>

        {/* Timeframe selector (functional segmented controls) */}
        <div className="inline-flex items-center gap-1 p-1 bg-[#EFECE6] rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setSelectedTimeframe('30d')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              selectedTimeframe === '30d'
                ? 'bg-white text-[#181716] shadow-sm font-semibold'
                : 'text-[#6B655B] hover:text-[#181716]'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setSelectedTimeframe('90d')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              selectedTimeframe === '90d'
                ? 'bg-white text-[#181716] shadow-sm font-semibold'
                : 'text-[#6B655B] hover:text-[#181716]'
            }`}
          >
            Last Quarter
          </button>
          <button
            onClick={() => setSelectedTimeframe('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              selectedTimeframe === 'all'
                ? 'bg-white text-[#181716] shadow-sm font-semibold'
                : 'text-[#6B655B] hover:text-[#181716]'
            }`}
          >
            Year to Date
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Monthly Revenue */}
        <div className="p-5 bg-white rounded-xl border border-[#EAE6DF] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E877E] uppercase tracking-wider font-semibold">
            <span>October Revenue</span>
            <DollarSign className="w-4 h-4 text-[#8C6239]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#181716] tabular-nums">
              ${data.monthlyRevenue.toLocaleString()}
            </span>
            <span className="flex items-center text-xs font-mono font-medium text-emerald-600 tabular-nums">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{data.revenueGrowthPct}%
            </span>
          </div>
          <p className="text-[11px] text-[#8E877E]">
            vs. ${data.monthlyRevenuePrev.toLocaleString()} in September
          </p>
        </div>

        {/* Metric 2: Reel Video Plays */}
        <div className="p-5 bg-white rounded-xl border border-[#EAE6DF] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E877E] uppercase tracking-wider font-semibold">
            <span>Shoppable Reel Plays</span>
            <Eye className="w-4 h-4 text-[#8C6239]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#181716] tabular-nums">
              {data.reelViews.toLocaleString()}
            </span>
            <span className="flex items-center text-xs font-mono font-medium text-emerald-600 tabular-nums">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{data.reelViewsGrowthPct}%
            </span>
          </div>
          <p className="text-[11px] text-[#8E877E]">
            {data.clickThroughRate}% average tag tap-through rate
          </p>
        </div>

        {/* Metric 3: DM Consultation Conversion */}
        <div className="p-5 bg-white rounded-xl border border-[#EAE6DF] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E877E] uppercase tracking-wider font-semibold">
            <span>DM Inquiries to Sale</span>
            <MessageSquare className="w-4 h-4 text-[#8C6239]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#181716] tabular-nums">
              {data.dmConversionRate}%
            </span>
            <span className="text-xs text-[#8E877E] font-mono">High VIP</span>
          </div>
          <p className="text-[11px] text-[#8E877E]">
            3.2x higher conversion than standard retail checkout
          </p>
        </div>

        {/* Metric 4: Average Order Value */}
        <div className="p-5 bg-white rounded-xl border border-[#EAE6DF] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E877E] uppercase tracking-wider font-semibold">
            <span>Avg Order Value (AOV)</span>
            <ShoppingBag className="w-4 h-4 text-[#8C6239]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#181716] tabular-nums">
              ${data.averageOrderValue}
            </span>
            <span className="text-xs text-[#8E877E] font-mono tabular-nums">
              {data.totalOrders} Orders
            </span>
          </div>
          <p className="text-[11px] text-[#8E877E]">
            Driven by outerwear & handcrafted boot sets
          </p>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Monthly Revenue Growth Chart */}
        <div className="lg:col-span-8 p-6 bg-white rounded-2xl border border-[#EAE6DF] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8C6239]">
                Monthly Financial Trajectory
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-medium text-[#181716]">
                Revenue Growth by Month (May - Oct 2026)
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#6B655B]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#181716]" />
                <span>Total Net</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#8C6239]" />
                <span>Reels Sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#DFBA73]" />
                <span>DM Invoicing</span>
              </div>
            </div>
          </div>

          {/* Interactive Responsive SVG Bar Chart */}
          <div className="h-64 w-full flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 border-b border-[#EAE6DF]">
            {data.monthlyTrend.map((m, idx) => {
              const maxRev = 65000;
              const heightPct = Math.round((m.revenue / maxRev) * 100);
              const reelsHeightPct = Math.round((m.reels / m.revenue) * 100);
              const dmHeightPct = Math.round((m.dm / m.revenue) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[11px] font-mono font-semibold text-[#181716] opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    ${(m.revenue / 1000).toFixed(1)}k
                  </div>

                  {/* Multi-tier stacked bar */}
                  <div
                    className="w-full max-w-[48px] rounded-t-lg overflow-hidden flex flex-col justify-end bg-[#EFECE6] transition-all group-hover:brightness-95"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div
                      className="w-full bg-[#181716]"
                      style={{ height: `${100 - reelsHeightPct - dmHeightPct}%` }}
                      title={`Feed Store: $${m.revenue - m.reels - m.dm}`}
                    />
                    <div
                      className="w-full bg-[#8C6239]"
                      style={{ height: `${reelsHeightPct}%` }}
                      title={`Reels Revenue: $${m.reels}`}
                    />
                    <div
                      className="w-full bg-[#DFBA73]"
                      style={{ height: `${dmHeightPct}%` }}
                      title={`DM Consultations: $${m.dm}`}
                    />
                  </div>

                  <span className="text-xs font-medium text-[#524C44] tracking-tight">
                    {m.month.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-[#8E877E]">
            <span>Base Month: May 2026 ($28.9k)</span>
            <span className="font-semibold text-[#181716]">+102.1% Net Cumulative Growth</span>
          </div>
        </div>

        {/* Right: Channel Breakdown */}
        <div className="lg:col-span-4 p-6 bg-white rounded-2xl border border-[#EAE6DF] shadow-sm space-y-6">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8C6239]">
              Attribution Channels
            </span>
            <h3 className="font-serif text-lg font-medium text-[#181716]">
              Where Orders Originate
            </h3>
          </div>

          <div className="space-y-4">
            {data.channelBreakdown.map((ch, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#181716]">{ch.channel}</span>
                  <span className="font-mono font-semibold text-[#181716] tabular-nums">
                    ${ch.revenue.toLocaleString()} ({ch.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#EFECE6] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      idx === 0
                        ? 'bg-[#8C6239]'
                        : idx === 1
                        ? 'bg-[#181716]'
                        : 'bg-[#DFBA73]'
                    }`}
                    style={{ width: `${ch.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Stylist Insights Note */}
          <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] text-xs space-y-2">
            <p className="font-serif italic text-sm text-[#181716]">
              Atelier Strategy Insight
            </p>
            <p className="text-[#6B655B] leading-relaxed">
              Instagram Reels featuring styling demonstrations generate 48.7% of all direct purchases. Pairing video links with instant DM checkout has reduced cart abandonment by 62%.
            </p>
          </div>
        </div>
      </div>

      {/* Top Performing Western Wear Garments Table */}
      <div className="p-6 bg-white rounded-2xl border border-[#EAE6DF] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-4">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8C6239]">
              Inventory Diagnostics
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-medium text-[#181716]">
              Top Selling Western Wear Pieces
            </h3>
          </div>
          <span className="text-xs text-[#8E877E]">Sorted by Monthly Gross Revenue</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#EAE6DF] text-[#8E877E] uppercase text-[11px] font-semibold tracking-wider">
                <th className="py-3 px-2">Garment Item</th>
                <th className="py-3 px-2 text-right">Units Sold</th>
                <th className="py-3 px-2 text-right">Reel Impressions</th>
                <th className="py-3 px-2 text-right">Gross Revenue</th>
                <th className="py-3 px-2 text-right">Atelier Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {data.topProducts.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 px-2 font-medium text-[#181716]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#8E877E] text-xs">
                        0{idx + 1}.
                      </span>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono tabular-nums text-[#524C44]">
                    {item.unitsSold}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono tabular-nums text-[#524C44]">
                    {item.views.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono font-semibold text-[#181716] tabular-nums">
                    ${item.revenue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono tabular-nums">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        item.stock < 10
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {item.stock} left
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
