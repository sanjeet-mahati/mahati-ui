"use client";

import React, { useEffect, useRef, useState } from "react";


/* ================= STYLES ================= */



const ControlIcon = ({ src}: { src: string }) => (
  <div
    style={{
      width: 16,
      height: 16,
      backgroundImage: `url(${src})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      
    }}
  />
);
/* ================= COMPONENT ================= */
type IconSet = {
  play: string;
  pause: string;
  stop: string;
  repeat: string;
  skipForward: string;
  skipBackward: string;
  tenForward: string;
  tenBackward: string;
};
const defaultIcons:IconSet = {
  play: "/icons/play-btn.png",
  pause: "/icons/pause-btn.png",
  stop: "/icons/hard-stop.png",
  repeat: "/icons/repeat-icon.png",
  skipForward: "/icons/skip-forward.png",
  skipBackward: "/icons/Backward-icon.png",
  tenForward: "/icons/ten-skip-forward.png",
  tenBackward: "/icons/ten-skip-backward.png",
};
export const TexttoAudio = ({icons=defaultIcons}:{icons?:IconSet}) => {
  const WORDS_PER_SECOND = 2.5;

  const [text, setText] = useState("");
  const [mode, setMode] = useState<"textarea" | "page">("textarea");

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wordIndexRef = useRef(0);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const highlightOnSkipRef=useRef(false);
  const [summary, setSummary] = useState<string>("");
  // 0 = OFF, 1 = LOOP ONCE (•), 2 = LOOP FOREVER (1)
const [loopMode, setLoopMode] = useState<0 | 1 | 2>(0);
const loopCountRef = useRef(0);
const autoPlayRef=useRef(false);
const baseDurationRef=useRef(0);
const timerBaseRef=useRef(0);
const volumeRef = useRef(volume);
const speedRef = useRef(speed);

  

  /* ================= CORE ================= */


const categorizeText = (input: string) => {
  if (!input.trim()) return "This content covers general topics.";

  const text = input.toLowerCase();

  const categories: Record<
    string,
    { keywords: string[]; summary: string }
  > = {
    Technology: {
      keywords: [
        "technology", "software", "hardware", "ai", "artificial intelligence",
        "machine learning", "computer", "internet", "digital", "platform", "app"
      ],
      summary:
        "This content focuses on technology, software systems, and digital innovation."
    },

    Business: {
      keywords: [
        "business", "marketing", "sales", "brand", "strategy",
        "market", "customer", "startup", "company", "growth"
      ],
      summary:
        "This content discusses business concepts, strategies, and market growth."
    },

    Education: {
      keywords: [
        "education", "learning", "teaching", "students",
        "training", "course", "knowledge", "research", "study"
      ],
      summary:
        "This content is related to education, learning processes, and knowledge sharing."
    },

    Media: {
      keywords: [
        "content", "video", "audio", "blog", "podcast",
        "social media", "youtube", "linkedin", "posts"
      ],
      summary:
        "This content explains media, communication formats, and content creation."
    },

    Human: {
      keywords: [
        "human", "people", "communication", "engagement",
        "interaction", "society", "culture", "behavior"
      ],
      summary:
        "This content highlights human behavior, interaction, and social aspects."
    },

    Geography: {
      keywords: [
        "geography", "location", "region", "country",
        "city", "map", "area", "population"
      ],
      summary:
        "This content relates to geographical regions and location-based information."
    },

    Nature: {
      keywords: [
        "nature", "environment", "climate", "earth",
        "ecosystem", "forest", "water", "animals", "plants"
      ],
      summary:
        "This content focuses on nature, environment, and ecological systems."
    },

    Health: {
      keywords: [
        "health", "medical", "fitness", "wellness",
        "mental", "physical", "disease"
      ],
      summary:
        "This content discusses health, wellness, and medical-related topics."
    }
  };

  const summaries: string[] = [];

  for (const key in categories) {
    if (categories[key].keywords.some(k => text.includes(k))) {
      summaries.push(categories[key].summary);
    }
  }

  return summaries.length
    ? summaries.slice(0, 2).join(" ")
    : "This content provides general informational insights.";
};

const highlightWordAt = (startIndex: number) => {
  const ta = textAreaRef.current;
  if (!ta) return;

  const value = ta.value;

  // find word start
  let start = startIndex;
  while (start > 0 && /\S/.test(value[start - 1])) {
    start--;
  }

  // find word end
  let end = startIndex;
  while (end < value.length && /\S/.test(value[end])) {
    end++;
  }

  ta.focus();
  ta.setSelectionRange(start, end);
};
const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};
  const getSourceText = () =>text
   


  const speakFromTime = (time: number): void => {
  const source = text;
  if (!source.trim()) return;

  const words = source.split(/\s+/);
  const startWordIndex = Math.floor(time * WORDS_PER_SECOND);

  const charOffset =
    words.slice(0, startWordIndex).join(" ").length +
    (startWordIndex > 0 ? 1 : 0);

  window.speechSynthesis.cancel();
  stopTimer();

  const u = new SpeechSynthesisUtterance(source.slice(charOffset));
  u.rate = speedRef.current;
  u.volume = volumeRef.current;

  // u.onboundary = (e: any) => {
  //   if (e.name === "word")&& 
  //   highlightWordOnSkipRef.current)} {
  //     highlightWordAt(charOffset + e.charIndex);
  //   }
  // };

  u.onboundary = (e: SpeechSynthesisEvent) => {
  if (e.name === "word" && highlightOnSkipRef.current) {
    highlightWordAt(charOffset + e.charIndex);
  }
};
  u.onend = () => {
  stopTimer();
  highlightOnSkipRef.current=false;

  
  if (loopMode === 1 && loopCountRef.current === 0) {
    loopCountRef.current = 1;
    setCurrentTime(0);
    speakFromTime(0);
    return;
  }

  
  if (loopMode === 2) {
    setCurrentTime(0);
    speakFromTime(0);
    return;
  }


  loopCountRef.current = 0;
  setPlaying(false);
  setCurrentTime(duration);
};

  utteranceRef.current = u;
  window.speechSynthesis.speak(u);

  setPlaying(true);
  startTimer(time);
};

const startTimer = (fromTime: number): void => {
  stopTimer();

  const start = Date.now() - fromTime * 1000;

  timerRef.current = setInterval(() => {
    const elapsed = (Date.now() - start) / 1000;
    setCurrentTime(Math.min(elapsed, duration));
  }, 100);
};
const togglePlay = () => {
  if (!utteranceRef.current) {
    loopCountRef.current=0;
    speakFromTime(currentTime);
    return;
  }

  if (playing) {
    // ⏸ Pause
    window.speechSynthesis.pause();
    stopTimer();          
    setPlaying(false);
  } else {
    // ▶ Resume
    window.speechSynthesis.resume();
    startTimer(currentTime);        
    setPlaying(true);
  }
};
const stopTimer = () => {
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
};

const getQuickSummary = () => {
  if (mode === "page") {
    const pageText = document.body.innerText
      .replace(/\s+/g, " ")
      .trim();

    return pageText
      ? "This page provides key information and functionality related to the current module."
      : "No content available on this page.";
  }

  // textarea mode
  return categorizeText(text);
};
/* ================= CONTROLS ================= */


const getPageContent = () => {
  return document.body.innerText
    .replace(/\s+/g, " ")
    .trim();
};
const downloadAudio = () => {
  alert("Download audio requires Backend TTS integration");
};
  const skip = (sec: number) => {
    const next = Math.max(0, Math.min(currentTime + sec, duration));
    highlightOnSkipRef.current=true;
    window.speechSynthesis.cancel();
    stopTimer()
    setCurrentTime(next);
    
    speakFromTime(next);
    startTimer(next);
  };

 const stop = () => {
  window.speechSynthesis.cancel();
  stopTimer();
 loopCountRef.current=0
  setPlaying(false);
  setCurrentTime(0); 
 
  
  textAreaRef.current?.setSelectionRange(0, 0);
};

  /* ================= EFFECTS ================= */
  useEffect(() => {
  volumeRef.current= volume;
}, [volume]);

useEffect(() => {
  speedRef.current = speed;
}, [speed]);
useEffect(()=>{
  if(!playing)return;
  window.speechSynthesis.cancel();
  stopTimer();
  speakFromTime(currentTime);
},[volume])


useEffect(() => {
  if (!text.trim()) {
    
    setDuration(0);
    setCurrentTime(0);
    return;
  }

  const words = text.trim().split(/\s+/).length;
  const baseDuration=words/WORDS_PER_SECOND;
  baseDurationRef.current=baseDuration;

  // duration depends on speed
  setDuration(baseDuration/speed);
  setCurrentTime(0);
}, [text]);
useEffect(() => {
  if (!baseDurationRef.current) return;

  const progress =
    duration === 0 ? 0 : currentTime / duration;

  const newDuration = baseDurationRef.current / speed;
  const newCurrentTime = progress * newDuration;

  setDuration(newDuration);
  setCurrentTime(newCurrentTime);

  if (playing) {
    window.speechSynthesis.cancel();
    stopTimer();
    speakFromTime(newCurrentTime);
  }
}, [speed]);
useEffect(() => {
  if (!autoPlayRef.current) return;
  if (!text.trim()) return;

  autoPlayRef.current = false; // reset
  speakFromTime(0);
}, [text]);

 /* ================= UI ================= */

  return (
 <div data-testid="text-to-audio-container"
 className="grid grid-cols-[4fr_1fr] gap-[10px] max-[900px]:grid-cols-1"
 >
    {/* LEFT COLUMN */}
    < div data-testid="text-to-audio-card"
    className="border border-[#8ed1b2] bg-[#f1f7f7] rounded-[16px] overflow-hidden flex flex-col h-full"
    >
      <div className="px-[16px] py-[12px] bg-[#e2ecf1] border-b border-[#8ed1b2] font-semibold">Text to Speech</div>

 
      <div className="flex flex-1 overflow-hidden">
<textarea
  ref={textAreaRef}
  placeholder="Enter text here..."
  value={text}
  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
  className="w-full flex-1 h-[240px] min-h-[240px] max-h-[240px] border-none bg-transparent p-[16px] resize-none outline-none overflow-y-auto leading-[1.6]"
/>
</div>
      <div className="flex flex-wrap items-center gap-[10px] p-[12px] bg-[#eaf6f1] border-t border-[#8ed1b2] flex-shrink-0">
        <div className="flex items-center gap-[8px] bg-[#d1e4e7] px-[12px] py-[8px] rounded-full overflow-x-auto">
         
<button className="border border-[#4daf83] bg-[#d4e4eb] rounded-[6px] p-[6px] cursor-pointer" data-testid="10 sec backward" onClick={() => skip(-10)}>
  <ControlIcon src={icons.tenBackward} />
</button>

<button className="border border-[#4daf83] bg-[#d4e4eb] rounded-[6px] p-[6px] cursor-pointer" data-testid="skip-backward-btn" onClick={() => skip(-5)}>
  <ControlIcon src={icons.skipBackward} />
</button>

<button className="border border-[4daf83] bg-[#d4e4eb] rounded-[6px] p-[6px] cursor-pointer" data-testid="play-pause-btn" onClick={togglePlay}>
  <ControlIcon src={playing ? icons.pause : icons.play} />
</button>

<button className="border border-[4daf83] bg-[#d4e4eb] rounded-[6px] p-[6px] cursor-pointer" data-testid="10-sec-forward-skip" onClick={() => skip(10)}>
  <ControlIcon src={icons.tenForward} />
</button>

<button className="border border-[4daf83] bg-[#d4e4eb] rounded-[6px] p-[6px] cursor-pointer" data-testid="5-sec-forward-skip" onClick={() => skip(5)}>
    <div
    style={{
      width: 16,
      height: 16,
      backgroundImage: `url(${icons.skipBackward})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "contain",
      transform: "scaleX(-1)",   
    }}
  
   />
</button>

<button className="border border-[4daf83] bg-[#d4e4eb] rounded-[6px] p-[6px] cursor-pointer" data-testid="force-stop" onClick={stop}>
  <ControlIcon src={icons.stop} />
</button>


<button className="border border-[4daf83] bg-[#d4e4eb] rounded-[6px] p-[6px] cursor-pointer"
  data-testid="on-loop-btn"
  onClick={() => {
    setLoopMode(prev => (prev === 2 ? 0 : (prev + 1) as 0 | 1 | 2));
    
  }}
  title={
    loopMode === 0
      ? "Loop off"
      : loopMode === 1
      ? "Loop once"
      : "Loop continuously"
  }
>
  <div style={{ position: "relative" }}>
    <ControlIcon src={icons.repeat} />

    {/* DOT */}
    {loopMode === 1 && (
      <span
        style={{
          
          position: "absolute",
          right: -4,
          bottom: -4,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#1761a3",
        }}

      />
    )}
    

    
    {loopMode === 2 && (
      <span
        style={{
          position: "absolute",
          right: -4,
          bottom: -4,
          fontSize: 10,
          fontWeight: 700,
          color: "#1761a3",
        }}
      >
        1
      </span>
    )}
  </div>
</button>
        </div>

<div className="flex items-center gap-[6px] w-[180px]">
  <input
  className="flex-1 appearance-none h-[6px] rounded-full cursor-pointer"
    data-testid="seek-bar"
    type="range"
    min={0}
    max={duration}
    step={0.01}
    value={currentTime}
    
    style={{
      "--progress": `${(currentTime / duration) * 100}%`,
    } as React.CSSProperties}
    onChange={(e) => {
      const t = Number(e.target.value);
      setCurrentTime(t);
      window.speechSynthesis.cancel();
      stopTimer();
      speakFromTime(t);
    }}
  />

  <span
    style={{
      fontSize: 10,
      color: "#4a5c57",
      minWidth: 5,
      textAlign: "right",
    }}
  >
     {formatTime(currentTime)}.{formatTime(duration)} 
  </span>

        </div>

     
<button
className="bg-gradient-to-r from-[#1761a3] to-[#4daf83] text-white border-none px-[12px] py-[6px] rounded-[6px] cursor-pointer"
  data-testid="reads-entire-page-btn"
  onClick={() => {
    const pageText = getPageContent();
     loopCountRef.current=0;
    setText(pageText);      
    setMode("page");        
    setCurrentTime(0); 
    speakFromTime(0);  
  }}
>
  Reads Entire page
</button>

<button className="bg-gradient-to-r from-[#1761a3] to-[#4daf83] text white border-none px-[12px] py-[6px] ronded-[6px] cursor-pointer"
 data-testid="reads-given-input"
  onClick={() => {
    loopCountRef.current=0;
    setMode("textarea");
    setCurrentTime(0);
    setSummary(categorizeText(text));
    speakFromTime(0);
  }}
>
  Reads input text
</button>

    </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="flex flex-col gap-[16px]" >
      {/* Volume */}
      <div className="bg-[#f7fbfb] border border-[#cfe5da] rounded-[14px] p-[16px] mb-[16px]">
        <div className="flex justify-between items-center text-[13px] font-semibold text-[#243a36] mb-[10px]">
          <span>Volume</span>
          <span>{Math.round(volume * 100)}%</span>
        </div>
      
       <input
data-testid="text-to-audio-volume"
type="range"
min={0}
max={1}
step={0.01}
value={volume}
style={{ "--value": `${volume * 100}%` } as React.CSSProperties}
onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
setVolume(Number(e.target.value))
}
/>
        </div>
      </div>

      <div className="bg-[#f7fbfb] border border-[#cfe5da] rounded-[14px] p-[16px]">
        <div className="text-[13px] font-semibold text-[#243a36] flex justify-between mb-[12px]">
          <span>Playback Speed</span>
          <span>{speed.toFixed(2)}x</span>
        </div>

        <div className="bg-[#eef5f2] rounded-[12px] p-[12px]">
          <input
          className="w-full appearance-none h-[6px] rounded-full"
           data-testid="test-to-audio-playbackspeed"
            type="range"
            min={0.5}
            max={2}
            step={0.25}
            value={speed}
            style={{
              "--value": `${((speed - 0.5) / 1.5) * 100}%`,
            } as React.CSSProperties}
            
            onChange={(e) => 
              setSpeed(Number(e.target.value))}

          />
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#7a8b86",
            marginTop: 6,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Slower</span>
          <span>Faster</span>
        </div>
      </div>

      
      <div className="bg-[#f7fbfb] border border-[#cfe5da] rounded-[14px] p-[16px]">
        <div className="text-[13px] font-semibold text-[#243a36] flex justify-between mb-[12px]"></div>
        
          <span data-testid="quick-summary">Quick Summary</span>
        </div>

        <p style={{ fontSize: 13, color: "#4a5c57", lineHeight: 1.5 }}>
          {mode==="textarea"?categorizeText(text):
          getQuickSummary()}
        </p>
      </div>
  
  

  
);
   
};