import React, { useState, useEffect } from 'react';
import { GAME_MODE_DATA } from './gamesData';
import { DndContext, useDraggable, useDroppable, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// --- 메인 메뉴 컴포넌트 ---
function MainMenu({ onSelectMode }) {
  return (
    <div className="min-h-screen bg-split-main flex flex-col items-center justify-center p-4 relative font-jalnan overflow-hidden">
      {/* 🚀 배경 장식 */}
      <div className="absolute top-[10%] left-[15%] text-[#f9c148] text-6xl md:text-7xl animate-pulse">✨</div>
      <div className="absolute top-[20%] right-[15%] text-[#f9c148] text-5xl md:text-6xl animate-pulse" style={{ animationDelay: '1s' }}>⭐</div>
      <div className="absolute bottom-[15%] left-[10%] bg-[#7ad1c2] w-24 h-24 md:w-32 md:h-32 rounded-3xl rotate-12 shadow-[8px_8px_0_rgba(0,0,0,0.1)]"></div>
      <div className="absolute top-[30%] left-[5%] bg-[#f9c148] w-16 h-16 rounded-full shadow-[6px_6px_0_rgba(0,0,0,0.1)]"></div>
      <div className="absolute bottom-[20%] right-[10%] bg-[#4b8bf4] w-28 h-28 md:w-40 md:h-40 rounded-3xl -rotate-12 shadow-[8px_8px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-6xl text-white">1</div>
      
      {/* ☁️ 구름 팝업 */}
      <div className="blob-cloud bg-white w-[95%] max-w-4xl aspect-[4/3] md:aspect-[2/1.2] shadow-2xl flex flex-col items-center justify-center p-6 md:p-12 relative z-10 border-[10px] md:border-[16px] border-white/80 bg-clip-padding">
        <h1 className="text-4xl md:text-6xl lg:text-7xl text-[#e35741] mb-2 text-center drop-shadow-sm tracking-tighter word-keep-all z-20">알고리즘 대탐험</h1>
        <p className="text-lg md:text-2xl text-[#564e48] mb-8 md:mb-12 text-center z-20">어떤 기초 마법을 배워볼까요?</p>
        
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

// --- 드래그 가능한 아이템 (Dnd Kit) ---
const DraggableItem = ({ id, item, sourceSlotId, modeColor, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { item, sourceSlotId }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : 10,
    opacity: isDragging ? 0.9 : 1,
    borderColor: modeColor
  };
  
  const isSmall = item.size === 'small';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`absolute inset-0 bg-white rounded-[1.5rem] shadow-lg border-b-[6px] p-2 flex flex-col items-center justify-center cursor-grab touch-none hover:shadow-2xl transition-shadow ${isDragging ? 'shadow-2xl scale-105' : ''}`}
    >
      <div className="w-full h-full flex flex-col items-center justify-center" onClick={onClick}>
         <span className={`${isSmall ? 'text-4xl md:text-5xl' : 'text-5xl md:text-6xl'} mb-2 pointer-events-none`}>{item.emoji}</span>
         <span className={`${isSmall ? 'text-xs md:text-sm' : 'text-sm md:text-base'} text-center leading-tight word-keep-all pointer-events-none text-gray-700`}>{item.text}</span>
      </div>
    </div>
  );
};

// --- 타겟 슬롯 (Dnd Kit) ---
const DropSlot = ({ slot, item, onRemove, modeColor }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot_${slot.id}`,
    data: { isSlot: true }
  });
  
  const isSmall = slot.size === 'small';

  return (
    <div 
      ref={setNodeRef}
      className={`relative rounded-2xl transition-colors flex-shrink-0 ${
        isSmall ? 'w-24 h-28 md:w-28 md:h-32' : 'w-28 h-36 md:w-36 md:h-44'
      }`}
    >
      {/* 백그라운드 홀더 */}
      <div className={`absolute inset-0 rounded-2xl border-4 border-dashed bg-black/10 flex flex-col items-center justify-center transition-all ${isOver ? 'border-yellow-400 bg-yellow-400/20 scale-105 ring-4 ring-yellow-400/50 z-20' : 'border-white/60 text-white/60'}`}>
         {!item && <span className="text-3xl md:text-4xl opacity-50">👇</span>}
      </div>

      {item && (
         <DraggableItem id={`drag_${item.id}`} item={item} sourceSlotId={slot.id} modeColor={modeColor} onClick={() => onRemove(item, slot.id)} />
      )}
    </div>
  );
};

// --- 섞인 아이템 대기 공간 (Droppable) ---
const ShuffledArea = ({ children, isOver }) => {
  const { setNodeRef } = useDroppable({ id: 'shuffled_area' });
  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-wrap justify-center items-center gap-4 min-h-[14rem] p-6 rounded-[2rem] transition-colors border-4 border-dashed border-gray-300 mb-8 ${isOver ? 'bg-gray-200' : 'bg-gray-50'}`}
    >
      {children}
    </div>
  );
};

