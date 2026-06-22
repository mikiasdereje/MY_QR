/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, ArrowRight, Shield, Cpu, Clock, Zap, TrendingUp, AlertCircle, 
  Coins, HelpCircle, CornerDownRight, Terminal, RefreshCw, BarChart2, DollarSign,
  Layers, Lock, Check, LayoutGrid, CheckCircle2, ChevronDown, CheckCircle, Database
} from 'lucide-react';

import HudOverlay from './components/HudOverlay';
import ScrollAnimation from './components/ScrollAnimation';

interface NodeShard {
  id: string;
  name: string;
  location: string;
  ping: number;
  load: number;
  status: 'ONLINE' | 'STANDBY';
}

interface PriceTicker {
  symbol: string;
  name: string;
  priceEUR: number;
  change24h: number;
  volume24h: string;
}

interface ComplianceRule {
  id: string;
  title: string;
  description: string;
  status: 'VERIFIED' | 'COMPLIANT' | 'ACTIVE';
}

export default function App() {
  const [hudOpen, setHudOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(false);
  
  // Interactive nodes
  const [selectedNode, setSelectedNode] = useState<string>('node-zrh');
  const [nodeList, setNodeList] = useState<NodeShard[]>([
    { id: 'node-zrh', name: 'ZRH.CORE-SYS.01', location: 'Zurich, CH', ping: 0.052, load: 38, status: 'ONLINE' },
    { id: 'node-gva', name: 'GVA.ENCLAVE-SYS.02', location: 'Geneva, CH', ping: 0.081, load: 15, status: 'ONLINE' },
    { id: 'node-tyo', name: 'TYO.SHARD-NET.03', location: 'Tokyo, JP', ping: 1.184, load: 56, status: 'ONLINE' },
    { id: 'node-nyc', name: 'NYC.EDGE-LINK.04', location: 'New York, US', ping: 0.825, load: 24, status: 'ONLINE' },
  ]);

  // Terminal state for About Section shell
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'SYSTEM ONLINE: Consensus core ready on ZRH router.',
    'SECURITY LEVEL 3: Hardware enclave confirmed.',
    'INTEGRITY VERIFIED: RSA cryptographic channel active.'
  ]);
  const [customCommand, setCustomCommand] = useState<string>('');

  // Swap estimate states
  const [quickAsset, setQuickAsset] = useState<'BTC' | 'ETH' | 'SOL' | 'DUX'>('ETH');
  const [quickAmount, setQuickAmount] = useState<string>('1200');
  const [quickResult, setQuickResult] = useState<string>('0.38461');
  const [swapRatio, setSwapRatio] = useState<number>(50); // percentage slider
  const [swapSuccessMsg, setSwapSuccessMsg] = useState<string | null>(null);

  // Live currency ticker states
  const [activeTickerSymbol, setActiveTickerSymbol] = useState<string>('ETH');
  const [tickersList, setTickersList] = useState<PriceTicker[]>([
    { symbol: 'ETH', name: 'Ethereum', priceEUR: 3120.45, change24h: 3.42, volume24h: '3.4B' },
    { symbol: 'BTC', name: 'Bitcoin', priceEUR: 78450.20, change24h: 1.85, volume24h: '12.8B' },
    { symbol: 'SOL', name: 'Solana', priceEUR: 165.80, change24h: 8.12, volume24h: '1.9B' },
    { symbol: 'DUX', name: 'Duxica Token', priceEUR: 2.75, change24h: 12.45, volume24h: '420M' },
  ]);

  // Trusted Compliances State
  const [selectedCompliance, setSelectedCompliance] = useState<string>('comp-soc');
  const [compliances, setCompliances] = useState<ComplianceRule[]>([
    { id: 'comp-soc', title: 'SOC-2 Type II Trust certified', description: 'Fully audited asset integrity pipelines confirming total separation of client funds.', status: 'VERIFIED' },
    { id: 'comp-ccss', title: 'CCSS Level III Standards', description: 'Highest cryptocurrency security standard compliance. Absolute zero leaks framework.', status: 'COMPLIANT' },
    { id: 'comp-hsm', title: 'Isolated HSM Multi-Sig Vault State', description: 'Keys are secured inside cryptographic hardware vaults with biometric triggers.', status: 'ACTIVE' },
    { id: 'comp-is', title: 'ISO 27001 Cryptographic Safeguards', description: 'Proactive penetration testing and live automated network defense shielding.', status: 'VERIFIED' },
  ]);

  // High precision clock
  const [gmtTime, setGmtTime] = useState<string>('08:00:00.000');

  // Interactive Live Spectrum Traffic graph heights
  const [spectrumBars, setSpectrumBars] = useState<number[]>([
    40, 60, 25, 80, 50, 70, 30, 90, 45, 60, 35, 80, 55, 40, 75, 20, 45, 65, 30, 50, 70, 40, 85, 25, 60
  ]);

  // Capabilities card highlights state
  const [activeCapability, setActiveCapability] = useState<number>(0);

  // Smooth Navigation transitions
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Simulating live ticks & clock
  useEffect(() => {
    // 1. GMT Time clock with milliseconds
    const clockInterval = setInterval(() => {
      const d = new Date();
      const h = String(d.getUTCHours()).padStart(2, '0');
      const m = String(d.getUTCMinutes()).padStart(2, '0');
      const s = String(d.getUTCSeconds()).padStart(2, '0');
      const ms = String(d.getUTCMilliseconds()).padStart(3, '0');
      setGmtTime(`${h}:${m}:${s}.${ms} UTC`);
    }, 45);

    // 2. Real-time metrics variations
    const metricsInterval = setInterval(() => {
      setNodeList(prev => prev.map(n => {
        const delta = (Math.random() - 0.5) * 0.012;
        const newPing = Math.max(0.01, parseFloat((n.ping + delta).toFixed(3)));
        const newLoad = Math.min(96, Math.max(6, n.load + Math.floor((Math.random() - 0.5) * 5)));
        return { ...n, ping: newPing, load: newLoad };
      }));

      setTickersList(prev => prev.map(t => {
        const pct = 1 + (Math.random() - 0.49) * 0.0015;
        const newPrice = parseFloat((t.priceEUR * pct).toFixed(2));
        const changeDelta = parseFloat(((Math.random() - 0.5) * 0.15).toFixed(2));
        return { ...t, priceEUR: newPrice, change24h: parseFloat((t.change24h + changeDelta).toFixed(2)) };
      }));

      setSpectrumBars(prev => prev.map(val => {
        const delta = (Math.random() - 0.5) * 35;
        return Math.min(100, Math.max(10, Math.floor(val + delta)));
      }));
    }, 2000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  // Recalculating exchange rates
  useEffect(() => {
    const amt = parseFloat(quickAmount);
    if (isNaN(amt) || amt <= 0) {
      setQuickResult('0.00000');
      return;
    }
    const rates = { BTC: 78450.20, ETH: 3120.45, SOL: 165.80, DUX: 2.75 };
    // Ratio adjustment multiplier
    const ratioWeightMultiplier = 0.8 + (swapRatio / 100) * 0.45;
    const res = (amt * ratioWeightMultiplier / rates[quickAsset]).toFixed(5);
    setQuickResult(res);
  }, [quickAmount, quickAsset, swapRatio]);

  // Diagnostics Shell handler
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommand.trim()) return;
    const cmd = customCommand.trim().toUpperCase();
    let response = `[INPUT] SECURE_CMD: ${cmd}`;
    const outputList = [response];

    if (cmd === 'HELP' || cmd === '?') {
      outputList.push('[SYS] STACKS AVAILABLE: STATUS, PING, SHARDS, DUMP VAULT, CLR');
    } else if (cmd === 'STATUS') {
      outputList.push('[SYS] STACK LOGGED: ALL SYSTEMS SECURE. ENCLAVES OPERATE NORMAL.');
    } else if (cmd === 'PING') {
      const active = nodeList.find(n => n.id === selectedNode);
      outputList.push(`[SYS] CURRENT ROUTER PING TO ${active?.name || 'ZRH'}: ${active?.ping || '0.052'}ms`);
    } else if (cmd === 'SHARDS') {
      outputList.push('[SYS] TOTAL CONCURRENT ROUTING SHARDS ACTIVE: 4 ROUTE ENCLAVES.');
    } else if (cmd === 'DUMP VAULT' || cmd === 'VAULT') {
      outputList.push('[SYS] CORE PHYSICAL KEY MATRIX REMAINS LOCKED UNDER HIGH-ALTITUDE CRYPTO SEALS.');
    } else if (cmd === 'CLR' || cmd === 'CLEAR') {
      setTerminalLogs(['[SYS] Sandbox shell reset successful. Enter CLI query.']);
      setCustomCommand('');
      return;
    } else {
      outputList.push(`[SYS] ERROR: COMMAND "${cmd}" UNRECOGNIZED. ATTEMPT "HELP"`);
    }

    setTerminalLogs(prev => [...prev, ...outputList].slice(-6));
    setCustomCommand('');
  };

  // Direct script CLI launcher buttons
  const executeDirectBtnCommand = (action: string) => {
    setTerminalLogs(prev => [
      ...prev,
      `[INPUT] EXEC_SCRIPT: ${action}`,
      action === 'INTEGRITY_CHECK' 
        ? '[SYS] VALIDATING CRYPTO ESCROW INTEGRITY: HASH CONSENSUS MATCHED 100%.' 
        : action === 'PING_SWISS'
        ? `[SYS] RETRIEVING AIR-GAP DELAYS: Zurich core 0.052ms || Geneva isolated 0.081ms.`
        : '[SYS] TESTING GATEWAY LOAD: High capacity pools optimized via 120+ active routes.'
    ].slice(-6));
  };

  const getActiveTicker = () => {
    return tickersList.find(t => t.symbol === activeTickerSymbol) || tickersList[0];
  };

  const executeSimulationSwap = () => {
    setSwapSuccessMsg('Escrow transition initiated! Secure swap routed through ZRH enclaves.');
    setTimeout(() => {
      setSwapSuccessMsg(null);
    }, 4000);
  };

  return (
    <div id="duxica-app-container" className="min-h-screen bg-black text-white relative font-sans flex flex-col justify-between overflow-y-auto selection:bg-amber-500 selection:text-black scroll-smooth">
      
      {/* Scroll-triggered frame animation background */}
      <ScrollAnimation />

      {/* Background radial atmosphere filters strictly on the left and right flanks to preserve empty center layout */}
      <div className="absolute top-0 left-0 w-[35vw] h-[60vh] bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none z-0 filter blur-[120px]" />
      <div className="absolute top-[80vh] right-0 w-[35vw] h-[60vh] bg-gradient-to-bl from-amber-600/5 to-transparent pointer-events-none z-0 filter blur-[120px]" />
      <div className="absolute top-[180vh] left-0 w-[30vw] h-[60vh] bg-gradient-to-tr from-amber-500/3 to-transparent pointer-events-none z-0 filter blur-[100px]" />
      <div className="absolute top-[280vh] right-0 w-[35vw] h-[60vh] bg-gradient-to-bl from-[#00FF41]/3 to-transparent pointer-events-none z-0 filter blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[35vw] h-[50vh] bg-gradient-to-tr from-amber-500/3 to-transparent pointer-events-none z-0 filter blur-[100px]" />

      {/* STICKY DETAILED HEADER NAVBAR */}
      <header id="app-navbar" className="w-full sticky top-0 bg-black/95 backdrop-blur-md z-40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 h-[95px] flex items-center justify-between">
          
          {/* Logo brand configuration with premium Swiss layout */}
          <div id="logo-block" onClick={() => scrollToSection('home-section')} className="flex items-center space-x-2.5 cursor-pointer group">
            <div className="text-[19px] font-black tracking-[-0.03em] text-white uppercase select-none flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-500 rounded-none inline-block animate-pulse" />
              DUXICA<span className="text-amber-500 font-mono font-normal">.SYS</span>
            </div>
          </div>

          {/* Smooth Scroll Navigation Links */}
          <nav id="navbar-links" className="hidden lg:flex items-center space-x-[42px]">
            <button 
              id="navigation-tab-home"
              onClick={() => scrollToSection('home-section')}
              className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-neutral-400 hover:text-white hover:border-b hover:border-amber-500 pb-1 cursor-pointer uppercase transition-all"
            >
              01 // Home
            </button>
            <button 
              id="navigation-tab-integrations"
              onClick={() => scrollToSection('integrations-section')}
              className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-neutral-400 hover:text-white hover:border-b hover:border-amber-500 pb-1 cursor-pointer uppercase transition-all"
            >
              02 // Integrations
            </button>
            <button 
              id="navigation-tab-capabilities"
              onClick={() => scrollToSection('capabilities-section')}
              className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-neutral-400 hover:text-white hover:border-b hover:border-amber-500 pb-1 cursor-pointer uppercase transition-all"
            >
              03 // Capabilities
            </button>
            <button 
              id="navigation-tab-about"
              onClick={() => scrollToSection('about-section')}
              className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-neutral-400 hover:text-white hover:border-b hover:border-amber-500 pb-1 cursor-pointer uppercase transition-all"
            >
              04 // About
            </button>
            <button 
              id="navigation-tab-service"
              onClick={() => scrollToSection('service-section')}
              className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-neutral-400 hover:text-white hover:border-b hover:border-amber-500 pb-1 cursor-pointer uppercase transition-all"
            >
              05 // Service
            </button>
            <button 
              id="navigation-tab-trust"
              onClick={() => scrollToSection('trust-section')}
              className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-neutral-400 hover:text-white hover:border-b hover:border-amber-500 pb-1 cursor-pointer uppercase transition-all"
            >
              06 // Trust
            </button>
          </nav>

          {/* Right actions toolbar */}
          <div id="navbar-actions" className="flex items-center space-x-6">
            
            <button
              id="btn-nav-search"
              onClick={() => setHudOpen(true)}
              className="p-1.5 text-white/45 hover:text-amber-500 transition-all cursor-pointer"
              title="Search Ledger Ledger"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications Popover trigger */}
            <div className="relative">
              <button
                id="btn-nav-alerts"
                onClick={() => setSelectedNotification(!selectedNotification)}
                className="p-1.5 text-white/45 hover:text-white relative transition-all cursor-pointer"
                title="Consortium Signals"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-[5px] h-[5px] rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]" />
              </button>

              <AnimatePresence>
                {selectedNotification && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    id="alerts-popover" 
                    className="absolute right-0 mt-4 w-80 bg-[#080808] border border-white/10 p-5 rounded-none z-50 text-xs space-y-4 shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-left"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-white/10 font-mono">
                      <span className="font-bold text-white/40 uppercase tracking-[0.2em] text-[8px]">ACTIVE SIGNALS</span>
                      <span className="text-[8px] text-[#00FF41]">MATRIX ONLINE</span>
                    </div>
                    <div className="space-y-1 font-mono text-[9px] text-neutral-400 leading-relaxed">
                      <p className="text-white">● Latent Index: <span className="text-[#00FF41]">0.052ms</span> on Zurich</p>
                      <p>● Multi-Sig Consensus Status: Compliant</p>
                      <p>● 120+ Aggregate price routers: Live</p>
                    </div>
                    <button 
                      id="btn-close-popover"
                      onClick={() => { setHudOpen(true); setSelectedNotification(false); }}
                      className="w-full text-center py-2.5 bg-amber-500 text-black font-mono font-bold text-[9px] uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all"
                    >
                      OPEN TRADING CONSOLE
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div id="nav-login-wrapper" className="flex items-center gap-4">
              <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />
              <button
                id="btn-nav-getstarted"
                onClick={() => setHudOpen(true)}
                className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-white hover:text-amber-500 transition-all cursor-pointer"
              >
                [Trade Desk]
              </button>
            </div>
          </div>

        </div>
      </header>


      {/* ========================================================================= */}
      {/* SECTION 1: HOME SECTION (Symmetrical Left/Right, 100% Free Center Space) */}
      {/* ========================================================================= */}
      <section id="home-section" className="w-full min-h-[calc(100vh-95px)] flex items-center border-b border-white/5 relative bg-transparent py-12 lg:py-20 scroll-mt-[95px] z-10">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT COLUMN CONTENT */}
          <div id="home-left-side" className="col-span-1 lg:col-span-4 flex flex-col justify-center space-y-8 text-left z-10">
            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-amber-500 flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-none animate-pulse" />
              Crypto Escrow Consensus
            </div>

            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[0.9] uppercase font-sans text-white">
                Sovereign <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 via-neutral-300 to-neutral-700">ledger</span> <br />
                matrix<span className="text-amber-500">.</span>
              </h1>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed font-light tracking-wide max-w-[340px]">
              Secure custom swap & escrow over <span className="text-white font-medium">600 crypto tokens</span>. Zero brokerage spreads, routed natively with sub-millisecond atomic settlement confirmation.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                id="btn-home-cta-desk"
                onClick={() => setHudOpen(true)}
                className="py-3.5 px-6 bg-white hover:bg-amber-500 hover:text-black text-black font-extrabold text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Trading Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="btn-home-cta-learn"
                onClick={() => scrollToSection('about-section')}
                className="py-3.5 px-5 bg-transparent border border-white/10 text-neutral-300 hover:text-white font-mono text-[9px] uppercase tracking-[0.2em] transition-all hover:border-white/20 cursor-pointer"
              >
                04 // Vault Enclaves
              </button>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-neutral-500 text-[9px] tracking-widest font-mono">
              <span className="font-bold">LIQUID EXCHANGES:</span>
              <span className="text-neutral-300">BTC</span>
              <span>/</span>
              <span className="text-neutral-300">ETH</span>
              <span>/</span>
              <span className="text-neutral-300">SOL</span>
              <span>/</span>
              <span className="text-neutral-300">DUX</span>
            </div>
          </div>

          {/* CENTRAL CHASM (100% CLEAN AND EMPTY GAP AS SPECIFIED) */}
          <div id="home-center-empty" className="col-span-1 lg:col-span-4 hidden lg:block h-20 select-none pointer-events-none" />

          {/* RIGHT COLUMN CONTENT */}
          <div id="home-right-side" className="col-span-1 lg:col-span-4 flex flex-col justify-center space-y-6 text-left z-10 lg:pl-6">
            
            {/* Symmetrical stat panels */}
            <div className="grid grid-cols-3 gap-4 border-b border-white/10 pb-5">
              <div id="stat-cell-vol">
                <span className="block font-mono text-[8px] uppercase tracking-wider text-neutral-500">24H LEDGER VOL</span>
                <span className="text-lg font-bold tracking-tight text-white">$76.24B</span>
              </div>
              <div id="stat-cell-assets">
                <span className="block font-mono text-[8px] uppercase tracking-wider text-neutral-500">ESCROW COINS</span>
                <span className="text-lg font-bold tracking-tight text-white">600+</span>
              </div>
              <div id="stat-cell-node">
                <span className="block font-mono text-[8px] uppercase tracking-wider text-neutral-500">ACTIVE SHARDS</span>
                <span className="text-lg font-bold tracking-tight text-amber-500">04 CORE</span>
              </div>
            </div>

            {/* Price Index selector Widget */}
            <div className="bg-[#050505] border border-white/10 p-5 rounded-none space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-bold">Consortium Index Feed</span>
                <span className="text-[8px] font-mono text-amber-500 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-none bg-amber-500 animate-ping inline-block" />
                  LIVE STREAMING
                </span>
              </div>

              {/* Index selector tabs */}
              <div className="flex gap-2">
                {tickersList.map((t) => (
                  <button
                    key={t.symbol}
                    onClick={() => setActiveTickerSymbol(t.symbol)}
                    className={`flex-1 py-1.5 text-center font-mono text-[9px] font-bold border transition-all cursor-pointer ${
                      activeTickerSymbol === t.symbol 
                        ? 'bg-amber-500 text-black border-amber-500' 
                        : 'bg-black text-neutral-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {t.symbol}
                  </button>
                ))}
              </div>

              {/* Selected info block */}
              <div className="pt-1 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 font-mono block">{getActiveTicker().name} / EUR</span>
                  <span className="text-2xl font-black tracking-tight text-white font-mono">
                    €{getActiveTicker().priceEUR.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className={`text-xs font-bold block ${getActiveTicker().change24h >= 0 ? 'text-[#00FF41]' : 'text-red-500'}`}>
                    {getActiveTicker().change24h >= 0 ? '+' : ''}{getActiveTicker().change24h}%
                  </span>
                  <span className="text-[9px] text-neutral-500 block">VOL: {getActiveTicker().volume24h}</span>
                </div>
              </div>

            </div>

            {/* Shard route state info */}
            <div className="space-y-2">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-500 block">ACTIVE CRYPTO SECURE ROUTING SHARDS</span>
              <div className="grid grid-cols-2 gap-2">
                {nodeList.slice(0, 2).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setSelectedNode(n.id);
                      setTerminalLogs(prev => [
                        ...prev,
                        `[GATEWAY] Manual routing channel locked on ${n.name}`
                      ].slice(-6));
                    }}
                    className={`border p-2.5 rounded-none cursor-pointer transition-all flex items-center justify-between ${
                      selectedNode === n.id 
                        ? 'bg-white text-black border-white' 
                        : 'bg-[#030303] border-white/5 hover:border-white/15 text-white'
                    }`}
                  >
                    <div className="font-mono text-[9px] font-bold tracking-wider">{n.location}</div>
                    <div className="font-mono text-[9px] opacity-80">{n.ping}ms</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 2: INTEGRATIONS SECTION (Symmetrical Left/Right, 100% Free Center) */}
      {/* ========================================================================= */}
      <section id="integrations-section" className="w-full min-h-screen flex items-center border-b border-white/5 bg-transparent py-16 lg:py-24 scroll-mt-[95px] relative z-10">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT COLUMN: TITLE & INTRO */}
          <div id="integrations-left" className="col-span-1 lg:col-span-4 flex flex-col justify-center space-y-8 text-left z-10">
            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-amber-500 flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-none animate-pulse" />
              Unified Data Compilation
            </div>

            <div className="space-y-1">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[0.9] uppercase font-sans text-white">
                Powerful <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 via-neutral-400 to-neutral-700">integrated</span> <br />
                hubs<span className="text-amber-500">.</span>
              </h2>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed font-light tracking-wide max-w-[340px]">
              Our systems crawl, pull, inspect, and combine trade feeds from over 120+ public hubs concurrently. Absolute transparency on every coin.
            </p>

            {/* Features layout block */}
            <div className="pt-6 border-t border-white/10 flex items-center gap-10">
              <div className="space-y-1">
                <span className="block text-[10px] font-mono text-neutral-500 uppercase">UPDATE RATES</span>
                <span className="text-lg font-bold text-white font-mono">⚡ 0.05ms</span>
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] font-mono text-neutral-500 uppercase">BACKED RESERVES</span>
                <span className="text-lg font-bold text-[#00FF41] font-mono">100% ESCROW</span>
              </div>
            </div>
          </div>

          {/* CENTRAL CHASM (100% CLEAN AND EMPTY GAP) */}
          <div id="integrations-center-empty" className="col-span-1 lg:col-span-4 hidden lg:block h-20 select-none pointer-events-none" />

          {/* RIGHT COLUMN: 4 SPECTACULAR GRID METRIC TILES */}
          <div id="integrations-right" className="col-span-1 lg:col-span-4 flex flex-col justify-center space-y-6 z-10 lg:pl-6">
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-500 block font-bold">Consortium Integration Scanners</span>
            
            <div className="grid grid-cols-2 gap-4">
              
              <div className="border border-white/10 bg-[#060606] p-5 hover:border-amber-500/45 transition-all group cursor-default">
                <span className="text-xs font-mono text-neutral-500 block uppercase tracking-wider">AGGREGATORS</span>
                <span className="text-3xl font-black text-white mt-1.5 block tracking-tight">3</span>
                <p className="text-[10px] text-neutral-400 font-mono mt-1 font-light leading-relaxed">Integrated core price aggregators index feeds continuously.</p>
              </div>

              <div className="border border-amber-500/30 bg-[#0d0903] p-5 hover:border-amber-500 transition-all group cursor-default">
                <span className="text-xs font-mono text-amber-500 block uppercase tracking-wider">EXCHANGES</span>
                <span className="text-3xl font-black text-amber-500 mt-1.5 block tracking-tight">120+</span>
                <p className="text-[10px] text-amber-200/70 font-mono mt-1 font-light leading-relaxed">Liquidity routing streams pull live ledger balances.</p>
              </div>

              <div className="border border-white/10 bg-[#060606] p-5 hover:border-amber-500/45 transition-all group cursor-default">
                <span className="text-xs font-mono text-neutral-500 block uppercase tracking-wider">PUBLISHERS</span>
                <span className="text-3xl font-black text-white mt-1.5 block tracking-tight">214+</span>
                <p className="text-[10px] text-neutral-400 font-mono mt-1 font-light leading-relaxed">Live consensus news publishers feed intelligence matrices.</p>
              </div>

              <div className="border border-white/10 bg-[#060606] p-5 hover:border-amber-500/45 transition-all group cursor-default">
                <span className="text-xs font-mono text-neutral-500 block uppercase tracking-wider">BLOCKCHAINS</span>
                <span className="text-3xl font-black text-white mt-1.5 block tracking-tight font-mono">57+</span>
                <p className="text-[10px] text-neutral-400 font-mono mt-1 font-light leading-relaxed">Protocol layers verify cryptographic enclaves on-chain.</p>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 3: CAPABILITIES SECTION (Symmetrical Left/Right, 100% Free Center) */}
      {/* ========================================================================= */}
      <section id="capabilities-section" className="w-full min-h-screen flex items-center border-b border-white/5 bg-transparent py-16 lg:py-24 scroll-mt-[95px] relative z-10">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT COLUMN: INTRO */}
          <div id="capabilities-left" className="col-span-1 lg:col-span-4 flex flex-col justify-center space-y-8 text-left z-10">
            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-amber-500 flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-none animate-pulse" />
              Sovereign Trading Controls
            </div>

            <div className="space-y-1">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[0.9] uppercase font-sans text-white">
                Core <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 to-neutral-500">enclave</span> <br />
                safety<span className="text-amber-500">.</span>
              </h2>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed font-light tracking-wide max-w-[340px]">
              Complete financial custody on your own terms. We bring cold-storage enclaves right to your browser viewport with complete multi-sig consensus safeguards.
            </p>

            {/* Quick stats indicators */}
            <div className="flex items-center gap-6 pt-2">
              <button
                id="btn-capabilities-get"
                onClick={() => setHudOpen(true)}
                className="py-3 px-5 bg-white hover:bg-neutral-200 text-black text-[10px] uppercase tracking-[0.2em] font-extrabold transition-all cursor-pointer"
              >
                Access Hardware Desk
              </button>
            </div>
          </div>

          {/* CENTRAL CHASM (100% CLEAN AND EMPTY GAP) */}
          <div id="capabilities-center-empty" className="col-span-1 lg:col-span-4 hidden lg:block h-20 select-none pointer-events-none" />

          {/* RIGHT COLUMN: INTERACTIVE TILES */}
          <div id="capabilities-right" className="col-span-1 lg:col-span-4 flex flex-col justify-center space-y-4 z-10 lg:pl-6">
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-500 block font-bold">Interact & Inspect Credentials</span>
            
            <div className="space-y-3">
              {[
                { 
                  title: 'Absolute Custody Secure', 
                  desc: 'We do not ask you to trust a website. Your sovereign multi-sig keys stay shielded inside local cryptographic enclaves.', 
                  icon: Shield 
                },
                { 
                  title: 'Secure Cold Backups', 
                  desc: 'Generate, encrypt, and shard your physical keys directly in deep offline locations with verified BIP-39 recovery enclaves.', 
                  icon: Database 
                },
                { 
                  title: 'Instant Settle Protocols', 
                  desc: 'Bypass legacy delayed settlement chains to route trades directly to on-chain pool smart contracts instantly.', 
                  icon: Zap 
                }
              ].map((cap, i) => {
                const IconComponent = cap.icon;
                return (
                  <div
                    key={i}
                    onClick={() => setActiveCapability(i)}
                    className={`border p-5 rounded-none cursor-pointer transition-all ${
                      activeCapability === i 
                        ? 'bg-[#0f0a03] border-amber-500/80 text-white' 
                        : 'bg-black border-white/10 hover:border-white/20 text-white/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-4 h-4 ${activeCapability === i ? 'text-amber-500' : 'text-neutral-500'}`} />
                        <span className="text-xs font-bold font-mono uppercase tracking-wider">{cap.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-600">[ 0{i + 1} ]</span>
                    </div>
                    {activeCapability === i && (
                      <p className="text-[11px] text-neutral-300 font-mono font-light mt-3 leading-relaxed border-t border-white/5 pt-2">
                        {cap.desc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 4: ABOUT SECTION (Symmetrical Left/Right, 100% Free Center) */}
      {/* ========================================================================= */}
      <section id="about-section" className="w-full min-h-screen flex items-center border-b border-white/5 bg-transparent py-16 lg:py-24 scroll-mt-[95px] relative z-10">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT COLUMN: SWISS VAULT HARDWARE */}
          <div id="about-left-side" className="col-span-1 lg:col-span-4 flex flex-col justify-center space-y-8 text-left z-10">
            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-amber-500 flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-none animate-pulse" />
              Alpine Key Isolation Enclaves
            </div>

            <div className="space-y-1">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[0.9] uppercase font-sans text-white">
                Swiss <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 via-neutral-400 to-neutral-700">air-gapped</span> <br />
                vaults<span className="text-amber-500">.</span>
              </h2>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed font-light tracking-wide max-w-[340px]">
              Our key infrastructure operates outside global physical networks. HSM Cryptographic cores running biometrically controlled physical locks secure custom multi-sig accounts.
            </p>

            <div className="space-y-3 pt-6 border-t border-white/10 font-mono text-[9px] text-neutral-400">
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-amber-500" />
                <span className="tracking-widest uppercase">CCSS Level III Standards Audited</span>
              </div>
              <div className="flex items-center space-x-3">
                <Cpu className="w-4 h-4 text-amber-500" />
                <span className="tracking-widest uppercase">Biometric Escrow Co-signing Hardware</span>
              </div>
            </div>
          </div>

          {/* CENTRAL CHASM (100% CLEAN AND EMPTY GAP) */}
          <div id="about-center-empty" className="col-span-1 lg:col-span-4 hidden lg:block h-20 select-none pointer-events-none" />

          {/* RIGHT COLUMN: CLI DIAGNOSTIC CONTAINER */}
          <div id="about-right-side" className="col-span-1 lg:col-span-4 flex flex-col justify-center space-y-5 text-left z-10 lg:pl-6">
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-500 block font-bold">Interactive Diagnostics Shell</span>
            
            <div className="border border-white/10 bg-black p-5 font-mono text-[10px] leading-relaxed text-neutral-450 space-y-4 shadow-xl">
              
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[8px] text-neutral-500">
                <span className="tracking-widest">DIAGNOSTIC_ENCLAVE_SHELL v1.08</span>
                <span className="text-[#00FF41] font-bold uppercase tracking-widest">Air-Gapped Core</span>
              </div>

              {/* Shell stdout logs */}
              <div className="space-y-2 min-h-[120px] max-h-[140px] overflow-y-auto">
                {terminalLogs.map((log, i) => (
                  <div key={i} className={`flex items-start gap-1.5 ${log.startsWith('[INPUT') ? 'text-white' : 'text-amber-500'}`}>
                    <span className="text-neutral-600">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>

              {/* Trigger console buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => executeDirectBtnCommand('INTEGRITY_CHECK')}
                  className="py-1.5 px-2 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 text-[8px] uppercase tracking-wider transition-all font-mono"
                >
                  [ Test Hardware Integrity ]
                </button>
                <button
                  onClick={() => executeDirectBtnCommand('PING_SWISS')}
                  className="py-1.5 px-2 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 text-[8px] uppercase tracking-wider transition-all font-mono"
                >
                  [ Ping Air-Gapped Delays ]
                </button>
              </div>

              {/* Console submit */}
              <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-1 border-t border-white/5">
                <span className="text-amber-500">core@duxica:~$</span>
                <input
                  id="command-shell-input"
                  type="text"
                  placeholder="Type HELP / STATUS / PING / CLR..."
                  value={customCommand}
                  onChange={(e) => setCustomCommand(e.target.value)}
                  className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 text-[10px] font-mono uppercase tracking-wider placeholder-white/10"
                />
              </form>

            </div>

            <div className="flex items-center justify-between text-[8px] font-mono text-neutral-600 uppercase tracking-widest">
              <span>SANDBOX STATUS: STABLE</span>
              <span>VERIFIED KEY DEPOSIT ESCROW ACTIVE</span>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 5: SERVICE SECTION (Symmetrical Left/Right, 100% Free Center) */}
      {/* ========================================================================= */}
      <section id="service-section" className="w-full min-h-screen flex items-center border-b border-white/5 bg-transparent py-16 lg:py-24 scroll-mt-[95px] relative z-10">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT COLUMN: SPEEDS & CTA */}
          <div id="service-left-side" className="col-span-1 lg:col-span-4 flex flex-col justify-center space-y-8 text-left z-10">
            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-amber-500 flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-none animate-pulse" />
              Sovereign Swap Desk Engine
            </div>

            <div className="space-y-1">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[0.9] uppercase font-sans text-white">
                Maximum <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 via-neutral-400 to-neutral-700">settle</span> <br />
                speeds<span className="text-amber-500">.</span>
              </h2>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed font-light tracking-wide max-w-[340px]">
              Complete instant swap contracts with complete slippage protections. Access unified price matrix rates bypass legacy custodian fees instantly.
            </p>

            <button
              id="btn-service-start-desk"
              onClick={() => setHudOpen(true)}
              className="py-3 px-6 bg-white hover:bg-amber-500 hover:text-black text-black font-extrabold text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center space-x-2 w-fit"
            >
              <span>Instant Escrow Swap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CENTRAL CHASM (100% CLEAN AND EMPTY GAP) */}
          <div id="service-center-empty" className="col-span-1 lg:col-span-4 hidden lg:block h-20 select-none pointer-events-none" />

          {/* RIGHT COLUMN: CALC TOOLS */}
          <div id="service-right-side" className="col-span-1 lg:col-span-4 flex flex-col justify-center space-y-4 text-left z-10 lg:pl-6">
            
            <div className="border border-white/10 bg-[#050505] p-6 rounded-none space-y-4 shadow-xl">
              
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-extrabold">Instant Deposit Converter</span>
                <span className="inline-flex items-center gap-1 text-[8px] font-mono text-emerald-400 bg-emerald-900/10 border border-emerald-500/20 px-2 py-0.5 rounded-none font-bold">
                  SWISS RATE
                </span>
              </div>

              <div className="space-y-4">
                
                {/* Deposit Value slot */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[8px] font-mono text-neutral-500 uppercase tracking-wide">
                    <span>FUNDS TRANSFER</span>
                    <button 
                      onClick={() => setQuickAmount('10000')}
                      className="text-amber-500 hover:text-white font-bold transition-colors cursor-pointer"
                    >
                      [ SET 10,000 EUR ]
                    </button>
                  </div>
                  <div className="flex items-center bg-black border border-white/10 rounded-none px-3.5 py-2.5">
                    <input
                      id="input-swap-eur-val"
                      type="number"
                      value={quickAmount}
                      onChange={(e) => setQuickAmount(e.target.value)}
                      className="w-2/3 bg-transparent text-white font-bold text-sm focus:outline-none placeholder-white/20 font-mono"
                    />
                    <span className="w-1/3 text-right font-mono text-xs text-neutral-400 font-extrabold">EUR</span>
                  </div>
                </div>

                {/* Token chooses switcher */}
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-wide block">Select Conversion Asset</span>
                  <div className="grid grid-cols-4 gap-2">
                    {(['ETH', 'BTC', 'SOL', 'DUX'] as const).map(tk => (
                      <button
                        key={tk}
                        id={`btn-select-token-sec-${tk.toLowerCase()}`}
                        onClick={() => setQuickAsset(tk)}
                        className={`py-1.5 font-mono text-[9px] font-bold border rounded-none tracking-widest transition-all cursor-pointer ${
                          quickAsset === tk 
                            ? 'bg-amber-500 text-black border-amber-500' 
                            : 'bg-black text-neutral-400 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {tk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ratio Weight Percentage slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[8px] font-mono text-neutral-500 uppercase tracking-wide">
                    <span>Leeway Weight Factor</span>
                    <span className="text-white font-bold">{swapRatio}% weight</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={swapRatio}
                    onChange={(e) => setSwapRatio(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer text-amber-500 bg-neutral-800"
                  />
                </div>

                {/* Return swap estimation */}
                <div className="bg-black p-3.5 border border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-500 text-[9px] uppercase">Final Settle Output:</span>
                  <span className="text-white font-black text-sm tracking-tight">{quickResult} {quickAsset}</span>
                </div>

              </div>

              {swapSuccessMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-[#00FF41] text-[10px] font-mono leading-relaxed uppercase">
                  ✓ {swapSuccessMsg}
                </div>
              )}

              {/* Secure Swap trade HUD button selector */}
              <button
                id="btn-trigger-calculator-hud"
                onClick={executeSimulationSwap}
                className="w-full py-3 bg-white hover:bg-amber-500 hover:text-black text-black text-[9px] uppercase tracking-[0.2em] font-black text-center transition-all rounded-none font-mono cursor-pointer"
              >
                PROCEED SECURE TRADING DISPATCH
              </button>

            </div>

            <div className="space-y-1 pt-1 font-mono text-[8px] text-neutral-500">
              <div className="flex items-center justify-between uppercase tracking-widest">
                <span>Maximum index markup swap cap</span>
                <span className="text-white font-bold">0.08% MAXIMUM</span>
              </div>
              <div className="flex items-center justify-between uppercase tracking-widest">
                <span>Settle route confirmations</span>
                <span className="text-[#00FF41] font-bold">ZRH TUNNEL LIVE</span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 6: TRUST & COMPLIANCE SECTION (Symmetrical Left/Right, 100% Free Center) */}
      {/* ========================================================================= */}
      <section id="trust-section" className="w-full min-h-screen flex items-center border-b border-white/15 bg-transparent py-16 lg:py-24 scroll-mt-[95px] relative z-10">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT COLUMN: TRUST INTRO */}
          <div id="trust-left-side" className="col-span-1 lg:col-span-4 flex flex-col justify-center space-y-8 text-left z-10">
            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-amber-500 flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-none animate-pulse" />
              Sovereign Standard Certifications
            </div>

            <div className="space-y-1">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[0.9] uppercase font-sans text-white">
                Audited <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 via-neutral-300 to-neutral-700">compliance</span> <br />
                frameworks<span className="text-amber-500">.</span>
              </h2>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed font-light tracking-wide max-w-[340px]">
              Compliance verified by international computer security panels. Our code layers are monitored 24/7/365 to verify air-gapped ledger integrity.
            </p>

            <div className="pt-6 border-t border-white/10 space-y-2">
              <p className="text-[10px] font-mono text-neutral-500 uppercase">SWITZERLAND INC REGISTERED</p>
              <p className="text-xs font-bold text-white uppercase font-mono">DUXICA AG, ZUG // CHE-419.082.502</p>
            </div>
          </div>

          {/* CENTRAL CHASM (100% CLEAN AND EMPTY GAP) */}
          <div id="trust-center-empty" className="col-span-1 lg:col-span-4 hidden lg:block h-20 select-none pointer-events-none" />

          {/* RIGHT COLUMN: INTERACTIVE ACCORDION PANELS */}
          <div id="trust-right-side" className="col-span-1 lg:col-span-4 flex flex-col justify-center space-y-4 text-left z-10 lg:pl-6">
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-500 block font-bold">Sovereign Compliance Checks</span>
            
            <div className="space-y-2.5">
              {compliances.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompliance(comp.id)}
                  className={`border p-4.5 rounded-none cursor-pointer transition-all ${
                    selectedCompliance === comp.id 
                      ? 'bg-black border-amber-500' 
                      : 'bg-[#060606] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-white">
                      {comp.title}
                    </span>
                    <span className="text-[8px] font-mono px-2 py-0.5 bg-neutral-900 border border-white/15 text-amber-500 font-bold uppercase tracking-widest">
                      {comp.status}
                    </span>
                  </div>
                  
                  {selectedCompliance === comp.id && (
                    <p className="text-[10.5px] font-mono text-neutral-400 mt-3 leading-relaxed border-t border-white/5 pt-2.5 font-light">
                      {comp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <p className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest mt-1">
              ✓ All compliances are monitored on-chain continuously.
            </p>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* COMPREHENSIVE MULTI-COLUMN SITEMAP FOOTER (CENTER CHASM PRESERVED) */}
      {/* ========================================================================= */}
      <footer id="app-footer" className="w-full z-10 border-t border-white/10 bg-black pt-16 pb-12 relative">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* ==================== FOOTER LEFT SECTION (lg:col-span-4) ==================== */}
          <div className="col-span-1 lg:col-span-4 flex flex-col space-y-8 text-left">
            <div>
              <span className="text-[14px] font-black tracking-[-0.03em] text-[#FF6B00]">DUXICA.SYS</span>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mt-1">COGNITIVE CONSORTIUM PLATFORM</span>
              <p className="text-[11px] text-neutral-500 font-mono mt-3 leading-relaxed font-light max-w-[280px]">
                High-altitude cryptographic asset escrow enclaves built above physical Swiss bedrock. Sovereign trades on your own parameters.
              </p>
            </div>

            {/* Sitemap Columns: Left-Fringed lists */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div>
                <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-wider block mb-3">01 // PLATFORM</span>
                <ul className="space-y-2 text-[10.5px] font-mono text-neutral-400">
                  <li><button onClick={() => setHudOpen(true)} className="hover:text-amber-500 transition-colors cursor-pointer text-left">[ Swap Desk ]</button></li>
                  <li><button onClick={() => scrollToSection('integrations-section')} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Integrated Shards</button></li>
                  <li><button onClick={() => scrollToSection('capabilities-section')} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Enclaves Status</button></li>
                  <li><button onClick={() => setHudOpen(true)} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Escrow Pools</button></li>
                </ul>
              </div>

              <div>
                <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-wider block mb-3">02 // ESCROW COINS</span>
                <ul className="space-y-2 text-[10.5px] font-mono text-neutral-400">
                  <li><button onClick={() => { setActiveTickerSymbol('BTC'); scrollToSection('home-section'); }} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Bitcoin Index</button></li>
                  <li><button onClick={() => { setActiveTickerSymbol('ETH'); scrollToSection('home-section'); }} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Ethereum Index</button></li>
                  <li><button onClick={() => { setActiveTickerSymbol('SOL'); scrollToSection('home-section'); }} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Solana Index</button></li>
                  <li><button onClick={() => { setActiveTickerSymbol('DUX'); scrollToSection('home-section'); }} className="hover:text-amber-500 transition-colors cursor-pointer text-left">Duxica Coin</button></li>
                </ul>
              </div>
            </div>

            {/* LIVE UTC CHRONO */}
            <div className="pt-6 border-t border-white/5 flex flex-col space-y-1">
              <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500 animate-spin-slow" /> LIVE Switzerland ENCLAVE CHRONO
              </span>
              <span className="text-white font-black tracking-widest font-mono text-[12px] bg-neutral-950 border border-white/10 px-3 py-1.5 w-fit">
                {gmtTime}
              </span>
            </div>
          </div>

          {/* ==================== FOOTER CENTER CHASM (lg:col-span-4) ==================== */}
          {/* 100% Perfectly Clean Black Gap! Strictly no links, no text, no visual noise. Keeping the alignment pristine. */}
          <div id="footer-center-empty" className="col-span-1 lg:col-span-4 hidden lg:block select-none pointer-events-none" />

          {/* ==================== FOOTER RIGHT SECTION (lg:col-span-4) ==================== */}
          <div className="col-span-1 lg:col-span-4 flex flex-col space-y-8 text-left lg:text-right lg:items-end">
            
            {/* Live responsive waves traffic analyzer visualizer */}
            <div className="space-y-2 w-full lg:max-w-[320px]">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-500 block lg:text-right font-bold">Consortium Swiss Pipeline Traffic Activity Scanner</span>
              <div className="flex items-end space-x-1 h-10 px-3 border border-white/5 bg-[#030303] justify-center py-1 rounded-none w-full" title="Continuous telemetries load analysis">
                {spectrumBars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-amber-500 transition-all duration-300 rounded-none cursor-pointer hover:bg-white"
                    style={{ 
                      height: `${h}%`,
                      opacity: i % 2 === 0 ? 0.92 : 0.45
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Sitemap Columns: Right-Fringed lists */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5 w-full text-left lg:text-right lg:justify-items-end">
              <div>
                <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-wider block mb-3 lg:text-right">03 // SOVEREIGN SECURITY</span>
                <ul className="space-y-2 text-[10.5px] font-mono text-neutral-400">
                  <li><button onClick={() => scrollToSection('about-section')} className="hover:text-amber-500 transition-colors cursor-pointer text-left lg:text-right">[ Biometric HSM Enclaves ]</button></li>
                  <li><button onClick={() => scrollToSection('trust-section')} className="hover:text-amber-500 transition-colors cursor-pointer text-left lg:text-right">SOC-2 Audited Rules</button></li>
                  <li><button onClick={() => scrollToSection('about-section')} className="hover:text-amber-500 transition-colors cursor-pointer text-left lg:text-right">Air-Gapped Keys</button></li>
                  <li><button onClick={() => scrollToSection('trust-section')} className="hover:text-amber-500 transition-colors cursor-pointer text-left lg:text-right">Compliance Proofs</button></li>
                </ul>
              </div>

              <div>
                <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-wider block mb-3 lg:text-right">04 // CORPORATE</span>
                <ul className="space-y-2 text-[10.5px] font-mono text-neutral-400">
                  <li><button onClick={() => scrollToSection('about-section')} className="hover:text-amber-500 transition-colors cursor-pointer text-left lg:text-right">Swiss Bedrock Vault</button></li>
                  <li><a href="#about-section" className="hover:text-amber-500 transition-colors text-left lg:text-right">Consortium About</a></li>
                  <li><a href="#service-section" className="hover:text-amber-500 transition-colors text-left lg:text-right">Sovereign Terms</a></li>
                  <li><a href="#trust-section" className="hover:text-amber-500 transition-colors text-left lg:text-right">Core Privacy Safeguards</a></li>
                </ul>
              </div>
            </div>

            {/* Safety validations status marks */}
            <div className="flex flex-col lg:items-end gap-1 pt-4 border-t border-white/5 w-full">
              <div id="footer-sync-status" className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#00FF41] font-bold">
                <span className="w-1.5 h-1.5 rounded-none bg-[#00FF41] shadow-[0_0_8px_#00FF41] inline-block animate-pulse" />
                <span>CONSENSUS LOCK: Swiss Bedrock Enclave fully Active</span>
              </div>
              <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">
                DUXICA AG, ZUG, SWITZERLAND. LICENSE ID: CHE-419.082.502 // © 2026. ALL SOVEREIGN RIGHTS RESERVED.
              </span>
            </div>
          </div>

        </div>
      </footer>

      {/* Renders the beautifully detailed escrow trading HUD overlay workspace */}
      <HudOverlay 
        isOpen={hudOpen} 
        onClose={() => setHudOpen(false)} 
      />

    </div>
  );
}
