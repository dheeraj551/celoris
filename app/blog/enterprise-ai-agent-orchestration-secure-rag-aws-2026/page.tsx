import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Calendar, Clock, BookOpen, CheckCircle2,
  ShieldCheck, Cpu, Database, Lock, Zap, Briefcase, Terminal, Layers
} from "lucide-react";
import ShareButtons from '@/components/ShareButtons';
import BlogEngagement from '@/components/blog/BlogEngagement';

export const metadata: Metadata = {
  title: "Architecting Enterprise AI Agent Orchestration and Secure RAG on AWS | Celoris",
  description: "A deep dive into sub-20s latency, 90%+ accuracy, Hybrid RAG with Reciprocal Rank Fusion (RRF), Amazon Bedrock Guardrails, and zero-trust KMS encryption on AWS.",
  keywords: [
    "enterprise AI agent orchestration AWS",
    "secure RAG on AWS",
    "Reciprocal Rank Fusion RRF k=60",
    "Amazon Bedrock Guardrails ApplyGuardrail",
    "sub 20s LLM latency budget",
    "Amazon SES Mail Manager AI automation",
    "OpenSearch Serverless hybrid search",
    "zero trust KMS AI governance",
    "AI & NLP Engineer job Celoris",
    "prompt caching prefill decode latency"
  ],
  alternates: {
    canonical: "https://celorisdesigns.com/blog/enterprise-ai-agent-orchestration-secure-rag-aws-2026",
  },
  openGraph: {
    title: "Architecting Enterprise AI Agent Orchestration and Secure RAG on AWS",
    description: "Sub-20s latency budgets, 90%+ accuracy via Hybrid RRF + Cross-Encoder Reranking, Bedrock Guardrails for tool loops, and zero-trust AWS KMS isolation.",
    url: "https://celorisdesigns.com/blog/enterprise-ai-agent-orchestration-secure-rag-aws-2026",
    siteName: "Celoris",
    locale: "en_IN",
    images: [
      {
        url: "https://celorisdesigns.com/agentic-ai-systems-cover.png",
        width: 1200,
        height: 675,
        alt: "Architecting Enterprise AI Agent Orchestration and Secure RAG on AWS",
      },
    ],
    type: "article",
    publishedTime: "2026-11-14T18:15:00Z",
    authors: ["Celoris AI Architecture & Cloud Lab"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enterprise AI Agent Orchestration & Secure RAG on AWS (Sub-20s, 90%+ Accuracy)",
    description: "Event-driven serverless orchestration, Hybrid RRF + Cross-Encoder reranking, Bedrock Guardrails, and zero-trust KMS.",
    images: ["https://celorisdesigns.com/agentic-ai-systems-cover.png"],
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://celorisdesigns.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://celorisdesigns.com/blog" },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Enterprise AI Agent Orchestration & Secure RAG on AWS",
          "item": "https://celorisdesigns.com/blog/enterprise-ai-agent-orchestration-secure-rag-aws-2026"
        }
      ]
    },
    {
      "@type": "BlogPosting",
      "headline": "Architecting Enterprise AI Agent Orchestration and Secure RAG on AWS: A Deep Dive into Sub-20s Latency, 90%+ Accuracy, and Zero-Trust Guardrails",
      "description": "Production engineering blueprint for autonomous AI agents on AWS covering serverless event orchestration, RRF hybrid RAG, prefill/decode latency budgets, tool-loop Bedrock Guardrails, and scoped KMS encryption.",
      "image": "https://celorisdesigns.com/agentic-ai-systems-cover.png",
      "author": {
        "@type": "Organization",
        "name": "Celoris AI Architecture & Cloud Lab",
        "url": "https://celorisdesigns.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Celoris Designs LLP",
        "logo": {
          "@type": "ImageObject",
          "url": "https://celorisdesigns.com/celoris-logo.png"
        }
      },
      "datePublished": "2026-11-14T18:15:00Z",
      "dateModified": "2026-11-14T18:15:00Z",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://celorisdesigns.com/blog/enterprise-ai-agent-orchestration-secure-rag-aws-2026"
      }
    }
  ]
};