const ShuffledItemWrapper = ({ item, modeColor, onClick }) => {
  const isSmall = item.size === 'small';
  return (
    <div className={`relative ${isSmall ? 'w-24 h-28 md:w-28 md:h-32' : 'w-28 h-36 md:w-36 md:h-44'}`}>
       <DraggableItem id={`drag_${item.id}`} item={item} sourceSlotId={null} modeColor={modeColor} onClick={onClick} />
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

  // 터치/마우스 센서 설정 (매끄러운 모바일 반응을 위해 distance 지정)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5, delay: 100, tolerance: 10 } })
  );

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
    getAllSlots(currentLevel).forEach(s => { initialSelected[s.id] = null; });
    setSelectedItems(initialSelected);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'intro') initLevel();
  }, [currentLevelIndex, gameState, modeData]);

  const playSuccessSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.volume = 0.5; audio.play().catch(e => console.log('Audio error:', e));
  };

  useEffect(() => {
    if (gameState === 'all_clear') {
      const fanfare = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
      fanfare.volume = 0.6; fanfare.play().catch(e => console.log('Audio error:', e));

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

  // --- DND Kit Handle Drop ---
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || gameState !== 'playing') return;

    const sourceData = active.data.current; // { item, sourceSlotId }
    if (!sourceData) return;

    const item = sourceData.item;
    const sourceSlotId = sourceData.sourceSlotId;
    const overId = String(over.id);

    if (overId === 'shuffled_area') {
      if (sourceSlotId) {
        setSelectedItems(prev => ({ ...prev, [sourceSlotId]: null }));
        setShuffledItems(prev => [...prev, item]);
      }
    } else if (overId.startsWith('slot_')) {
      const targetSlotId = overId.replace('slot_', '');
      const existingItemInTarget = selectedItems[targetSlotId];

      if (!sourceSlotId) {
        // 드래그: 셔플 지역 -> 슬롯
        setSelectedItems(prev => ({ ...prev, [targetSlotId]: item }));
        setShuffledItems(prev => {
          let next = prev.filter(i => i.id !== item.id);
          if (existingItemInTarget) next.push(existingItemInTarget);
          return next;
        });
      } else {
        // 드래그: 슬롯 -> 슬롯
        if (sourceSlotId !== targetSlotId) {
          setSelectedItems(prev => {
            const next = { ...prev };
            next[targetSlotId] = item;
            next[sourceSlotId] = existingItemInTarget; 
            return next;
          });
        }
      }
    }
  };

  // Click Fallback Interactions
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
              <DropSlot key={slot.id} slot={slot} item={selectedItems[slot.id]} onRemove={handleClickDeselect} modeColor={modeData.color} />
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
                   <DropSlot slot={slot} item={selectedItems[slot.id]} onRemove={handleClickDeselect} modeColor={modeData.color} />
                 </React.Fragment>
              ))}
              <span className="text-xl md:text-3xl bg-white/20 px-4 py-3 rounded-xl shadow-inner">동안 반복하기 🔁</span>
           </div>
           
           <div className="bg-white/20 p-6 md:p-8 rounded-[1.5rem] md:ml-12 border-2 border-dashed border-white flex flex-wrap items-center gap-4 relative shadow-inner">
              <div className="absolute top-[10%] bottom-[10%] -left-6 md:-left-8 border-l-[6px] border-white rounded-l-full"></div>
              {currentLevel.innerSlots.map((slot, i) => (
                 <React.Fragment key={slot.id}>
                   <DropSlot slot={slot} item={selectedItems[slot.id]} onRemove={handleClickDeselect} modeColor={modeData.color} />
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
              <DropSlot slot={currentLevel.conditionSlot} item={selectedItems[currentLevel.conditionSlot.id]} onRemove={handleClickDeselect} modeColor={modeData.color} />
              <span className="text-xl md:text-3xl bg-yellow-400 text-yellow-900 px-6 py-3 rounded-xl shadow-md">(이)라면❓</span>
           </div>
           
           <div className="bg-white/20 p-6 rounded-[1.5rem] md:ml-12 border-2 border-dashed border-white mb-6 flex flex-wrap items-center gap-4 relative shadow-inner mt-4">
              <div className="absolute top-0 bottom-0 -left-6 md:-left-8 h-full border-l-[6px] border-white rounded-l-xl w-4 z-0 pointer-events-none"></div>
              {currentLevel.ifSlots.map(slot => (
                 <DropSlot key={slot.id} slot={slot} item={selectedItems[slot.id]} onRemove={handleClickDeselect} modeColor={modeData.color} />
              ))}
           </div>

           <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 mt-8">
              <span className="text-xl md:text-3xl bg-white/30 px-6 py-3 rounded-xl shadow-inner">아니라면 (그 외) ❌</span>
           </div>

           <div className="bg-black/20 p-6 rounded-[1.5rem] md:ml-12 border-2 border-dashed border-white/50 flex flex-wrap items-center gap-4 relative shadow-inner">
              <div className="absolute top-0 bottom-0 -left-6 md:-left-8 h-full border-l-[6px] border-white/50 rounded-l-xl w-4 z-0 pointer-events-none"></div>
              {currentLevel.elseSlots.map(slot => (
                 <DropSlot key={slot.id} slot={slot} item={selectedItems[slot.id]} onRemove={handleClickDeselect} modeColor={modeData.color} />
              ))}
           </div>
        </div>
      );
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="min-h-screen flex flex-col items-center py-6 px-4 overflow-y-auto relative font-jalnan" style={{ backgroundColor: '#FDF8E7' }}>
        
        {/* Header Area */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center z-10 mb-8 sticky top-0 bg-[#FDF8E7]/90 backdrop-blur-sm p-4 rounded-3xl shadow-sm gap-4">
          <div className="flex gap-2">
            <button onClick={onBack} className="bg-white px-4 md:px-6 py-3 rounded-full text-gray-700 shadow-md hover:bg-gray-50 flex items-center gap-2 border-b-4 border-gray-200 active:translate-y-1 active:border-b-0 transition-all text-sm md:text-lg">
              ⬅️ 메뉴로
            </button>
            {currentLevelIndex > 0 && (
              <button onClick={() => { setCurrentLevelIndex(prev => prev - 1); setGameState('intro'); }} className="bg-white px-4 md:px-6 py-3 rounded-full text-gray-700 shadow-md hover:bg-gray-50 flex items-center gap-2 border-b-4 border-gray-200 active:translate-y-1 active:border-b-0 transition-all text-sm md:text-lg">
                ⬅️ 이전 단계
              </button>
            )}
          </div>
          <div className="bg-white px-6 md:px-8 py-2 md:py-3 rounded-[2rem] shadow-lg border-b-[6px]" style={{ borderColor: modeData.color }}>
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
              <ShuffledArea>
                {shuffledItems.map((item) => (
                  <ShuffledItemWrapper key={item.id} item={item} modeColor={modeData.color} onClick={() => handleClickSelect(item)} />
                ))}
                {shuffledItems.length === 0 && <div className="text-gray-400 flex items-center justify-center w-full text-2xl mt-4">👏 모든 블록을 사용했어요! 👏</div>}
              </ShuffledArea>

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
                    <div className="text-2xl md:text-3xl mb-8 text-center" style={{ color: modeData.color }}>정답이에요! 완벽한 알고리즘이에요! 👏</div>
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
    </DndContext>
  );
}

export default function App() {
  const [selectedMode, setSelectedMode] = useState(null);

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
