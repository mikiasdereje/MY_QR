import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Wallet, ArrowDownUp, RefreshCw, Layers, TrendingUp, Sparkles, CheckCircle2, AlertCircle, Coins, Cpu, Globe, ArrowUpRight, Radio 
} from 'lucide-react';

interface HudOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Token {
  symbol: string;
  name: string;
  priceEUR: number;
  change24h: number;
  color: string;
}

const TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', priceEUR: 3120.45, change24h: 3.42, color: 'from-blue-400 to-indigo-500' },
  { symbol: 'BTC', name: 'Bitcoin', priceEUR: 78450.20, change24h: 1.85, color: 'from-yellow-400 to-amber-600' },
  { symbol: 'SOL', name: 'Solana', priceEUR: 165.80, change24h: 8.12, color: 'from-purple-400 to-fuchsia-600' },
  { symbol: 'DUX', name: 'Duxica Token', priceEUR: 2.75, change24h: 12.45, color: 'from-cyan-400 to-teal-500' },
];

export default function HudOverlay({ isOpen, onClose }: HudOverlayProps) {
  const [walletState, setWalletState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [walletType, setWalletType] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0]);
  const [payAmount, setPayAmount] = useState<string>('1000');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState('');
  const [activeTab, setActiveTab] = useState<'swap' | 'market' | 'wallet'>('swap');
  
  // Simulated streaming data
  const [priceHistory, setPriceHistory] = useState<number[]>([100, 105, 103, 110, 108, 115, 112, 120, 118, 125, 122, 130]);
  const [activeOrders, setActiveOrders] = useState<Array<{ id: number; type: 'buy' | 'sell'; price: number; amount: string; time: string }>>([]);

  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate swap receive amount
  useEffect(() => {
    if (!payAmount || isNaN(Number(payAmount))) {
      setReceiveAmount('0.00');
      return;
    }
    const payNum = Number(payAmount);
    // Commission is <0.10% (say 0.08%)
    const fee = payNum * 0.0008;
    const finalPay = payNum - fee;
    const coinQty = finalPay / selectedToken.priceEUR;
    setReceiveAmount(coinQty.toFixed(6));
  }, [payAmount, selectedToken]);

  // Handle stream simulation
  useEffect(() => {
    if (isOpen) {
      // Initialize orders
      const seedOrders = Array.from({ length: 6 }).map((_, i) => ({
        id: Math.random(),
        type: Math.random() > 0.45 ? 'buy' : 'sell' as 'buy' | 'sell',
        price: selectedToken.priceEUR * (1 + (Math.random() - 0.5) * 0.004),
        amount: (Math.random() * 2.5 + 0.1).toFixed(4),
        time: new Date(Date.now() - i * 4000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }));
      setActiveOrders(seedOrders);

      streamIntervalRef.current = setInterval(() => {
        // Dynamic price ticking
        setPriceHistory(prev => {
          const nextVal = prev[prev.length - 1] * (1 + (Math.random() - 0.49) * 0.02);
          const sliced = prev.length > 20 ? prev.slice(1) : prev;
          return [...sliced, nextVal];
        });

        // Add a new order
        setActiveOrders(prev => {
          const newOrder = {
            id: Math.random(),
            type: Math.random() > 0.48 ? ('buy' as const) : ('sell' as const),
            price: selectedToken.priceEUR * (1 + (Math.random() - 0.5) * 0.003),
            amount: (Math.random() * 4 + 0.05).toFixed(4),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          };
          return [newOrder, ...prev.slice(0, 5)];
        });
      }, 2500);
    }

    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, [isOpen, selectedToken]);

  const handleConnectWallet = (type: string) => {
    setWalletState('connecting');
    setWalletType(type);
    setTimeout(() => {
      setWalletState('connected');
      const randomHex = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setWalletAddress(`0x${randomHex.substring(0, 4)}...${randomHex.substring(4)}`);
    }, 1200);
  };

  const handleDisconnect = () => {
    setWalletState('disconnected');
    setWalletAddress('');
    setWalletType('');
  };

  const handleSwap = () => {
    if (walletState !== 'connected') {
      setActiveTab('wallet');
      return;
    }
    if (!payAmount || Number(payAmount) <= 0) return;

    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setSwapSuccess(true);
      const randomTx = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setSuccessTxHash(randomTx.substring(0, 10) + '...' + randomTx.substring(26));
    }, 1800);
  };

  // SVG Line Render
  const renderChartLine = () => {
    if (priceHistory.length === 0) return '';
    const width = 500;
    const height = 140;
    const min = Math.min(...priceHistory);
    const max = Math.max(...priceHistory);
    const range = max - min || 1;
    
    return priceHistory.map((val, index) => {
      const x = (index / (priceHistory.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 20) - 10;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="hud-overlay-container" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          
          {/* Main Panel Box */}
          <motion.div 
            id="hud-panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-gradient-to-b from-[#0a0a0c] to-[#040405] border border-neutral-800/80 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(30,58,138,0.15)] flex flex-col md:flex-row"
          >
            {/* Ambient inner glow particle visual */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Left Column - Dynamic Tools Interface */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col border-b md:border-b-0 md:border-r border-neutral-800/85">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Cpu id="cpu-icon" className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 id="panel-title" className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                      Duxica Swap Desk 
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 gap-1">
                        <Radio className="w-2.5 h-2.5 animate-pulse" /> Live
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400">High-efficiency direct execution matrix</p>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex space-x-1.5 bg-neutral-900/60 p-1 rounded-xl mb-6 border border-neutral-800/40">
                <button
                  id="tab-swap"
                  onClick={() => { setActiveTab('swap'); setSwapSuccess(false); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'swap' 
                      ? 'bg-neutral-800 text-white shadow-sm' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Swap Core
                </button>
                <button
                  id="tab-market"
                  onClick={() => setActiveTab('market')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'market' 
                      ? 'bg-neutral-800 text-white shadow-sm' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Market Signals
                </button>
                <button
                  id="tab-wallet"
                  onClick={() => setActiveTab('wallet')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'wallet' 
                      ? 'bg-neutral-800 text-white shadow-sm' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Wallet Hub {walletState === 'connected' && '●'}
                </button>
              </div>

              {/* Content Panel */}
              <div className="flex-1 flex flex-col justify-between">
                
                {/* SWAP TAB CONTENT */}
                {activeTab === 'swap' && (
                  <div className="space-y-4">
                    {!swapSuccess ? (
                      <>
                        {/* Selector Token List (Horizontal) */}
                        <div>
                          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">Select Target asset</label>
                          <div className="grid grid-cols-4 gap-2">
                            {TOKENS.map((token) => (
                              <button
                                id={`token-select-${token.symbol.toLowerCase()}`}
                                key={token.symbol}
                                onClick={() => setSelectedToken(token)}
                                className={`p-2.5 rounded-xl border text-center transition-all ${
                                  selectedToken.symbol === token.symbol
                                    ? 'border-blue-500/50 bg-blue-500/10 text-white'
                                    : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:border-neutral-700 hover:text-white'
                                }`}
                              >
                                <div className="text-xs font-bold">{token.symbol}</div>
                                <div className={`text-[10px] font-mono ${token.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Pay Inputs */}
                        <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/40 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">You Send (Est. Value)</span>
                            <span className="text-[11px] text-neutral-500 font-mono">Broker: EUR (Euro)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <input
                              id="input-pay-amount"
                              type="number"
                              value={payAmount}
                              onChange={(e) => setPayAmount(e.target.value)}
                              placeholder="0.00"
                              className="bg-transparent text-xl font-bold font-mono text-white outline-none w-2/3 border-b border-transparent focus:border-neutral-800 transition-all"
                            />
                            <span className="font-bold text-sm bg-neutral-900 px-3 py-1.5 rounded-lg text-neutral-300 border border-neutral-800">EUR</span>
                          </div>
                        </div>

                        {/* Middle Arrow decoration */}
                        <div className="flex justify-center -my-2.5 relative z-10">
                          <div className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-blue-400 cursor-pointer shadow hover:text-blue-300 transition-all">
                            <ArrowDownUp className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Receive Inputs */}
                        <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/40 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">You Receive (Simulated)</span>
                            <span className="text-[11px] text-neutral-500 font-mono">1 {selectedToken.symbol} ≈ €{selectedToken.priceEUR.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-bold font-mono text-white tracking-tight">
                              {receiveAmount || '0.00'}
                            </div>
                            <span className={`font-bold text-sm bg-gradient-to-r ${selectedToken.color} text-black px-3 py-1.5 rounded-lg`}>
                              {selectedToken.symbol}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2">
                          {walletState !== 'connected' ? (
                            <button
                              id="btn-hud-connect-prompt"
                              type="button"
                              onClick={() => setActiveTab('wallet')}
                              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-[0_4px_20px_rgba(59,130,246,0.25)] flex items-center justify-center space-x-2 text-sm"
                            >
                              <Wallet className="w-4 h-4" />
                              <span>Connect Wallet to Trade</span>
                            </button>
                          ) : (
                            <button
                              id="btn-hud-execute"
                              type="button"
                              disabled={isSwapping || !payAmount || Number(payAmount) <= 0}
                              onClick={handleSwap}
                              className={`w-full py-4 px-6 font-bold rounded-2xl transition-all flex items-center justify-center space-x-2 text-sm ${
                                isSwapping 
                                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                  : 'bg-white text-black hover:bg-neutral-100 shadow-[0_4px_20px_rgba(255,255,255,0.15)]'
                              }`}
                            >
                              {isSwapping ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin text-neutral-500" />
                                  <span>Executing Atomic Swap...</span>
                                </>
                              ) : (
                                <>
                                  <Coins className="w-4 h-4 text-black" />
                                  <span>Instant Swap {selectedToken.symbol}</span>
                                </>
                              )}
                            </button>
                          )}
                          <p className="text-[10px] text-neutral-500 text-center mt-3 font-mono">
                            Duxica network protocol fee is capped at exactly <span className="text-neutral-400 font-bold">0.08%</span> (€{(Number(payAmount) * 0.0008 || 0).toFixed(2)})
                          </p>
                        </div>
                      </>
                    ) : (
                      /* SWAP SUCCESS DISPLAY */
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6 px-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-4"
                      >
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-base">Receipt Synced Successfully</h4>
                          <p className="text-xs text-neutral-400">Order successfully matched globally on the blockchain ledger</p>
                        </div>

                        <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/40 text-left space-y-2 font-mono text-xs">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Converted Amount:</span>
                            <span className="text-white font-bold">{payAmount} EUR</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Received Asset:</span>
                            <span className="text-white font-bold">{receiveAmount} {selectedToken.symbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Network Host fee:</span>
                            <span className="text-emerald-400">0.08% (€{(Number(payAmount) * 0.0008).toFixed(2)})</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-neutral-800/80">
                            <span className="text-neutral-500">Transaction ID:</span>
                            <span className="text-blue-400 text-[11px] select-all font-mono">{successTxHash}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            id="btn-hud-reset"
                            onClick={() => { setSwapSuccess(false); setPayAmount('1000'); }}
                            className="flex-1 py-2.5 px-4 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white font-bold text-xs rounded-xl transition-all"
                          >
                            New Swap Or Transfer
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* SIGNALS/MARKET TAB CONTENT */}
                {activeTab === 'market' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Dynamic Market Tick</h4>
                      <p className="text-[11px] text-neutral-500">Price trend updates for mock network feed: <b>{selectedToken.name} ({selectedToken.symbol})</b></p>
                    </div>

                    {/* SVG Interactive Chart Card */}
                    <div className="bg-neutral-950 p-4 border border-neutral-800/80 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 text-[10px] text-blue-400 font-mono">
                        <TrendingUp className="w-3 h-3" />
                        <span>Live Tracking</span>
                      </div>

                      <div className="h-32 w-full pt-4">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 140" preserveAspectRatio="none">
                          {/* Grid lines */}
                          <line x1="0" y1="20" x2="500" y2="20" stroke="#1d1d21" strokeDasharray="3,3" />
                          <line x1="0" y1="70" x2="500" y2="70" stroke="#1d1d21" strokeDasharray="3,3" />
                          <line x1="0" y1="120" x2="500" y2="120" stroke="#1d1d21" strokeDasharray="3,3" />
                          
                          {/* Dynamic SVG Path */}
                          <motion.path 
                            d={renderChartLine()}
                            fill="none"
                            stroke="url(#chart-glow-gradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1 }}
                          />

                          {/* Glow definitions */}
                          <defs>
                            <linearGradient id="chart-glow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="50%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#c084fc" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>

                      {/* Chart Info */}
                      <div className="flex justify-between items-center mt-3 text-[10px] font-mono text-neutral-400 bg-neutral-900/40 p-1.5 rounded-lg">
                        <span>Min: €{(selectedToken.priceEUR * 0.95).toFixed(2)}</span>
                        <span className="text-white font-bold">Curr: €{selectedToken.priceEUR.toLocaleString()}</span>
                        <span>Max: €{(selectedToken.priceEUR * 1.05).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Technical signals overview list */}
                    <div className="bg-[#050506] border border-neutral-800/40 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1.5 text-neutral-400">
                          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                          <span>Duxica Aligned Rating:</span>
                        </div>
                        <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] border border-emerald-500/20">STRONG BUY</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                        <span>24h High: €{(selectedToken.priceEUR * 1.034).toFixed(2)}</span>
                        <span>24h Low: €{(selectedToken.priceEUR * 0.978).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* WALLET INTEGRATOR TAB CONTENT */}
                {activeTab === 'wallet' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Secure Node Connection</h4>
                      <p className="text-[11px] text-neutral-500">Connect a secure system authorization protocol to start atomic swaps</p>
                    </div>

                    {walletState === 'disconnected' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                          id="btn-wallet-metamask"
                          onClick={() => handleConnectWallet('MetaMask Ledger')}
                          className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-950 hover:bg-neutral-900 hover:border-neutral-700 transition-all text-center flex flex-col items-center justify-center space-y-2 cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                            <span className="font-bold text-xs">MM</span>
                          </div>
                          <span className="text-xs font-bold text-white">MetaMask</span>
                        </button>

                        <button
                          id="btn-wallet-walletconnect"
                          onClick={() => handleConnectWallet('WalletConnect Secure')}
                          className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-950 hover:bg-neutral-900 hover:border-neutral-700 transition-all text-center flex flex-col items-center justify-center space-y-2 cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                            <Globe className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-white">WalletConnect</span>
                        </button>

                        <button
                          id="btn-wallet-ledger"
                          onClick={() => handleConnectWallet('Ledger Hardware Port')}
                          className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-950 hover:bg-neutral-900 hover:border-neutral-700 transition-all text-center flex flex-col items-center justify-center space-y-2 cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                            <Cpu className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-white">Ledger Node</span>
                        </button>
                      </div>
                    ) : walletState === 'connecting' ? (
                      <div className="py-10 text-center space-y-4">
                        <RefreshCw className="w-10 h-10 animate-spin text-blue-400 mx-auto" />
                        <div className="space-y-1">
                          <h5 className="font-bold text-sm text-white">Authenticating Handshake Key</h5>
                          <p className="text-xs text-neutral-500">Synchronizing authorization certificates over {walletType}...</p>
                        </div>
                      </div>
                    ) : (
                      /* CONNECTED STATE */
                      <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs text-neutral-400 block font-bold uppercase tracking-wider">Node Secure Access Granted</span>
                            <span className="text-sm font-bold text-white font-mono">{walletAddress}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-neutral-400 border-t border-neutral-800/60 pt-3 font-mono">
                          <span>Security Protocol: SSL/ED25519</span>
                          <span>Address Type: {walletType}</span>
                        </div>

                        <div className="flex space-x-2 pt-1">
                          <button
                            id="btn-hud-disconnect"
                            onClick={handleDisconnect}
                            className="flex-1 py-2 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs rounded-xl transition-all"
                          >
                            Disconnect Port Key
                          </button>
                          <button
                            id="btn-hud-go-swap"
                            onClick={() => setActiveTab('swap')}
                            className="flex-1 py-2 px-4 bg-white hover:bg-neutral-100 text-black font-bold text-xs rounded-xl transition-all"
                          >
                            Return to Swap Core
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Live Active Ledger Orderbook Feed */}
            <div className="w-full md:w-80 p-6 sm:p-8 bg-neutral-950/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">Ledger Stream</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>

                {/* Simulated Order List */}
                <div className="space-y-2.5">
                  {activeOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="p-2.5 rounded-xl bg-neutral-900/40 border border-neutral-800/30 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-1.5 mb-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${order.type === 'buy' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span className="font-semibold">{order.type === 'buy' ? 'BUY LIMIT' : 'SELL LIMIT'}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono">Vol: {order.amount} {selectedToken.symbol}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold block font-mono">€{order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className="text-[9px] text-neutral-500 font-mono block">{order.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical indicators footer */}
              <div className="border-t border-neutral-800/80 pt-4 mt-6 text-xs text-neutral-400 font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span>Latency Rate:</span>
                  <span className="text-emerald-400 font-mono text-right">0.05ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Health:</span>
                  <span className="text-neutral-200 font-mono text-right">99.999% secure</span>
                </div>
                <div className="flex justify-between">
                  <span>Gas Cost index:</span>
                  <span className="text-blue-400 font-mono text-right">OPTIMAL</span>
                </div>
              </div>
            </div>

            {/* Close Button top-right corner over absolutely-placed screen anchor */}
            <button
              id="btn-hud-close"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all z-20 cursor-pointer"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