export default function EnterpriseAiAgentOrchestrationAwsPage() {
  return (
    <div className="min-h-screen bg-[#090a0d] text-slate-200 selection:bg-emerald-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Top Hero Header */}
      <header className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 border-b border-slate-800/80 bg-gradient-to-b from-[#0d1412] via-[#090a0d] to-[#090a0d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to All Articles
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Cpu className="w-3.5 h-3.5" />
              AI Architecture &amp; AWS
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-slate-300 border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              18 Min Read
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-slate-300 border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              November 14, 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-6">
            Architecting Enterprise AI Agent Orchestration and Secure RAG on AWS: Sub-20s Latency, 90%+ Accuracy &amp; Zero-Trust Guardrails
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mb-8">
            Production AI systems—like automated email support pipelines, financial dispute resolvers, and technical triage agents—require far more than basic model invocation. Here is the end-to-end AWS architecture combining event-driven serverless orchestration, Hybrid RRF + cross-encoder RAG, strict inference latency budgeting, tool-loop guardrails, and scoped KMS encryption.
          </p>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-800/70">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-600 flex items-center justify-center text-white font-black text-sm ring-2 ring-emerald-500/30 shadow-lg">
              AI
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Celoris AI Architecture &amp; Cloud Lab</p>
              <p className="text-xs text-slate-400">AWS Serverless AI, Hybrid RAG &amp; Zero-Trust Security • Nov 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Cover */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 my-10">
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/70">
          <Image
            src="/agentic-ai-systems-cover.png"
            alt="Enterprise AI Agent Orchestration and Secure RAG on AWS"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0d]/85 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 text-xs bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-slate-300 border border-white/10 font-medium">
            Enterprise Engineering Deep Dive · AWS Bedrock &amp; OpenSearch
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 text-slate-300">
        <p className="leading-relaxed mb-8">
          Achieving a contextually accurate response rate exceeding <strong className="text-white">90%</strong> while holding end-to-end processing latency strictly <strong className="text-white">under 20 seconds</strong> demands an integrated systems approach spanning asynchronous event-driven serverless orchestration, multi-stage hybrid retrieval with mathematically robust rank fusion, granular inference latency budgeting, defense-in-depth safety guardrails across unseen execution vectors, and cryptographic isolation via customer-managed encryption policies.
        </p>

        {/* Table of Contents */}
        <div className="bg-[#111217] border border-slate-800 rounded-2xl p-6 sm:p-7 mb-14 shadow-xl">
          <h2 className="text-sm font-bold text-emerald-400 mb-4 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Architecture Deep-Dive Contents
          </h2>
          <ol className="grid sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-400 font-medium">
            <li><a href="#section-1" className="hover:text-emerald-400 transition-colors">1. Asynchronous Serverless Topography &amp; Agent Orchestration</a></li>
            <li><a href="#section-2" className="hover:text-emerald-400 transition-colors">2. High-Accuracy Hybrid RAG: RRF &amp; Reranking</a></li>
            <li><a href="#section-3" className="hover:text-emerald-400 transition-colors">3. Latency Budget Engineering &amp; Model Serving</a></li>
            <li><a href="#section-4" className="hover:text-emerald-400 transition-colors">4. Multi-Vector Threat Modeling &amp; Guardrails</a></li>
            <li><a href="#section-5" className="hover:text-emerald-400 transition-colors">5. Cryptographic Isolation &amp; Zero-Trust KMS</a></li>
            <li><a href="#section-6" className="hover:text-emerald-400 transition-colors">6. 5-Phase Production Blueprint &amp; Checklist</a></li>
          </ol>
        </div>

        {/* SECTION 1 */}
        <section id="section-1" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
            <span className="text-emerald-400 text-xl font-bold">01.</span>
            Asynchronous Serverless Topography &amp; Event-Driven Orchestration
          </h2>
          <p className="leading-relaxed mb-6">
            Binding deep MIME payload decoding, malware scanning, semantic RAG, multi-agent evaluation, and safety verification to a synchronous API gateway introduces tail-latency amplification and cascading timeouts. Production architectures decouple transport, state tracking, intent classification, and domain execution into modular serverless boundaries.
          </p>

          <h3 className="text-xl font-bold text-white mb-3">Perimeter Ingestion &amp; Threat Neutralization</h3>
          <ol className="space-y-2.5 text-sm mb-8">
            <li className="bg-[#111319] border border-slate-800 rounded-xl p-4">
              <strong className="text-white">1. SMTP Perimeter Filtering (Amazon SES Mail Manager):</strong> Evaluates connecting IPs against Spamhaus/Abusix reputation lists and enforces recipient allowlists before any compute spins up.
            </li>
            <li className="bg-[#111319] border border-slate-800 rounded-xl p-4">
              <strong className="text-white">2. Native Anti-Malware Inspection:</strong> Infected attachments trigger an immediate RFC-compliant SMTP bounce, terminating hostile payloads at the transport edge.
            </li>
            <li className="bg-[#111319] border border-slate-800 rounded-xl p-4">
              <strong className="text-white">3. MIME Archival &amp; Decoupled Lambda Parsing:</strong> Clean raw MIME objects land in Amazon S3, triggering a parser Lambda that extracts headers (Message-ID, Thread-ID), separates HTML/plain text, writes tenant-partitioned objects, initializes a DynamoDB lifecycle record, and emits an EventBridge event.
            </li>
          </ol>

          <h3 className="text-xl font-bold text-white mb-3">Broker-Supervisor Multi-Agent Coordination</h3>
          <p className="leading-relaxed text-sm mb-6">
            The <strong className="text-white">Agent Broker Lambda</strong> queries AWS AppConfig for registered tool definitions and invokes Amazon Bedrock Converse (Amazon Nova Micro / Claude 3 Haiku) to resolve user intent dynamically. Execution then transitions to a <strong className="text-white">Supervisor Agent Lambda</strong>, which tracks correlation state in DynamoDB, retrieves missing context via an Answers Agent, invokes specialized action-group Lambdas, and coordinates safety validation before SES dispatch.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-800 mb-6">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/90 text-slate-200 border-b border-slate-800">
                <tr>
                  <th className="p-3.5 font-bold">Pipeline Stage</th>
                  <th className="p-3.5 font-bold">AWS Service</th>
                  <th className="p-3.5 font-bold">Primary Function</th>
                  <th className="p-3.5 font-bold text-emerald-400">P95 SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 bg-[#0e1015]">
                <tr><td className="p-3.5 text-white font-semibold">Inbound Perimeter</td><td className="p-3.5">SES Mail Manager</td><td className="p-3.5">IP reputation, allowlisting, malware bounce</td><td className="p-3.5 text-emerald-400">&lt; 200 ms</td></tr>
                <tr><td className="p-3.5 text-white font-semibold">Payload Extraction</td><td className="p-3.5">Lambda &amp; S3</td><td className="p-3.5">MIME parsing, attachment isolation</td><td className="p-3.5 text-emerald-400">&lt; 500 ms</td></tr>
                <tr><td className="p-3.5 text-white font-semibold">State &amp; Bus</td><td className="p-3.5">DynamoDB &amp; EventBridge</td><td className="p-3.5">Transaction tracking &amp; async routing</td><td className="p-3.5 text-emerald-400">&lt; 100 ms</td></tr>
                <tr><td className="p-3.5 text-white font-semibold">Intent Routing</td><td className="p-3.5">AppConfig &amp; Bedrock Converse</td><td className="p-3.5">Dynamic tool schema intent resolution</td><td className="p-3.5 text-emerald-400">&lt; 800 ms</td></tr>
                <tr><td className="p-3.5 text-white font-semibold">Agent Supervision</td><td className="p-3.5">Lambda (Broker/Supervisor)</td><td className="p-3.5">Multi-agent orchestration &amp; APIs</td><td className="p-3.5 text-emerald-400">&lt; 1,200 ms</td></tr>
                <tr><td className="p-3.5 text-white font-semibold">Hybrid RAG</td><td className="p-3.5">OpenSearch Serverless</td><td className="p-3.5">Concurrent BM25 + Titan V2 search</td><td className="p-3.5 text-emerald-400">&lt; 400 ms</td></tr>
                <tr><td className="p-3.5 text-white font-semibold">Response Generation</td><td className="p-3.5">Bedrock (Nova / Claude)</td><td className="p-3.5">Context-grounded draft generation</td><td className="p-3.5 text-emerald-400">&lt; 14,000 ms</td></tr>
                <tr><td className="p-3.5 text-white font-semibold">Safety Verification</td><td className="p-3.5">Bedrock Guardrails</td><td className="p-3.5">Grounding check, PII masking, injection defense</td><td className="p-3.5 text-emerald-400">&lt; 800 ms</td></tr>
                <tr><td className="p-3.5 text-white font-semibold">Outbound Dispatch</td><td className="p-3.5">SES Outbound</td><td className="p-3.5">Authenticated SMTP reply dispatch</td><td className="p-3.5 text-emerald-400">&lt; 200 ms</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 2 */}
        <section id="section-2" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
            <span className="text-emerald-400 text-xl font-bold">02.</span>
            Mathematical Foundations of Hybrid RAG: RRF &amp; Cross-Encoder Reranking
          </h2>
          <p className="leading-relaxed mb-6">
            Single-mode search fails at scale: dense vectors smooth over exact error strings and SKUs, while sparse BM25 lexical search misses synonyms. Merging their raw scores via min-max normalization also fails because BM25 is unbounded (<code className="text-emerald-300">[0, ∞)</code>) while cosine similarity is bounded (<code className="text-emerald-300">[-1, 1]</code>).
          </p>

          <div className="bg-[#111319] border border-slate-800 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-white text-base mb-2">Reciprocal Rank Fusion (RRF) with Empirical Standard k = 60</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-3">
              RRF discards incompatible raw score magnitudes and scores documents purely by ordinal rank across retrievers:
            </p>
            <div className="bg-black/70 border border-slate-800 rounded-xl p-4 font-mono text-xs sm:text-sm text-emerald-300 text-center mb-4">
              RRF_score(d) = Σ [ w_r / (k + rank_r(d)) ] &nbsp;&nbsp;(where k = 60)
            </div>
            <div className="text-xs text-slate-300 space-y-1.5 font-mono bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
              <div>• Doc A (Lexical Outlier: #1 BM25, #50 Vector): 1/61 + 1/110 = <strong>0.025484</strong></div>
              <div className="text-emerald-400">• Doc B (Consensus Hit: #5 BM25, #3 Vector): 1/65 + 1/63 = <strong>0.031258 (Winner!)</strong></div>
              <div>• Doc C (Long-Tail Hit: #100 BM25, #100 Vector): 1/160 + 1/160 = <strong>0.012500</strong></div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">Production RRF Query (Elasticsearch 8.16+)</h3>
          <pre className="bg-[#0d1017] border border-slate-800 rounded-xl p-4 overflow-x-auto text-xs text-slate-200 font-mono mb-6">
{`GET enterprise-knowledge-base/_search
{
  "retriever": {
    "rrf": {
      "retrievers": [
        { "standard": { "query": { "match": { "body": "error code ERR-8492 connection timeout" } } } },
        { "knn": { "field": "embedding", "query_vector": [0.012, -0.045, 0.089, 0.124], "k": 50, "num_candidates": 100 } }
      ],
      "rank_window_size": 50,
      "rank_constant": 60
    }
  },
  "size": 10
}`}
          </pre>

          <h3 className="text-lg font-bold text-white mb-2">Pure SQL RRF Implementation (PostgreSQL pgvector / Apache Doris)</h3>
          <pre className="bg-[#0d1017] border border-slate-800 rounded-xl p-4 overflow-x-auto text-xs text-slate-200 font-mono mb-8">
{`WITH bm25_hits AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC) AS bm25_rank
  FROM (
    SELECT id, score() AS score FROM enterprise_docs
    WHERE body MATCH_ANY 'ERR-8492 connection timeout'
    ORDER BY score DESC LIMIT 50
  )
),
vector_hits AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY dist ASC) AS vec_rank
  FROM (
    SELECT id, l2_distance_approximate(embedding, [0.012, -0.045, 0.089, 0.124]) AS dist
    FROM enterprise_docs ORDER BY dist ASC LIMIT 50
  )
)
SELECT
  COALESCE(b.id, v.id) AS document_id,
  COALESCE(1.0 / (60 + b.bm25_rank), 0.0) + COALESCE(1.0 / (60 + v.vec_rank), 0.0) AS rrf_score
FROM bm25_hits b
FULL OUTER JOIN vector_hits v ON b.id = v.id
ORDER BY rrf_score DESC LIMIT 10;`}
          </pre>

          <h3 className="text-xl font-bold text-white mb-3">Two-Stage Retrieval + Cross-Encoder Precision Reranking</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 mb-6">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/90 text-slate-200 border-b border-slate-800">
                <tr>
                  <th className="p-3.5 font-bold">Retrieval Methodology</th>
                  <th className="p-3.5 font-bold">Recall@10</th>
                  <th className="p-3.5 font-bold">Precision@5</th>
                  <th className="p-3.5 font-bold">Latency Overhead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 bg-[#0e1015]">
                <tr><td className="p-3.5 text-white font-medium">Sparse BM25 Alone</td><td className="p-3.5">64.2%</td><td className="p-3.5">58.1%</td><td className="p-3.5">~40 ms</td></tr>
                <tr><td className="p-3.5 text-white font-medium">Dense Vector Alone</td><td className="p-3.5">78.5%</td><td className="p-3.5">71.3%</td><td className="p-3.5">~120 ms</td></tr>
                <tr><td className="p-3.5 text-white font-medium">Hybrid RRF (k=60)</td><td className="p-3.5">91.4%</td><td className="p-3.5">84.6%</td><td className="p-3.5">~180 ms</td></tr>
                <tr className="bg-emerald-500/10 font-bold"><td className="p-3.5 text-white">Hybrid RRF + Cross-Encoder Rerank</td><td className="p-3.5 text-emerald-400">96.8%</td><td className="p-3.5 text-emerald-400">92.1%</td><td className="p-3.5 text-emerald-400">~380 ms</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3 */}
        <section id="section-3" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
            <span className="text-emerald-400 text-xl font-bold">03.</span>
            Latency Budget Engineering &amp; Model Serving Dynamics
          </h2>
          <p className="leading-relaxed mb-4">
            LLM latency splits into compute-bound parallel <strong className="text-white">Prefill</strong> (<code className="text-emerald-300">T_TTFT</code>) and memory-bandwidth-bound auto-regressive <strong className="text-white">Decode</strong> (<code className="text-emerald-300">N_out × T_ITL</code>), where generating a single output token can take up to 300× longer than reading an input token.
          </p>
          <ul className="space-y-2 text-sm mb-8">
            <li className="flex items-start gap-2.5"><Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-1" /><span><strong className="text-white">Hard Cap `max_tokens: 500` &amp; Stop Sequences:</strong> Bounds worst-case decode under 10.5s and halts immediately on email sign-offs.</span></li>
            <li className="flex items-start gap-2.5"><Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-1" /><span><strong className="text-white">80/20 Intelligent Routing:</strong> 80% of routine queries hit Amazon Nova Lite / Claude 3 Haiku (3–4s total); 20% complex escalations route to Claude 3.5 Sonnet.</span></li>
            <li className="flex items-start gap-2.5"><Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-1" /><span><strong className="text-white">Prefix-Stable Prompt Caching:</strong> Placing static policies and schemas at the prompt head cuts input token cost by up to 90% and drops <code className="text-emerald-300">T_TTFT</code> from &gt;2,000ms to &lt;400ms.</span></li>
          </ul>

          <div className="overflow-x-auto rounded-xl border border-slate-800 mb-6">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/90 text-slate-200 border-b border-slate-800">
                <tr>
                  <th className="p-3 font-bold">Step</th>
                  <th className="p-3 font-bold">Component</th>
                  <th className="p-3 font-bold">P95 Allocation</th>
                  <th className="p-3 font-bold text-emerald-400">Cumulative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 bg-[#0e1015]">
                <tr><td className="p-3">1–3</td><td className="p-3 text-white">SES Ingress + Lambda MIME + EventBridge Broker</td><td className="p-3">1,250 ms</td><td className="p-3">1,250 ms</td></tr>
                <tr><td className="p-3">4–5</td><td className="p-3 text-white">OpenSearch Hybrid RRF + Cross-Encoder Rerank</td><td className="p-3">550 ms</td><td className="p-3">1,800 ms</td></tr>
                <tr><td className="p-3">6–8</td><td className="p-3 text-white">Input Guardrail + LLM Prefill + Decode (≤500 tok)</td><td className="p-3">12,300 ms</td><td className="p-3">14,100 ms</td></tr>
                <tr className="bg-emerald-500/10 font-bold"><td className="p-3">9–10</td><td className="p-3 text-white">Output Guardrail + PII Redaction + SES Outbound</td><td className="p-3">600 ms</td><td className="p-3 text-emerald-400">14,700 ms (5.3s buffer)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4 */}
        <section id="section-4" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
            <span className="text-emerald-400 text-xl font-bold">04.</span>
            Multi-Vector Threat Modeling &amp; Tool-Loop Guardrails
          </h2>
          <p className="leading-relaxed mb-6">
            An attached agent guardrail only screens the initial user prompt and final synthesized reply—leaving intermediate <strong className="text-white">Tool Inputs</strong> and <strong className="text-white">Tool Outputs</strong> dangerously exposed to indirect prompt injection. Production Lambda action groups must call the standalone <code className="text-emerald-300">ApplyGuardrail</code> API explicitly around tool boundaries and wrap untrusted text with cryptographic UUID nonces.
          </p>

          <pre className="bg-[#0d1017] border border-slate-800 rounded-xl p-4 overflow-x-auto text-xs text-slate-200 font-mono mb-6">
{`import boto3, json, uuid

bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-east-1")

def wrap_untrusted_input(user_payload: str) -> tuple[str, str]:
    nonce = uuid.uuid4().hex[:12]
    tag_name = f"amazon-bedrock-guardrails-guardContent_{nonce}"
    return f"<{tag_name}>\\n{user_payload}\\n</{tag_name}>", tag_name

def lambda_handler(event, context):
    tool_input_args = event.get("parameters", {})
    
    # 1. Screen Tool Inputs before DB / API execution
    in_guard = bedrock_runtime.apply_guardrail(
        guardrailIdentifier="support-core-guardrail",
        guardrailVersion="3",
        source="INPUT",
        content=[{"text": {"text": json.dumps(tool_input_args), "qualifiers": ["guard_content"]}}]
    )
    if in_guard.get("action") == "GUARDRAIL_INTERVENED":
        return {"statusCode": 403, "action": "BLOCKED"}

    raw_result = execute_database_query(tool_input_args)

    # 2. Screen Tool Outputs before re-entering the Agent reasoning loop
    out_guard = bedrock_runtime.apply_guardrail(
        guardrailIdentifier="support-core-guardrail",
        guardrailVersion="3",
        source="OUTPUT",
        content=[{"text": {"text": raw_result, "qualifiers": ["guard_content"]}}]
    )
    if out_guard.get("action") == "GUARDRAIL_INTERVENED":
        return {"statusCode": 403, "action": "BLOCKED"}

    return {"statusCode": 200, "result": raw_result}`}
          </pre>

          <p className="text-sm text-slate-400 leading-relaxed">
            For persistent memory poisoning threats (such as Unit 42 indirect memory injections), pair Bedrock Guardrails (0.7 Grounding threshold + <code className="text-emerald-300">ANONYMIZE</code> PII redaction + Standard cross-region profiles) with kernel-level eBPF telemetry and IRSA identity auditing feeding AWS Security Hub.
          </p>
        </section>

        {/* SECTION 5 */}
        <section id="section-5" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
            <span className="text-emerald-400 text-xl font-bold">05.</span>
            Cryptographic Isolation &amp; Zero-Trust Governance on AWS
          </h2>
          <p className="leading-relaxed mb-6">
            Every S3 bucket, DynamoDB table, and OpenSearch Serverless collection is encrypted with Customer Managed Keys (CMKs) using <code className="text-emerald-300">kms:ViaService</code> and <code className="text-emerald-300">kms:EncryptionContext:ServiceDomain</code> conditions, paired with mandatory tenant filter predicates (<code className="text-emerald-300">tenant_id.keyword</code>) on every vector query and AWS Organizations SCPs.
          </p>

          <pre className="bg-[#0d1017] border border-slate-800 rounded-xl p-4 overflow-x-auto text-xs text-slate-200 font-mono mb-6">
{`{
  "Sid": "AllowRestrictedServiceDecryptionViaAuthorizedServices",
  "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::123456789012:role/EmailSupportExecutionRole" },
  "Action": ["kms:Decrypt", "kms:GenerateDataKey*", "kms:DescribeKey"],
  "Resource": "*",
  "Condition": {
    "StringEquals": {
      "kms:ViaService": [
        "bedrock.us-east-1.amazonaws.com",
        "s3.us-east-1.amazonaws.com",
        "dynamodb.us-east-1.amazonaws.com"
      ],
      "kms:EncryptionContext:ServiceDomain": "CustomerSupportAI",
      "kms:CallerAccount": "123456789012"
    }
  }
}`}
          </pre>
        </section>

        {/* SECTION 6 */}
        <section id="section-6" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
            <span className="text-emerald-400 text-xl font-bold">06.</span>
            5-Phase Production Deployment Checklist
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#111319] border border-emerald-500/20 rounded-xl p-5">
              <h3 className="font-bold text-white text-sm mb-2">Phases 1 &amp; 2: Perimeter + Hybrid RAG</h3>
              <p className="text-xs text-slate-400 leading-relaxed">SES Mail Manager IP/malware filtering → S3 MIME parser → OpenSearch BM25 + Titan V2 (N=50) → RRF (k=60) → Cross-Encoder (K=5, &gt;95% recall).</p>
            </div>
            <div className="bg-[#111319] border border-emerald-500/20 rounded-xl p-5">
              <h3 className="font-bold text-white text-sm mb-2">Phases 3–5: Latency, Guardrails &amp; KMS</h3>
              <p className="text-xs text-slate-400 leading-relaxed">max_tokens 500 + 80/20 routing + prefix caching (&lt;15s P95) → tool-loop ApplyGuardrail + UUID nonces → scoped KMS CMKs + X-Ray &amp; SCP governance.</p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <div className="bg-gradient-to-br from-emerald-950/70 via-[#0f1715] to-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 mb-14 text-center">
          <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
            Building Production AI &amp; NLP Pipelines?
          </h3>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto mb-6">
            Pass our 10-minute <strong>AI &amp; NLP Engineer (Email Support Automation)</strong> certification exam in the Celoris Job Center and apply directly for verified client projects (`₹21,250 – ₹63,750`).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/job-center">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-6">
                <Briefcase className="w-4 h-4 mr-2" />
                Get Certified in Job Center
              </Button>
            </Link>
            <Link href="/learn">
              <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 rounded-xl px-6">
                <Cpu className="w-4 h-4 mr-2" />
                Explore AI Engineering Courses
              </Button>
            </Link>
          </div>
        </div>

        {/* Share & Engagement */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <BlogEngagement slug="enterprise-ai-agent-orchestration-secure-rag-aws-2026" />
          <ShareButtons
            slug="enterprise-ai-agent-orchestration-secure-rag-aws-2026"
            title="Architecting Enterprise AI Agent Orchestration and Secure RAG on AWS: Sub-20s Latency, 90%+ Accuracy & Zero-Trust Guardrails"
          />
        </div>
      </main>
    </div>
  );
}
