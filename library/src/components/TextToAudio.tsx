"use client";

import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

/* ================= STYLES ================= */

const Container = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  gap: 10px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  border: 1px solid #8ed1b2;
  background: #f1f7f7;
  border-radius: 16px;
  overflow: hidden;
  display:flex;
  flex-direction:column;
  height:100%;
`;

const Header = styled.div`
  padding: 12px 16px;
  background: #e2ecf1;
  border-bottom: 1px solid #8ed1b2;
  font-weight: 600;
`;
const TextArea = styled.textarea`
  width: 100%;
 flex:1;
  height: 240px;
  min-height: 240px;
  max-height: 240px;

  border: none;
  background: transparent;
  padding: 16px;
  resize: none;
  outline: none;

  overflow-y: auto;          
  line-height: 1.6;

  @media (max-width: 600px) {
    height: 180px;
    min-height: 180px;
    max-height: 180px;
  }
`;


const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #eaf6f1;
  border-top: 1px solid #8ed1b2;
  flex-shrink:0;
`;
const Body = styled.div`
  flex: 1;
  overflow: hidden;     
  display: flex;
`;

// const Player = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   background: #d1e4e7;
//   padding: 8px 12px;
//   border-radius: 999px;
// `;
const Player = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #d1e4e7;
  padding: 8px 12px;
  border-radius: 999px;

  /* ✅ KEY FIX */
  overflow-x: auto;
  scrollbar-width: none;      
  -ms-overflow-style: none;   
  
  &::-webkit-scrollbar {
    display: none;            
  }
`;
const IconBtn = styled.button`
  border: 1px solid #4daf83;
  background: #d4e4eb;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 16px;
`;

const SeekWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 180px;
`;
const GenerateBtn = styled.button`
  background: linear-gradient(to right, #1761a3, #4daf83);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
`;
const SettingsCard = styled.div`
  background: #f7fbfb;
  border: 1px solid #cfe5da;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: #243a36;
  margin-bottom: 10px;
`;

const SliderBox = styled.div`
  background: #eef5f2;
  border-radius: 12px;
  padding: 12px;
`;

const StyledSlider = styled.input`
  width: 100%;
  appearance: none;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    #1761a3 0%,
    #4daf83 var(--value),
    #d6e4de var(--value),
    #d6e4de 100%
  );

  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #4daf83;
    border: 2px solid #fff;
    cursor: pointer;
  }
`;
const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SideCard = styled.div`
  background: #f7fbfb;
  border: 1px solid #cfe5da;
  border-radius: 14px;
  padding: 16px;
`;

const SideHeader = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #243a36;
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SliderWrap = styled.div`
  background: #eef5f2;
  border-radius: 12px;
  padding: 12px;
`;
const Seek = styled.input`
  flex: 1;
  appearance: none;
  height: 6px;
  border-radius: 999px;
  cursor: pointer;

  background: linear-gradient(
    to right,
    #1761a3 0%,
    #4daf83 var(--progress),
    #d6e4de var(--progress),
    #d6e4de 100%
  );

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #4daf83;
    border: 2px solid white;
    box-shadow: 0 0 0 2px rgba(77, 175, 131, 0.35);
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #4daf83;
    border: 2px solid white;
  }
`;

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
 <Container data-testid="text-to-audio-container">
    {/* LEFT COLUMN */}
    <Card data-testid="text-to-audio-card">
      <Header>Text to Speech</Header>

 
      <Body>
<TextArea data-testid="text-to-audio-textarea"
  ref={textAreaRef}
  placeholder="Enter text here..."
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
</Body>
      <Controls>
        <Player>
         
<IconBtn data-testid="10 sec backward" onClick={() => skip(-10)}>
  <ControlIcon src={icons.tenBackward} />
</IconBtn>

<IconBtn data-testid="skip-backward-btn" onClick={() => skip(-5)}>
  <ControlIcon src={icons.skipBackward} />
</IconBtn>

<IconBtn data-testid="play-pause-btn" onClick={togglePlay}>
  <ControlIcon src={playing ? icons.pause : icons.play} />
</IconBtn>

<IconBtn data-testid="10-sec-forward-skip" onClick={() => skip(10)}>
  <ControlIcon src={icons.tenForward} />
</IconBtn>

<IconBtn data-testid="5-sec-forward-skip" onClick={() => skip(5)}>
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
</IconBtn>

<IconBtn data-testid="force-stop" onClick={stop}>
  <ControlIcon src={icons.stop} />
</IconBtn>


<IconBtn
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
</IconBtn>
        </Player>

<SeekWrapper>
  <Seek
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

        </SeekWrapper>

     
<GenerateBtn
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
</GenerateBtn>

<GenerateBtn
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
</GenerateBtn>

    </Controls>
    </Card>

    {/* RIGHT COLUMN */}
    <RightPanel >
      {/* Volume */}
      <SettingsCard>
        <SettingsHeader>
          <span>Volume</span>
          <span>{Math.round(volume * 100)}%</span>
        </SettingsHeader>

        <SliderBox>
          <StyledSlider
           data-testid="text-to-audio-volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            style={{ "--value": `${volume * 100}%` } as React.CSSProperties}
            
            onChange={(e) => 
  setVolume(Number(e.target.value))}

          />
        </SliderBox>
      </SettingsCard>

      <SideCard>
        <SideHeader >
          <span>Playback Speed</span>
          <span>{speed.toFixed(2)}x</span>
        </SideHeader>

        <SliderWrap>
          <StyledSlider
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
        </SliderWrap>

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
      </SideCard>

      
      <SideCard>
        <SideHeader>
          <span data-testid="quick-summary">Quick Summary</span>
        </SideHeader>

        <p style={{ fontSize: 13, color: "#4a5c57", lineHeight: 1.5 }}>
          {mode==="textarea"?categorizeText(text):
          getQuickSummary()}
        </p>
      </SideCard>
    </RightPanel>
  </Container>
);
   
};