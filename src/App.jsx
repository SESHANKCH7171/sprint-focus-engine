import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Lock, Unlock, Play, Pause, RotateCcw, SkipForward,
    ChevronLeft, ChevronRight, Settings, ShieldAlert, CheckCircle2,
    Minimize2, Maximize2, Flame, Calendar, Clock, Sparkles
} from 'lucide-react';

// --- TIME WISDOM QUOTES ---
const QUOTES = [
    { text: "You could be good today, but instead you choose tomorrow.", author: "Marcus Aurelius" },
    { text: "We must all suffer one of two things: the pain of discipline or the pain of regret.", author: "Jim Rohn" },
    { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
    { text: "Time is what we want most, but what we use worst.", author: "William Penn" },
    { text: "The trouble is, you think you have time.", author: "Jack Kornfield" },
    { text: "Dost thou love life? Then do not squander time, for that's the stuff life is made of.", author: "Benjamin Franklin" },
    { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
    { text: "Action expresses priorities.", author: "Mahatma Gandhi" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs" },
    { text: "Lack of direction, not lack of time, is the problem. We all have twenty-four hour days.", author: "Zig Ziglar" },
    { text: "He who hesitates is lost.", author: "Proverb" },
    { text: "The bad news is time flies. The good news is you're the pilot.", author: "Michael Altshuler" },
    { text: "Do not wait; the time will never be 'just right'.", author: "Napoleon Hill" },
    { text: "Regret for wasted time is more wasted time.", author: "Mason Cooley" },
    { text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
    { text: "Someday is not a day of the week.", author: "Janet Dailey" },
    { text: "Every morning you have two choices: continue to sleep with your dreams, or wake up and chase them.", author: "Unknown" },
    { text: "Eighteen days of relentless discipline will outwork months of unfocused intention.", author: "Focus Creed" }
];

// Cryptographic hash helper
async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Two-tone Web Audio Chime (no external MP3 required)
function playTwoToneChime() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const now = ctx.currentTime;

        // Tone 1: 523.25 Hz (C5)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.frequency.setValueAtTime(523.25, now);
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.35);

        // Tone 2: 783.99 Hz (G5)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.frequency.setValueAtTime(783.99, now + 0.18);
        gain2.gain.setValueAtTime(0.25, now + 0.18);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.18);
        osc2.stop(now + 0.65);
    } catch (e) {
        console.error("Audio chime error:", e);
    }
}

