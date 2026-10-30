"use client"
import React, { useState, useEffect } from 'react';
import {
  X,
  Server,
  Cpu,
  Layers,
  Database,
  Cloud,
  Zap,
  Activity,
  CheckCircle,
  RefreshCw,
  HardDrive,
  Globe,
} from 'lucide-react';
import { IngestionMetrics } from '../types';
import { calculateScalableMetrics, formatCount } from '../utils/socialLogic';

interface ScalableArchModalProps {
  onClose: () => void;
}

export const ScalableArchModal: React.FC<ScalableArchModalProps> = ({ onClose }) => {
  const [metrics, setMetrics] = useState<IngestionMetrics>(calculateScalableMetrics());
  const [activeTab, setActiveTab] = useState<'overview' | 'flow' | 'fanout'>('overview');

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(calculateScalableMetrics(1 + Math.random() * 0.2));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 text-white shadow-xs">
              <Server size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                Scalable Cloud Media Architecture
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-300 dark:border-emerald-800">
                  LIVE TELEMETRY
                </span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Engineered to ingest millions of concurrent photo uploads with zero bottlenecking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close architecture modal"
            className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              Concurrent Ingest
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100">
                {metrics.concurrentUploads.toLocaleString()}
              </span>
              <span className="text-[10px] text-pink-500 font-semibold">req/s</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              Edge Latency
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {metrics.edgeLatencyMs}
              </span>
              <span className="text-[10px] text-neutral-500">ms</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              CDN Cache Hit
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold font-mono text-sky-600 dark:text-sky-400">
                {metrics.cacheHitRatio}%
              </span>
              <span className="text-[10px] text-neutral-500">global</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              Processed Today
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100">
                {formatCount(metrics.processedImagesToday)}
              </span>
              <span className="text-[10px] text-neutral-500">images</span>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 flex gap-4 border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 border-b-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-pink-500 text-pink-500'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Architecture Pipeline
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`pb-2.5 border-b-2 cursor-pointer ${
              activeTab === 'flow'
                ? 'border-pink-500 text-pink-500'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Direct Pre-Signed Uploads
          </button>
          <button
            onClick={() => setActiveTab('fanout')}
            className={`pb-2.5 border-b-2 cursor-pointer ${
              activeTab === 'fanout'
                ? 'border-pink-500 text-pink-500'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Hybrid Feed Fan-Out
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Layers size={16} className="text-pink-500" />
                  Distributed High-Concurrency Pipeline
                </h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-1.5">
                      <Globe size={14} className="text-indigo-500" /> 1. Edge Anycast
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Uploads route to nearest Edge POP. Pre-signed multipart tokens authenticate client-to-storage directly without web server memory overhead.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-1.5">
                      <Cpu size={14} className="text-amber-500" /> 2. Async Workers
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Kafka event triggers serverless GPU/Wasm transcode workers generating AVIF/WebP responsive sizes (320w, 640w, 1080w) & BlurHash in &lt;150ms.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-1.5">
                      <Database size={14} className="text-emerald-500" /> 3. Sharded Feed
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Metadata committed to 256 partitioned shards. Timeline fan-out balances write-heavy versus read-heavy celebrity accounts seamlessly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                  Why Standard Relational DBs Fail Under Social Scale:
                </span>
                <p>
                  At 100,000+ uploads per second, streaming binary photo blobs through web application servers causes memory exhaustion and thread starvation. Lumigram decouples binary ingestion entirely: the client streams directly to distributed object storage (S3/GCS) with verified pre-signed hash signatures.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'flow' && (
            <div className="space-y-4">
              <div className="font-mono text-[11px] p-4 rounded-2xl bg-neutral-950 text-neutral-300 border border-neutral-800 space-y-2 overflow-x-auto">
                <p className="text-pink-400 font-bold">// Direct-to-Cloud Upload Sequence</p>
                <p>1. POST /api/media/presign &#123; mime: "image/webp", size: 4892100 &#125;</p>
                <p className="text-emerald-400">&#8594; Returns: &#123; uploadUrl: "https://storage.lumigram.cdn/...", s3Token: "...", assetId: "a_98x" &#125;</p>
                <p>2. Client PUT direct to S3/GCS bucket (Chunked Multipart 5MB slices)</p>
                <p>3. Cloud Storage triggers ObjectCreated Notification &#8594; Kafka topic "media.raw"</p>
                <p>4. Transcoding cluster generates WebP srcsets & CDN invalidation</p>
                <p>5. POST /api/posts/commit &#123; assetId, caption, tags &#125; &#8594; Returns 201 Created</p>
              </div>
            </div>
          )}

          {activeTab === 'fanout' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 block text-xs">
                  Hybrid Fan-Out Strategy (Celebrity vs Regular Accounts)
                </span>
                <ul className="space-y-2 text-xs">
                  <li>
                    <strong className="text-pink-500">Write Fan-Out (Followers &lt; 25K):</strong> When a regular user posts, their post ID is pushed into the timeline inbox table of each follower immediately. Fetching home feed is an instantaneous O(1) primary key lookup.
                  </li>
                  <li>
                    <strong className="text-indigo-500">Read Fan-Out (Celebrities &gt; 25K):</strong> For creators like @mayalin_photo (38K+) or @elena_nature (210K+), writing to 200,000 inboxes causes severe write amplification. Instead, their posts are pulled on-demand and merged into the user feed at read time.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

