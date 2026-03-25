import React, { useState, useEffect } from 'react';
import { GAME_MODE_DATA } from './gamesData';
import { polyfill } from 'mobile-drag-drop';
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';

// 모바일 드래그 앤 드롭 폴리필 활성화
polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
});

// iOS Safari 모바일 기기에서의 터치 스크롤 튀는 현상 방지
window.addEventListener('touchmove', function() {}, {passive: false});

// --- 메인 메뉴 컴포넌트 ---
function MainMenu({ onSelectMode }) {
  return (
    <div className="min-h-screen bg-split-main flex flex-col items-center justify-center p-4 relative font-jalnan overflow-hidden">
      {/* 🚀 장식용 백그라운드 요소들 (이미지 느낌 차용) */}
      <div className="absolute top-[10%] left-[15%] text-[#f9c148] text-6xl md:text-7xl animate-pulse">✨</div>
      <div className="absolute top-[20%] right-[15%] text-[#f9c148] text-5xl md:text-6xl animate-pulse" style={{ animationDelay: '1s' }}>⭐</div>
      <div className="absolute bottom-[15%] left-[10%] bg-[#7ad1c2] w-24 h-24 md:w-32 md:h-32 rounded-3xl rotate-12 shadow-[8px_8px_0_rgba(0,0,0,0.1)]"></div>
      <div className="absolute top-[30%] left-[5%] bg-[#f9c148] w-16 h-16 rounded-full shadow-[6px_6px_0_rgba(0,0,0,0.1)]"></div>
      <div className="absolute bottom-[20%] right-[10%] bg-[#4b8bf4] w-28 h-28 md:w-40 md:h-40 rounded-3xl -rotate-12 shadow-[8px_8px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-6xl text-white">1</div>
      
      {/* ☁️ 메인 클라우드 팝업 */}
      <div className="blob-cloud bg-white w-[95%] max-w-4xl aspect-[4/3] md:aspect-[2/1.2] shadow-2xl flex flex-col items-center justify-center p-6 md:p-12 relative z-10 border-[10px] md:border-[16px] border-white/80 bg-clip-padding">
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl text-[#e35741] mb-2 text-center drop-shadow-sm tracking-tighter word-keep-all z-20">
          알고리즘 대탐험
        </h1>
        <p className="text-lg md:text-2xl text-[#564e48] mb-8 md:mb-12 text-center z-20">
          어떤 기초 마법을 배워볼까요?
        </p>
        
        <div className="flex justify-center flex-wrap gap-4 md:gap-8 w-full z-20">
          {Object.values(GAME_MODE_DATA).map(mode => (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className="flex-1 min-w-[140px] max-w-[220px] flex flex-col items-center justify-center p-4 md:p-6 rounded-[2rem] shadow-xl transition-transform hover:-translate-y-3 hover:scale-105 active:scale-95 border-b-[8px]"
              style={{ backgroundColor: 'white', borderColor: mode.color, color: mode.color }}
            >
              <div className="text-5xl md:text-6xl mb-4 bg-gray-50 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-inner">{mode.icon}</div>
              <h2 className="text-xl md:text-2xl mb-1">{mode.title}</h2>
              <p className="text-xs md:text-sm text-gray-500 opacity-90 word-keep-all">{mode.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 공통 드래그 앤 드롭 슬롯 ---
const DropSlot = ({ slot, item, onDrop, onDragStart, onRemove }) => {
  const isSmall = slot.size === 'small';
  return (
    <div 
      className={`relative rounded-2xl transition-all flex-shrink-0 ${
        isSmall ? 'w-24 h-28 md:w-28 md:h-32' : 'w-28 h-36 md:w-36 md:h-44'
      }`}
      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('scale-105', 'ring-4', 'ring-yellow-400', 'ring-opacity-80', 'z-20'); }}
      onDragLeave={(e) => { e.currentTarget.classList.remove('scale-105', 'ring-4', 'ring-yellow-400', 'ring-opacity-80', 'z-20'); }}
      onDrop={(e) => { e.currentTarget.classList.remove('scale-105', 'ring-4', 'ring-yellow-400', 'ring-opacity-80', 'z-20'); onDrop(e, slot.id); }}
    >
      {item ? (
         <div 
           draggable
           onDragStart={(e) => onDragStart(e, 'slot', item, slot.id)}
           onClick={() => onRemove(item, slot.id)}
           // touch-none 추가하여 모바일 드래그 시 스크롤 현상 방지
           className="absolute inset-0 bg-white rounded-2xl shadow-md border-b-8 border-gray-300 p-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform text-gray-800 z-10 touch-none"
         >
           <span className={`${isSmall ? 'text-4xl md:text-5xl' : 'text-5xl md:text-6xl'} pointer-events-none mb-2`}>{item.emoji}</span>
           <span className={`${isSmall ? 'text-xs md:text-sm' : 'text-sm md:text-base'} text-center leading-tight word-keep-all pointer-events-none`}>{item.text}</span>
         </div>
      ) : (
         <div className="absolute inset-0 rounded-2xl border-4 border-dashed border-white/60 bg-black/10 flex flex-col items-center justify-center text-white/60 transition-colors">
           <span className="text-3xl md:text-4xl opacity-50">👇</span>
         </div>
      )}
    </div>
  );
};

// --- 게임 구동 엔진 ---
function GameEngine({ modeData, onBack }) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [gameState, setGameState] = useState('intro'); // intro, playing, checking, success, fail, all_clear
  const [shuffledItems, setShuffledItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({}); 
  
  const currentLevel = modeData.levels[currentLevelIndex];

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const getAllSlots = (level) => {
    if (level.type === 'sequence') return level.slots;
    if (level.type === 'loop') return [...level.slots, ...level.innerSlots];
    if (level.type === 'condition') return [level.conditionSlot, ...level.ifSlots, ...level.elseSlots];
    return [];
  };

  const initLevel = () => {
    setShuffledItems(shuffleArray(currentLevel.items));
    
    const initialSelected = {};
    const allSlots = getAllSlots(currentLevel);
    allSlots.forEach(s => { initialSelected[s.id] = null; });
    setSelectedItems(initialSelected);
    
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'intro') initLevel();
  }, [currentLevelIndex, gameState, modeData]);

  const playSuccessSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio error:', e));
  };

  useEffect(() => {
    if (gameState === 'all_clear') {
      const fanfare = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
      fanfare.volume = 0.6;
      fanfare.play().catch(e => console.log('Audio error:', e));

      const triggerFireworks = async () => {
        if (!window.confetti) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
          script.async = true;
          document.body.appendChild(script);
          await new Promise(resolve => { script.onload = resolve; });
        }
        const end = Date.now() + 3000;
        const frame = () => {
          window.confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FE5A00', '#D51E5B', '#29AEE4', '#2EB85C', '#FDF8E7'] });
          window.confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FE5A00', '#D51E5B', '#29AEE4', '#2EB85C', '#FDF8E7'] });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      };
      triggerFireworks();
    }
  }, [gameState]);

  const handleDragStart = (e, source, item, sourceSlotId) => {
    if (gameState !== 'playing') { e.preventDefault(); return; }
    e.dataTransfer.setData('source', source); 
    e.dataTransfer.setData('itemId', item.id);
    if (sourceSlotId) e.dataTransfer.setData('sourceSlotId', sourceSlotId);
    setTimeout(() => { e.target.classList.add('opacity-40'); }, 0);
  };
  
  const handleDragEnd = (e) => { e.target.classList.remove('opacity-40'); };

  const handleDropOnSlot = (e, targetSlotId) => {
    e.preventDefault();
    if (gameState !== 'playing') return;
    const source = e.dataTransfer.getData('source');
    const itemId = e.dataTransfer.getData('itemId');
    const sourceSlotId = e.dataTransfer.getData('sourceSlotId');

    const item = currentLevel.items.find(i => i.id === itemId);
    if (!item) return;

    if (source === 'shuffled') {
      const existingItem = selectedItems[targetSlotId];
      setSelectedItems(prev => ({ ...prev, [targetSlotId]: item }));
      setShuffledItems(prev => {
        let next = prev.filter(i => i.id !== itemId);
        if (existingItem) next.push(existingItem);
        return next;
      });
    } else if (source === 'slot' && sourceSlotId && sourceSlotId !== targetSlotId) {
      setSelectedItems(prev => {
        const newSelected = { ...prev };
        const itemAtTarget = newSelected[targetSlotId];
        newSelected[targetSlotId] = newSelected[sourceSlotId];
        newSelected[sourceSlotId] = itemAtTarget;
        return newSelected;
      });
    }
  };

  const handleDropOnShuffled = (e) => {
    e.preventDefault();
    if (gameState !== 'playing') return;
    const source = e.dataTransfer.getData('source');
    const sourceSlotId = e.dataTransfer.getData('sourceSlotId');

    if (source === 'slot' && sourceSlotId) {
      const item = selectedItems[sourceSlotId];
      if (item) {
        setSelectedItems(prev => ({ ...prev, [sourceSlotId]: null }));
        setShuffledItems(prev => [...prev, item]);
      }
    }
  };

  const handleClickSelect = (item) => {
    if (gameState !== 'playing') return;
    const allSlots = getAllSlots(currentLevel);
    const emptySlotId = allSlots.map(s => s.id).find(id => !selectedItems[id]);
    if (emptySlotId) {
      setShuffledItems(prev => prev.filter(i => i.id !== item.id));
      setSelectedItems(prev => ({ ...prev, [emptySlotId]: item }));
    }
  };

  const handleClickDeselect = (item, slotId) => {
    if (gameState !== 'playing' || !item) return;
    setSelectedItems(prev => ({ ...prev, [slotId]: null }));
    setShuffledItems(prev => [...prev, item]);
  };

  const isAllSlotsFilled = () => {
    const slots = getAllSlots(currentLevel);
    return slots.length > 0 && slots.every(s => selectedItems[s.id] !== null);
  };

  const checkAnswer = () => {
    setGameState('checking');
    const slots = getAllSlots(currentLevel);
    const isCorrect = slots.every(s => selectedItems[s.id]?.id === s.correctId);

    setTimeout(() => {
      if (isCorrect) { playSuccessSound(); setGameState('success'); }
      else { setGameState('fail'); }
    }, 800);
  };

  const renderGameBoard = () => {
    if (currentLevel.type === 'sequence') {
      return (
        <div className="bg-[#eb5e3f] p-6 md:p-8 rounded-[2rem] border-4 border-white shadow-xl mb-8 max-w-4xl mx-auto">
          <h3 className="text-white mb-6 text-center text-xl md:text-2xl bg-white/20 py-2 rounded-xl">카드를 빈칸에 순서대로 맞춰주세요 👇</h3>
          <div className="flex flex-wrap justify-center gap-4 border-2 border-dashed border-white/50 p-6 rounded-[1.5rem] bg-black/10">
            {currentLevel.slots.map(slot => (
              <DropSlot key={slot.id} slot={slot} item={selectedItems[slot.id]} onDrop={handleDropOnSlot} onDragStart={handleDragStart} onRemove={handleClickDeselect} />
            ))}
          </div>
        </div>
      );
    }
    
    if (currentLevel.type === 'loop') {
      return (
        <div className="bg-[#4b8bf4] p-6 md:p-8 rounded-[2rem] border-4 border-white shadow-xl text-white mb-8 max-w-4xl mx-auto">
           <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6">
              <span className="text-xl md:text-3xl bg-white/20 px-4 py-3 rounded-xl shadow-inner">다음 블록을</span>
              {currentLevel.slots.map((slot, i) => (
                 <React.Fragment key={slot.id}>
                   <DropSlot slot={slot} item={selectedItems[slot.id]} onDrop={handleDropOnSlot} onDragStart={handleDragStart} onRemove={handleClickDeselect} />
                 </React.Fragment>
              ))}
              <span className="text-xl md:text-3xl bg-white/20 px-4 py-3 rounded-xl shadow-inner">동안 반복하기 🔁</span>
           </div>
           
           <div className="bg-white/20 p-6 md:p-8 rounded-[1.5rem] md:ml-12 border-2 border-dashed border-white flex flex-wrap items-center gap-4 relative shadow-inner">
              <div className="absolute top-[10%] bottom-[10%] -left-6 md:-left-8 border-l-[6px] border-white rounded-l-full"></div>
              {currentLevel.innerSlots.map((slot, i) => (
                 <React.Fragment key={slot.id}>
                   <DropSlot slot={slot} item={selectedItems[slot.id]} onDrop={handleDropOnSlot} onDragStart={handleDragStart} onRemove={handleClickDeselect} />
                   {i < currentLevel.innerSlots.length - 1 && <span className="text-3xl mx-2 text-white/50">➡</span>}
                 </React.Fragment>
              ))}
           </div>
        </div>
      );
    }
    
    if (currentLevel.type === 'condition') {
      return (
        <div className="bg-[#845ec2] p-6 md:p-8 rounded-[2rem] border-4 border-white shadow-xl text-white mb-8 max-w-4xl mx-auto">
           <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6">
              <span className="text-xl md:text-3xl bg-yellow-400 text-yellow-900 px-6 py-3 rounded-xl shadow-md">만약</span>
              <DropSlot slot={currentLevel.conditionSlot} item={selectedItems[currentLevel.conditionSlot.id]} onDrop={handleDropOnSlot} onDragStart={handleDragStart} onRemove={handleClickDeselect} />
              <span className="text-xl md:text-3xl bg-yellow-400 text-yellow-900 px-6 py-3 rounded-xl shadow-md">(이)라면❓</span>
           </div>
           
           <div className="bg-white/20 p-6 rounded-[1.5rem] md:ml-12 border-2 border-dashed border-white mb-6 flex flex-wrap items-center gap-4 relative shadow-inner mt-4">
              <div className="absolute top-0 bottom-0 -left-6 md:-left-8 h-full border-l-[6px] border-white rounded-l-xl w-4"></div>
              {currentLevel.ifSlots.map(slot => (
                 <DropSlot key={slot.id} slot={slot} item={selectedItems[slot.id]} onDrop={handleDropOnSlot} onDragStart={handleDragStart} onRemove={handleClickDeselect} />
              ))}
           </div>

           <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 mt-8">
              <span className="text-xl md:text-3xl bg-white/30 px-6 py-3 rounded-xl shadow-inner">아니라면 (그 외) ❌</span>
           </div>

           <div className="bg-black/20 p-6 rounded-[1.5rem] md:ml-12 border-2 border-dashed border-white/50 flex flex-wrap items-center gap-4 relative shadow-inner">
              <div className="absolute top-0 bottom-0 -left-6 md:-left-8 h-full border-l-[6px] border-white/50 rounded-l-xl w-4"></div>
              {currentLevel.elseSlots.map(slot => (
                 <DropSlot key={slot.id} slot={slot} item={selectedItems[slot.id]} onDrop={handleDropOnSlot} onDragStart={handleDragStart} onRemove={handleClickDeselect} />
              ))}
           </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 overflow-y-auto relative font-jalnan" style={{ backgroundColor: '#FDF8E7' }}>
      
      {/* Header Area */}
      <div className="w-full max-w-5xl flex justify-between items-center z-10 mb-8 sticky top-0 bg-[#FDF8E7]/90 backdrop-blur-sm p-4 rounded-3xl shadow-sm">
        <button onClick={onBack} className="bg-white px-6 py-3 rounded-full text-gray-700 shadow-md hover:bg-gray-50 flex items-center gap-2 border-b-4 border-gray-200 active:translate-y-1 active:border-b-0 transition-all text-lg">
          ⬅️ 메뉴로
        </button>
        <div className="bg-white px-8 py-3 rounded-[2rem] shadow-lg border-b-[6px]" style={{ borderColor: modeData.color }}>
          <span className="text-xl md:text-3xl" style={{ color: modeData.color }}>{modeData.icon} {modeData.title}</span>
        </div>
      </div>

      <div className="max-w-5xl w-full relative z-10 flex-1 flex flex-col pb-10">
        
        {gameState === 'all_clear' ? (
          <div className="bg-white rounded-[40px] shadow-2xl p-12 text-center border-8 transform scale-105 transition-transform my-auto" style={{ borderColor: modeData.color }}>
            <div className="text-[6rem] md:text-[8rem] mb-6">🎉</div>
            <h2 className="text-4xl md:text-6xl mb-4" style={{ color: modeData.color }}>모든 단계 완료!</h2>
            <p className="text-xl md:text-3xl text-gray-700 mb-10">대단해요! 알고리즘 마스터 자격을 획득했어요!</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => { setCurrentLevelIndex(0); setGameState('intro'); }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xl md:text-2xl py-5 px-10 rounded-full transition-transform active:scale-95 border-b-8 border-gray-300">
                다시 하기 🔄
              </button>
              <button onClick={onBack} className="text-white text-xl md:text-2xl py-5 px-10 rounded-full transition-transform active:scale-95 border-b-8 border-black/20" style={{ backgroundColor: modeData.color }}>
                다른 마법 배우기 ✨
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[40px] shadow-2xl p-6 md:p-10 border-[8px] flex-1 flex flex-col" style={{ borderColor: modeData.color + '40' }}>
            
            {/* Level Title & Desc */}
            <div className="mb-8 text-center border-b-4 border-dashed pb-6" style={{ borderColor: modeData.color + '30' }}>
              <span className="text-white px-6 py-2 rounded-full text-base md:text-xl inline-block shadow-md mb-4" style={{ backgroundColor: modeData.color }}>
                Level {currentLevelIndex + 1} / {modeData.levels.length}
              </span>
              <h2 className="text-3xl md:text-5xl text-gray-800 mb-4">{currentLevel.title}</h2>
              <p className="text-gray-600 text-xl md:text-2xl">{currentLevel.description}</p>
            </div>

            {/* Main Interactive Board */}
            {renderGameBoard()}

            {/* Draggables Area */}
            <h3 className="text-xl text-center text-gray-500 mb-4">🧩 아래의 블록을 위로 드래그 해보세요</h3>
            <div 
              className="flex flex-wrap justify-center items-center gap-4 min-h-[14rem] p-6 rounded-[2rem] transition-colors border-4 border-dashed border-gray-300 bg-gray-50 mb-8"
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-gray-200'); }}
              onDragLeave={(e) => { e.currentTarget.classList.remove('bg-gray-200'); }}
              onDrop={(e) => { e.currentTarget.classList.remove('bg-gray-200'); handleDropOnShuffled(e); }}
            >
              {shuffledItems.map((item) => {
                const isSmall = item.size === 'small';
                return (
                <div 
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'shuffled', item, null)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleClickSelect(item)}
                  // 모바일 스크롤링 이슈 방지 touch-none
                  className={`bg-white rounded-[1.5rem] shadow-lg border-b-[6px] p-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transform transition-all hover:-translate-y-2 hover:shadow-2xl hover:scale-105 z-10 touch-none ${
                    isSmall ? 'w-24 h-28 md:w-28 md:h-32' : 'w-28 h-36 md:w-36 md:h-44'
                  }`}
                  style={{ borderColor: modeData.color }}
                >
                  <span className={`${isSmall ? 'text-4xl md:text-5xl' : 'text-5xl md:text-6xl'} mb-2 pointer-events-none`}>{item.emoji}</span>
                  <span className={`${isSmall ? 'text-sm md:text-base' : 'text-base md:text-lg'} text-center leading-tight word-keep-all pointer-events-none text-gray-700`}>{item.text}</span>
                </div>
              )})}
              {shuffledItems.length === 0 && <div className="text-gray-400 flex items-center justify-center w-full text-2xl mt-4">👏 모든 블록을 사용했어요! 👏</div>}
            </div>

            {/* Validation & Actions Area */}
            <div className="flex justify-center min-h-[6rem] items-end">
              {isAllSlotsFilled() && gameState === 'playing' && (
                <button 
                  onClick={checkAnswer}
                  className="text-white text-2xl md:text-4xl py-6 px-16 rounded-[3rem] shadow-xl transition-transform active:translate-y-3 hover:brightness-110 border-b-[10px] border-black/20 animate-bounce"
                  style={{ backgroundColor: modeData.color }}
                >
                  정답 확인하기! 🧐
                </button>
              )}

              {gameState === 'checking' && (
                <div className="text-3xl md:text-4xl animate-pulse" style={{ color: modeData.color }}>
                  알고리즘 검사 중... 💻
                </div>
              )}

              {gameState === 'success' && (
                <div className="flex flex-col items-center w-full">
                  <div className="text-3xl md:text-5xl mb-8 text-center" style={{ color: modeData.color }}>정답이에요! 완벽한 알고리즘이에요! 👏</div>
                  <button 
                    onClick={() => {
                      if (currentLevelIndex < modeData.levels.length - 1) {
                        setCurrentLevelIndex(prev => prev + 1);
                        setGameState('intro'); 
                      } else {
                        setGameState('all_clear');
                      }
                    }}
                    className="bg-[#2EB85C] hover:bg-[#27a04f] text-white text-2xl md:text-4xl py-6 px-16 rounded-[3rem] shadow-xl transition-transform active:translate-y-3 hover:scale-105 border-b-[10px] border-[#1d753b] w-full md:w-auto"
                  >
                    다음 단계로 출동! 🚀
                  </button>
                </div>
              )}

              {gameState === 'fail' && (
                <div className="flex flex-col items-center animate-pulse w-full">
                  <div className="text-2xl md:text-4xl text-[#E35741] mb-6 text-center">앗! 버그(오류)가 발생했어요! 다시 고쳐볼까요? 🐛</div>
                  <button 
                    onClick={initLevel}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xl md:text-2xl py-4 px-12 rounded-full transition-transform active:scale-95 border-b-6 border-gray-400"
                  >
                    다시 시도하기 🔄
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [selectedMode, setSelectedMode] = useState(null);

  // Global fonts setup for this specific app
  useEffect(() => {
    document.body.style.backgroundColor = '#4a4542'; 
    return () => { document.body.style.backgroundColor = ''; }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @font-face {
            font-family: 'JalnanGothic';
            src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_231029@1.1/JalnanGothic.woff') format('woff');
            font-weight: normal; font-style: normal;
        }
      `}} />
      {selectedMode === null ? (
        <MainMenu onSelectMode={setSelectedMode} />
      ) : (
        <GameEngine modeData={GAME_MODE_DATA[selectedMode]} onBack={() => setSelectedMode(null)} />
      )}
    </>
  );
}