export default function App() {
    // ----------------------------------------------------
    // 1. DYNAMIC MACRO SPRINT & CAMPAIGN ENGINE
    // ----------------------------------------------------
    const [campaignName, setCampaignName] = useState(() => {
        return localStorage.getItem('sprint_campaign_name') || 'September Mastery Sprint';
    });

    const [macroStart, setMacroStart] = useState(() => {
        const stored = localStorage.getItem('sprint_start_timestamp');
        if (stored) return parseInt(stored, 10);
        // Default start: Today at 00:00:00 (Sep 12, 2026)
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        const now = d.getTime();
        localStorage.setItem('sprint_start_timestamp', now);
        return now;
    });

    const [macroTarget, setMacroTarget] = useState(() => {
        const stored = localStorage.getItem('sprint_target_timestamp');
        if (stored) return parseInt(stored, 10);
        // Default target: Sep 30, 2026 23:59:59 (18-Day Sprint)
        const target = new Date(2026, 8, 30, 23, 59, 59, 999).getTime();
        localStorage.setItem('sprint_target_timestamp', target);
        return target;
    });

    const [macroTimeLeft, setMacroTimeLeft] = useState(macroTarget - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setMacroTimeLeft(macroTarget - Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, [macroTarget]);

    const macroStats = useMemo(() => {
        const totalDuration = Math.max(1000, macroTarget - macroStart);
        const elapsed = Math.max(0, Date.now() - macroStart);
        const remaining = Math.max(0, macroTarget - Date.now());

        const progress = totalDuration > 0
            ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)).toFixed(1)
            : 100;

        const totalDays = Math.max(1, Math.ceil(totalDuration / (24 * 60 * 60 * 1000)));
        const currentDay = Math.min(totalDays, Math.floor(elapsed / (24 * 60 * 60 * 1000)) + 1);

        const totalRemainingSec = Math.floor(remaining / 1000);
        const d = Math.floor(totalRemainingSec / (60 * 60 * 24));
        const h = Math.floor((totalRemainingSec % (60 * 60 * 24)) / (60 * 60));
        const m = Math.floor((totalRemainingSec % (60 * 60)) / 60);
        const s = totalRemainingSec % 60;

        // Context breakdown for long-term multi-month / multi-year campaigns
        const years = Math.floor(d / 365);
        const remDaysAfterYears = d % 365;
        const months = Math.floor(remDaysAfterYears / 30);
        const daysInMonth = remDaysAfterYears % 30;

        let contextSummary = '';
        if (years > 0) {
            contextSummary = `${years}y ${months}mo ${daysInMonth}d`;
        } else if (months > 0) {
            contextSummary = `${months}mo ${daysInMonth}d`;
        } else {
            contextSummary = `${d}d ${h}h`;
        }

        const targetDateObj = new Date(macroTarget);
        const formattedTarget = targetDateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        return {
            progress,
            totalDays,
            currentDay,
            d,
            h,
            m,
            s,
            years,
            months,
            daysInMonth,
            contextSummary,
            formattedTarget,
            isFinished: remaining <= 0
        };
    }, [macroStart, macroTarget, macroTimeLeft]);

    // ----------------------------------------------------
    // 2. UNTHROTTLED POMODORO / WORKSPACE TIMER
    // ----------------------------------------------------
    const [mode, setMode] = useState('work'); // 'work' | 'short' | 'long' | 'custom'
    const [customMinutes, setCustomMinutes] = useState(45);
    const [remainingMs, setRemainingMs] = useState(25 * 60 * 1000);
    const [isActive, setIsActive] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(() => {
        return parseInt(localStorage.getItem('sessions_completed') || '0', 10);
    });

    const endTimeRef = useRef(null);
    const workerRef = useRef(null);

    // Initialize inline Web Worker to avoid background tab throttling
    useEffect(() => {
        const workerCode = `
      let timer = null;
      self.onmessage = function(e) {
        if (e.data === 'START') {
          if (!timer) {
            timer = setInterval(() => self.postMessage('TICK'), 250);
          }
        } else if (e.data === 'STOP') {
          clearInterval(timer);
          timer = null;
        }
      };
    `;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        workerRef.current = new Worker(URL.createObjectURL(blob));

        workerRef.current.onmessage = () => {
            if (!endTimeRef.current) return;
            const rem = Math.max(0, endTimeRef.current - Date.now());
            setRemainingMs(rem);

            if (rem <= 0) {
                setIsActive(false);
                workerRef.current.postMessage('STOP');
                endTimeRef.current = null;
                playTwoToneChime();
                if (mode === 'work' || mode === 'custom') {
                    setSessionsCompleted(prev => {
                        const next = prev + 1;
                        localStorage.setItem('sessions_completed', next);
                        return next;
                    });
                }
            }
        };

        return () => {
            if (workerRef.current) workerRef.current.terminate();
        };
    }, [mode]);

    // Re-sync immediately on tab switch
    useEffect(() => {
        const handleVisibility = () => {
            if (!document.hidden && isActive && endTimeRef.current) {
                setRemainingMs(Math.max(0, endTimeRef.current - Date.now()));
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [isActive]);

    // Dynamic Browser Title
    useEffect(() => {
        const totalSec = Math.ceil(remainingMs / 1000);
        const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
        const s = (totalSec % 60).toString().padStart(2, '0');
        document.title = isActive ? `(${m}:${s}) Focus Sprint` : '18-Day Locked Sprint';
    }, [remainingMs, isActive]);

    const selectMode = (newMode) => {
        setIsActive(false);
        workerRef.current?.postMessage('STOP');
        endTimeRef.current = null;
        setMode(newMode);

        let ms = 25 * 60 * 1000;
        if (newMode === 'short') ms = 5 * 60 * 1000;
        if (newMode === 'long') ms = 15 * 60 * 1000;
        if (newMode === 'custom') ms = customMinutes * 60 * 1000;
        setRemainingMs(ms);
    };

    const toggleTimer = () => {
        if (isActive) {
            // Pause
            setIsActive(false);
            workerRef.current?.postMessage('STOP');
            endTimeRef.current = null;
        } else {
            // Start
            const targetTime = Date.now() + remainingMs;
            endTimeRef.current = targetTime;
            setIsActive(true);
            workerRef.current?.postMessage('START');
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        workerRef.current?.postMessage('STOP');
        endTimeRef.current = null;
        selectMode(mode);
    };

    const handleCustomMinuteChange = (val) => {
        const parsed = Math.min(180, Math.max(1, parseInt(val, 10) || 1));
        setCustomMinutes(parsed);
        if (mode === 'custom') {
            setIsActive(false);
            workerRef.current?.postMessage('STOP');
            endTimeRef.current = null;
            setRemainingMs(parsed * 60 * 1000);
        }
    };

    // ----------------------------------------------------
    // 3. TIME WISDOM SLIDESHOW CAROUSEL
    // ----------------------------------------------------
    const [quoteIdx, setQuoteIdx] = useState(0);
    const [isQuoteHovered, setIsQuoteHovered] = useState(false);

    useEffect(() => {
        if (isQuoteHovered) return;
        const interval = setInterval(() => {
            setQuoteIdx(prev => (prev + 1) % QUOTES.length);
        }, 12000);
        return () => clearInterval(interval);
    }, [isQuoteHovered]);

    // ----------------------------------------------------
    // 4. ADMIN ACCESS MODAL LOGIC
    // ----------------------------------------------------
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [enteredPin, setEnteredPin] = useState('');
    const [authError, setAuthError] = useState('');
    const [newPin, setNewPin] = useState('');
    const [customDays, setCustomDays] = useState(18);

    // ----------------------------------------------------
    // 5. COMPACT WIDGET MODE (2x2 PHONE WIDGET VIEW)
    // ----------------------------------------------------
    const [isWidgetMode, setIsWidgetMode] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('mode') === 'widget') return true;
        return localStorage.getItem('focus_engine_mode') === 'widget';
    });

    const toggleWidgetMode = () => {
        setIsWidgetMode(prev => {
            const next = !prev;
            localStorage.setItem('focus_engine_mode', next ? 'widget' : 'full');
            return next;
        });
    };

    // ----------------------------------------------------
    // 6. TARGET DEADLINE & CAMPAIGN MODAL STATE
    // ----------------------------------------------------
    const [showDateModal, setShowDateModal] = useState(false);
    const [targetDateInput, setTargetDateInput] = useState('');
    const [targetTimeInput, setTargetTimeInput] = useState('23:59');
    const [campaignNameInput, setCampaignNameInput] = useState('');
    const [resetStartToNow, setResetStartToNow] = useState(false);

    const openDateModal = () => {
        const d = new Date(macroTarget);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setTargetDateInput(`${yyyy}-${mm}-${dd}`);
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        setTargetTimeInput(`${hh}:${min}`);
        setCampaignNameInput(campaignName);
        setResetStartToNow(false);
        setShowDateModal(true);
    };

    const applyPreset = (presetKey) => {
        const now = new Date();
        let target = new Date();
        let name = campaignNameInput;

        if (presetKey === 'sept30') {
            target = new Date(2026, 8, 30, 23, 59, 59);
            name = "18-Day September Sprint";
        } else if (presetKey === '7d') {
            target = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            target.setHours(23, 59, 59, 999);
            name = "7-Day Power Sprint";
        } else if (presetKey === '14d') {
            target = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
            target.setHours(23, 59, 59, 999);
            name = "14-Day Lock-In Sprint";
        } else if (presetKey === '30d') {
            target = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            target.setHours(23, 59, 59, 999);
            name = "30-Day Focus Sprint";
        } else if (presetKey === 'endOfMonth') {
            target = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            name = "Monthly Milestone Sprint";
        } else if (presetKey === 'endOfYear') {
            target = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
            name = `${now.getFullYear()} Year-End Mission`;
        }

        const yyyy = target.getFullYear();
        const mm = String(target.getMonth() + 1).padStart(2, '0');
        const dd = String(target.getDate()).padStart(2, '0');
        setTargetDateInput(`${yyyy}-${mm}-${dd}`);
        setTargetTimeInput("23:59");
        setCampaignNameInput(name);
        setResetStartToNow(true);
    };

    const handleSaveTargetDate = (e) => {
        e.preventDefault();
        if (!targetDateInput) return;
        const [year, month, day] = targetDateInput.split('-').map(Number);
        const [hours, minutes] = (targetTimeInput || '23:59').split(':').map(Number);
        const newTarget = new Date(year, month - 1, day, hours, minutes, 59, 999).getTime();

        if (isNaN(newTarget)) return;

        if (resetStartToNow || newTarget <= macroStart) {
            const now = Date.now();
            localStorage.setItem('sprint_start_timestamp', now);
            setMacroStart(now);
        }

        localStorage.setItem('sprint_target_timestamp', newTarget);
        setMacroTarget(newTarget);

        const finalName = campaignNameInput.trim() || 'Locked Sprint Campaign';
        localStorage.setItem('sprint_campaign_name', finalName);
        setCampaignName(finalName);

        setShowDateModal(false);
    };

    // Live calculations for date modal preview
    const previewData = useMemo(() => {
        if (!targetDateInput) return null;
        try {
            const [y, m, d] = targetDateInput.split('-').map(Number);
            const [hh, mm] = (targetTimeInput || '23:59').split(':').map(Number);
            const targetTs = new Date(y, m - 1, d, hh, mm, 59).getTime();
            const startTs = resetStartToNow ? Date.now() : macroStart;
            const totalMs = Math.max(0, targetTs - startTs);
            const totalDays = Math.max(1, Math.ceil(totalMs / (24 * 60 * 60 * 1000)));
            const remMs = Math.max(0, targetTs - Date.now());
            const remDays = Math.max(0, Math.floor(remMs / (24 * 60 * 60 * 1000)));
            const remYears = Math.floor(remDays / 365);
            const remMonths = Math.floor((remDays % 365) / 30);
            const remD = (remDays % 365) % 30;

            let breakdown = '';
            if (remYears > 0) breakdown = `${remYears} Year${remYears > 1 ? 's' : ''}, ${remMonths} Month${remMonths > 1 ? 's' : ''}, ${remD} Day${remD > 1 ? 's' : ''}`;
            else if (remMonths > 0) breakdown = `${remMonths} Month${remMonths > 1 ? 's' : ''}, ${remD} Day${remD > 1 ? 's' : ''}`;
            else breakdown = `${remDays} Day${remDays !== 1 ? 's' : ''}`;

            return {
                totalDays,
                remDays,
                breakdown,
                formatted: new Date(targetTs).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })
            };
        } catch {
            return null;
        }
    }, [targetDateInput, targetTimeInput, resetStartToNow, macroStart]);

    const verifyPin = async (e) => {
        e.preventDefault();
        setAuthError('');
        const storedHash = localStorage.getItem('admin_pin_hash');
        const inputHash = await sha256(enteredPin);

        // Default PIN: 1818
        if (storedHash ? inputHash === storedHash : enteredPin === '1818') {
            setIsAdminAuthenticated(true);
            setEnteredPin('');
        } else {
            setAuthError('Incorrect Admin PIN');
        }
    };

    const handleResetMacro = () => {
        const now = Date.now();
        const target = now + (customDays * 24 * 60 * 60 * 1000);
        localStorage.setItem('sprint_start_timestamp', now);
        localStorage.setItem('sprint_target_timestamp', target);
        setMacroStart(now);
        setMacroTarget(target);
        setShowAdminModal(false);
        setIsAdminAuthenticated(false);
    };

    const handleUpdatePin = async () => {
        if (newPin.length < 4) {
            setAuthError('PIN must be at least 4 characters');
            return;
        }
        const hash = await sha256(newPin);
        localStorage.setItem('admin_pin_hash', hash);
        setNewPin('');
        alert('Admin PIN successfully updated.');
    };

    // Display calculations for micro-timer
    const totalSec = Math.ceil(remainingMs / 1000);
    const dispMinutes = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const dispSeconds = (totalSec % 60).toString().padStart(2, '0');

    // ----------------------------------------------------
    // COMPACT WIDGET MODE RENDER (MATCHES PHONE 2x2 WIDGET)
    // ----------------------------------------------------
    if (isWidgetMode) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-3 sm:p-4 font-sans select-none">
                {/* 2x2 Squircle Card - designed for phone screens & OnePlus floating windows */}
                <div className="w-full max-w-[320px] aspect-square bg-neutral-900/95 border border-neutral-800 rounded-[32px] p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
                    
                    {/* Ambient Glow accents */}
                    <div className="absolute -top-10 -left-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Top Row: Sprint Day Badge + Mode Selector + Expand */}
                    <div className="flex items-center justify-between z-10">
                        <div 
                            onClick={openDateModal}
                            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
                            title="Click to change target date / campaign"
                        >
                            <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-400">
                                <Flame size={16} className="animate-pulse" />
                            </div>
                            <div className="leading-tight">
                                <div className="text-sm font-black text-white tracking-tight flex items-baseline gap-1">
                                    Day {macroStats.currentDay}
                                    <span className="text-[10px] font-bold text-neutral-400">/ {macroStats.totalDays}</span>
                                </div>
                                <div className="text-[10px] font-mono text-neutral-400">
                                    {macroStats.years > 0 
                                        ? `${macroStats.years}y ${macroStats.months}m left` 
                                        : macroStats.months > 0 
                                        ? `${macroStats.months}m ${macroStats.daysInMonth}d left` 
                                        : `${macroStats.d}d ${macroStats.h}h left`}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {/* Mode Pill Toggle */}
                            <button
                                onClick={() => {
                                    const cycle = ['work', 'short', 'long'];
                                    const next = cycle[(cycle.indexOf(mode) + 1) % cycle.length];
                                    selectMode(next);
                                }}
                                className="px-2 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-[10px] font-bold text-amber-400 border border-neutral-700/80 transition shadow-sm"
                                title="Click to cycle: 25m / 5m / 15m"
                            >
                                {mode === 'work' ? '25m' : mode === 'short' ? '5m' : mode === 'long' ? '15m' : `${customMinutes}m`}
                            </button>

                            {/* Expand back to Full Mode */}
                            <button
                                onClick={toggleWidgetMode}
                                className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                                title="Expand to Full Dashboard"
                            >
                                <Maximize2 size={15} />
                            </button>
                        </div>
                    </div>

                    {/* Slim Progress Bar */}
                    <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800/80 my-1 z-10">
                        <div
                            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${macroStats.progress}%` }}
                        />
                    </div>

                    {/* Center Countdown Display */}
                    <div className="flex flex-col items-center justify-center my-auto z-10 py-1">
                        <div className="font-mono text-6xl font-black tracking-tight text-white leading-none">
                            {dispMinutes}:{dispSeconds}
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] font-medium tracking-wider uppercase">
                            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-amber-400 animate-ping' : 'bg-neutral-500'}`} />
                            <span className={isActive ? 'text-amber-400 font-semibold' : 'text-neutral-400'}>
                                {isActive ? (mode === 'work' ? 'Focusing' : 'Break') : 'Paused'}
                            </span>
                        </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="flex items-center gap-2 z-10">
                        <button
                            onClick={toggleTimer}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-xs font-bold tracking-wide transition shadow-lg ${
                                isActive
                                    ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                                    : 'bg-amber-500 hover:bg-amber-400 text-black'
                            }`}
                        >
                            {isActive ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                            <span>{isActive ? 'PAUSE' : 'START'}</span>
                        </button>

                        <button
                            onClick={resetTimer}
                            className="p-2.5 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-2xl transition"
                            title="Reset Timer"
                        >
                            <RotateCcw size={14} />
                        </button>

                        <div 
                            className="flex items-center gap-1 px-2.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-[11px] font-mono font-bold text-neutral-400" 
                            title="Completed Focus Sprints"
                        >
                            <CheckCircle2 size={13} className="text-emerald-400" />
                            <span className="text-amber-400">{sessionsCompleted}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between items-center p-4 md:p-8 font-sans">

            {/* Top Banner: Quote Carousel */}
            <header
                className="w-full max-w-2xl bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm relative"
                onMouseEnter={() => setIsQuoteHovered(true)}
                onMouseLeave={() => setIsQuoteHovered(false)}
            >
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={() => setQuoteIdx((quoteIdx - 1 + QUOTES.length) % QUOTES.length)}
                        className="p-1 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex-1 text-center min-h-[4rem] flex flex-col justify-center">
                        <p className="text-sm md:text-base font-medium text-neutral-200 italic transition-all duration-300">
                            "{QUOTES[quoteIdx].text}"
                        </p>
                        <span className="text-xs font-semibold uppercase tracking-widest text-amber-500 mt-2 block">
                            — {QUOTES[quoteIdx].author}
                        </span>
                    </div>
                    <button
                        onClick={() => setQuoteIdx((quoteIdx + 1) % QUOTES.length)}
                        className="p-1 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </header>

            {/* Center Layout: 18-Day Macro Clock & Pomodoro Engine */}
            <main className="w-full max-w-xl space-y-6 my-6">

                {/* DYNAMIC LOCKED SPRINT BANNER */}
                <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                    {/* Top Status & Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                {campaignName}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={openDateModal}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:text-amber-400 bg-neutral-950 border border-neutral-800 rounded-xl hover:bg-neutral-800/80 transition shadow-sm"
                                title="Set Custom Target Date & Deadline"
                            >
                                <Calendar size={13} className="text-amber-400" />
                                <span>Target Date</span>
                            </button>
                            <button
                                onClick={toggleWidgetMode}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-amber-400 bg-neutral-950 border border-neutral-800 rounded-xl hover:bg-neutral-800/80 transition"
                                title="Switch to Compact Phone Widget Mode"
                            >
                                <Minimize2 size={13} />
                                <span>Widget View</span>
                            </button>
                            <button
                                onClick={() => { setShowAdminModal(true); setAuthError(''); }}
                                className="p-2 text-neutral-500 hover:text-amber-400 rounded-xl hover:bg-neutral-800/80 transition"
                                title="Admin Settings"
                            >
                                <Lock size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Day Tracker & Real-Time Remaining */}
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-2">
                        <h2 className="text-3xl font-black text-amber-400 tracking-tight">
                            Day {macroStats.currentDay} <span className="text-lg font-medium text-neutral-400">/ {macroStats.totalDays}</span>
                        </h2>
                        <div className="font-mono text-sm font-semibold text-neutral-200">
                            {macroStats.d}d {macroStats.h}h {macroStats.m}m {macroStats.s}s remaining
                        </div>
                    </div>

                    {/* Target Deadline & Contextual Units Pill */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 mb-4 gap-1">
                        <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-amber-500" />
                            <span>Deadline: <strong className="text-neutral-200">{macroStats.formattedTarget}</strong></span>
                        </div>
                        {(macroStats.years > 0 || macroStats.months > 0) && (
                            <span className="px-2 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-amber-400">
                                {macroStats.contextSummary} remaining
                            </span>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-neutral-950 h-3.5 rounded-full overflow-hidden p-0.5 border border-neutral-800">
                        <div
                            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${macroStats.progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-neutral-500 mt-2 font-mono">
                        <span>Day 1 (0%)</span>
                        <span>{macroStats.progress}% Completed</span>
                        <span>Day {macroStats.totalDays} (100%)</span>
                    </div>
                </section>

                {/* WORKSPACE FOCUS TIMER */}
                <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 flex flex-col items-center shadow-2xl">

                    {/* Mode Selector Tabs */}
                    <div className="grid grid-cols-4 gap-1.5 bg-neutral-950 p-1.5 rounded-2xl w-full text-xs font-semibold mb-6 border border-neutral-800/60">
                        <button
                            onClick={() => selectMode('work')}
                            className={`py-2 rounded-xl transition ${mode === 'work' ? 'bg-neutral-800 text-amber-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
                        >
                            Pomodoro
                        </button>
                        <button
                            onClick={() => selectMode('short')}
                            className={`py-2 rounded-xl transition ${mode === 'short' ? 'bg-neutral-800 text-emerald-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
                        >
                            Short (5m)
                        </button>
                        <button
                            onClick={() => selectMode('long')}
                            className={`py-2 rounded-xl transition ${mode === 'long' ? 'bg-neutral-800 text-blue-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
                        >
                            Long (15m)
                        </button>
                        <button
                            onClick={() => selectMode('custom')}
                            className={`py-2 rounded-xl transition ${mode === 'custom' ? 'bg-neutral-800 text-purple-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
                        >
                            Custom
                        </button>
                    </div>

                    {/* Custom Minute Input */}
                    {mode === 'custom' && (
                        <div className="flex items-center gap-3 mb-4 bg-neutral-950 border border-neutral-800 px-4 py-2 rounded-xl text-xs">
                            <span className="text-neutral-400">Duration (mins):</span>
                            <input
                                type="number"
                                min="1"
                                max="180"
                                value={customMinutes}
                                onChange={(e) => handleCustomMinuteChange(e.target.value)}
                                className="w-16 bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-center font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                            />
                        </div>
                    )}

                    {/* Monospaced Digits */}
                    <div className="font-mono text-7xl md:text-8xl font-black tracking-tight text-white py-4 selection:bg-none">
                        {dispMinutes}:{dispSeconds}
                    </div>

                    {/* Play/Pause/Reset Controls */}
                    <div className="flex items-center gap-3 w-full mt-4">
                        <button
                            onClick={toggleTimer}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold tracking-wide transition shadow-lg ${isActive
                                    ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                                    : 'bg-amber-500 hover:bg-amber-400 text-black'
                                }`}
                        >
                            {isActive ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                            {isActive ? 'PAUSE' : 'START SPRINT'}
                        </button>

                        <button
                            onClick={resetTimer}
                            className="p-4 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-2xl transition"
                            title="Reset Timer"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>

                    {/* Session Tally */}
                    <div className="w-full flex items-center justify-between text-xs text-neutral-500 mt-6 pt-4 border-t border-neutral-800/80">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-emerald-500" /> Sprints Completed:
                        </span>
                        <span className="font-mono font-bold text-amber-400 text-sm">
                            {sessionsCompleted}
                        </span>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="text-xs text-neutral-600 tracking-wider uppercase">
                Sprint Focus Engine • Unthrottled Worker Sync
            </footer>

            {/* ----------------------------------------------------
                TARGET DATE & CAMPAIGN CONFIGURATION MODAL
               ---------------------------------------------------- */}
            {showDateModal && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                            <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                                <Calendar size={20} />
                                <span>Sprint Target & Deadline Engine</span>
                            </div>
                            <button 
                                onClick={() => setShowDateModal(false)}
                                className="text-xs text-neutral-500 hover:text-neutral-200 px-2 py-1 rounded-lg hover:bg-neutral-800 transition"
                            >
                                ✕ Close
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSaveTargetDate} className="space-y-4">
                            
                            {/* Campaign Name */}
                            <div>
                                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                                    Campaign / Goal Title
                                </label>
                                <input 
                                    type="text"
                                    value={campaignNameInput}
                                    onChange={(e) => setCampaignNameInput(e.target.value)}
                                    placeholder="e.g. September Mastery Sprint"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-medium"
                                />
                            </div>

                            {/* Date & Time Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                                        Target Deadline Date
                                    </label>
                                    <input 
                                        type="date"
                                        value={targetDateInput}
                                        onChange={(e) => setTargetDateInput(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                                        Deadline Time
                                    </label>
                                    <input 
                                        type="time"
                                        value={targetTimeInput}
                                        onChange={(e) => setTargetTimeInput(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                                    />
                                </div>
                            </div>

                            {/* Quick Presets */}
                            <div>
                                <label className="text-[11px] font-semibold text-neutral-400 block mb-1.5 uppercase tracking-wider">
                                    Quick Presets
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => applyPreset('sept30')}
                                        className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-semibold hover:bg-amber-500/25 transition"
                                    >
                                        🔥 Sep 30 (18-Day)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyPreset('7d')}
                                        className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-lg text-xs hover:border-neutral-700 transition"
                                    >
                                        ⚡ 7 Days
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyPreset('14d')}
                                        className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-lg text-xs hover:border-neutral-700 transition"
                                    >
                                        🚀 14 Days
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyPreset('30d')}
                                        className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-lg text-xs hover:border-neutral-700 transition"
                                    >
                                        📅 30 Days
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyPreset('endOfMonth')}
                                        className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-lg text-xs hover:border-neutral-700 transition"
                                    >
                                        🎯 End of Month
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyPreset('endOfYear')}
                                        className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-lg text-xs hover:border-neutral-700 transition"
                                    >
                                        🌟 End of Year
                                    </button>
                                </div>
                            </div>

                            {/* Reset Start Option */}
                            <div className="flex items-center gap-2 pt-1">
                                <input 
                                    type="checkbox"
                                    id="resetStart"
                                    checked={resetStartToNow}
                                    onChange={(e) => setResetStartToNow(e.target.checked)}
                                    className="rounded border-neutral-800 bg-neutral-950 text-amber-500 focus:ring-0 cursor-pointer"
                                />
                                <label htmlFor="resetStart" className="text-xs text-neutral-300 cursor-pointer select-none">
                                    Start campaign from today (Day 1)
                                </label>
                            </div>

                            {/* Dynamic Live Preview Card */}
                            {previewData && (
                                <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-1.5 text-xs">
                                    <div className="flex justify-between items-center text-neutral-400">
                                        <span>Target:</span>
                                        <strong className="text-white">{previewData.formatted} at {targetTimeInput}</strong>
                                    </div>
                                    <div className="flex justify-between items-center text-neutral-400">
                                        <span>Campaign Duration:</span>
                                        <span className="font-mono font-bold text-amber-400">{previewData.totalDays} Total Days</span>
                                    </div>
                                    <div className="flex justify-between items-center text-neutral-400">
                                        <span>Time Remaining:</span>
                                        <span className="font-mono text-emerald-400">{previewData.breakdown}</span>
                                    </div>
                                </div>
                            )}

                            {/* Submit */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowDateModal(false)}
                                    className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-semibold text-xs transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold text-xs transition shadow-lg"
                                >
                                    Save & Lock Target
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ----------------------------------------------------
          ADMIN AUTHENTICATION & SETTINGS MODAL
         ---------------------------------------------------- */}
            {showAdminModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-6">

                        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                            <div className="flex items-center gap-2 text-amber-400 font-bold">
                                <ShieldAlert size={20} />
                                <span>Admin Sprint Console</span>
                            </div>
                            <button
                                onClick={() => { setShowAdminModal(false); setIsAdminAuthenticated(false); }}
                                className="text-xs text-neutral-500 hover:text-neutral-200"
                            >
                                ✕ Close
                            </button>
                        </div>

                        {!isAdminAuthenticated ? (
                            <form onSubmit={verifyPin} className="space-y-4">
                                <p className="text-xs text-neutral-400">
                                    The 18-Day Macro Sprint is locked to prevent tampering. Enter the Admin PIN to modify sprint schedules or reset the timeline.
                                </p>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Enter Admin PIN (Default: 1818)"
                                        value={enteredPin}
                                        onChange={(e) => setEnteredPin(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white font-mono"
                                        autoFocus
                                    />
                                    {authError && <p className="text-red-400 text-xs mt-1">{authError}</p>}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition"
                                >
                                    Verify Access
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-400">
                                    Access Granted. Master modifications unlocked.
                                </div>

                                {/* Reset Section */}
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-neutral-300 block">
                                        Reset Sprint Duration (Days)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            min="1"
                                            max="365"
                                            value={customDays}
                                            onChange={(e) => setCustomDays(parseInt(e.target.value, 10) || 1)}
                                            className="w-24 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm font-mono text-center focus:border-amber-500"
                                        />
                                        <button
                                            onClick={handleResetMacro}
                                            className="flex-1 bg-red-600/90 hover:bg-red-500 text-white font-bold py-2 rounded-xl text-xs transition"
                                        >
                                            Reset Macro Clock Now
                                        </button>
                                    </div>
                                </div>

                                {/* Change PIN Section */}
                                <div className="space-y-3 border-t border-neutral-800 pt-4">
                                    <label className="text-xs font-semibold text-neutral-300 block">
                                        Update Master PIN
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="password"
                                            placeholder="New PIN"
                                            value={newPin}
                                            onChange={(e) => setNewPin(e.target.value)}
                                            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono focus:border-amber-500 text-white"
                                        />
                                        <button
                                            onClick={handleUpdatePin}
                                            className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
                                        >
                                            Save PIN
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
