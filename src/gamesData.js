export const SEQUENCE_GAMES = [
  {
    id: 1, type: 'sequence',
    title: "1단계: 양치하기 🪥", description: "충치 벌레를 물리치기 위해 양치를 해볼까요? 순서대로 카드를 놓아주세요.",
    items: [
      { id: 'seq1-1', text: "칫솔에 치약 짜기", emoji: "🪥" },
      { id: 'seq1-2', text: "구석구석 닦기", emoji: "🦷" },
      { id: 'seq1-3', text: "물로 헹구기", emoji: "💧" },
      { id: 'seq1-4', text: "칫솔 씻기", emoji: "🚰" }
    ],
    slots: [
      { id: 's1', correctId: 'seq1-1' }, { id: 's2', correctId: 'seq1-2' },
      { id: 's3', correctId: 'seq1-3' }, { id: 's4', correctId: 'seq1-4' }
    ]
  },
  {
    id: 2, type: 'sequence',
    title: "2단계: 횡단보도 건너기 🚥", description: "안전하게 길을 건너려면 어떻게 해야 할까요?",
    items: [
      { id: 'seq2-1', text: "횡단보도 앞에 멈추기", emoji: "🛑" },
      { id: 'seq2-2', text: "초록불 기다리기", emoji: "🚦" },
      { id: 'seq2-3', text: "차가 멈췄는지 확인", emoji: "👀" },
      { id: 'seq2-4', text: "손 들고 건너기", emoji: "🚶" }
    ],
    slots: [ { id: 's1', correctId: 'seq2-1' }, { id: 's2', correctId: 'seq2-2' }, { id: 's3', correctId: 'seq2-3' }, { id: 's4', correctId: 'seq2-4' } ]
  },
  {
    id: 3, type: 'sequence',
    title: "3단계: 라면 끓이기 🍜", description: "맛있는 라면을 끓이는 순서를 맞춰보세요!",
    items: [
      { id: 'seq3-1', text: "냄비물 붓고 불 켜기", emoji: "💧" },
      { id: 'seq3-2', text: "물이 끓길 기다리기", emoji: "🔥" },
      { id: 'seq3-3', text: "면과 스프 넣기", emoji: "🍜" },
      { id: 'seq3-4', text: "불 끄고 그릇에 담기", emoji: "🥣" },
      { id: 'seq3-5', text: "호호 불어 먹기", emoji: "😋" }
    ],
    slots: [ { id: 's1', correctId: 'seq3-1' }, { id: 's2', correctId: 'seq3-2' }, { id: 's3', correctId: 'seq3-3' }, { id: 's4', correctId: 'seq3-4' }, { id: 's5', correctId: 'seq3-5' } ]
  },
  {
    id: 4, type: 'sequence',
    title: "4단계: 피자 만들기 🍕", description: "맛있는 피자를 만드는 순서는 무엇일까요?",
    items: [
      { id: 'seq4-1', text: "도우 만들기", emoji: "🥖" },
      { id: 'seq4-2', text: "도우에 소스 바르기", emoji: "🍅" },
      { id: 'seq4-3', text: "치즈 골고루 뿌리기", emoji: "🧀" },
      { id: 'seq4-4', text: "토핑 올리기", emoji: "🍄" },
      { id: 'seq4-5', text: "오븐에 굽기", emoji: "♨️" },
      { id: 'seq4-6', text: "잘라 나눠 먹기", emoji: "🍕" }
    ],
    slots: [ { id: 's1', correctId: 'seq4-1' }, { id: 's2', correctId: 'seq4-2' }, { id: 's3', correctId: 'seq4-3' }, { id: 's4', correctId: 'seq4-4' }, { id: 's5', correctId: 'seq4-5' }, { id: 's6', correctId: 'seq4-6' } ]
  }
];

export const LOOP_GAMES = [
  {
    id: 1, type: 'loop',
    title: "1단계: 박수 치기 👏", description: "박수 짝! 동작을 3번 반복하는 알고리즘 블록을 완성하세요.",
    items: [ { id: 'lp1-1', text: "박수 짝!", emoji: "👏" }, { id: 'lp1-2', text: "발 구르기", emoji: "🦶" }, { id: 'lp1-3', text: "3번", emoji: "3️⃣", size: 'small' } ],
    slots: [ { id: 's_count', correctId: 'lp1-3', size: 'small' } ],
    innerSlots: [ { id: 's_action1', correctId: 'lp1-1' } ]
  },
  {
    id: 2, type: 'loop',
    title: "2단계: 씨앗 심기 🌱", description: "구멍을 파고 씨앗을 넣는 과정을 4번 반복해 작은 밭을 만들어요!",
    items: [ { id: 'lp2-1', text: "구멍 파기", emoji: "⛏️" }, { id: 'lp2-2', text: "씨앗 넣기", emoji: "🌰" }, { id: 'lp2-3', text: "4번", emoji: "4️⃣", size: 'small' } ],
    slots: [ { id: 's_count', correctId: 'lp2-3', size: 'small' } ],
    innerSlots: [ { id: 's_action1', correctId: 'lp2-1' }, { id: 's_action2', correctId: 'lp2-2' } ]
  },
  {
    id: 3, type: 'loop',
    title: "3단계: 계단 오르기 🚶‍♂️", description: "오른발 쿵! 왼발 짝! 5번 반복해서 계단을 올라가요.",
    items: [ { id: 'lp3-1', text: "오른발 쿵!", emoji: "👣" }, { id: 'lp3-2', text: "왼발 짝!", emoji: "👟" }, { id: 'lp3-3', text: "5번", emoji: "5️⃣", size: 'small' } ],
    slots: [ { id: 's_count', correctId: 'lp3-3', size: 'small' } ],
    innerSlots: [ { id: 's_action1', correctId: 'lp3-1' }, { id: 's_action2', correctId: 'lp3-2' } ]
  },
  {
    id: 4, type: 'loop',
    title: "4단계: 네모 그리기 🟦", description: "정사각형을 그리려면 선을 긋고 모서리에서 돌아야 해요!",
    items: [ { id: 'lp4-1', text: "앞으로 선 긋기", emoji: "✏️" }, { id: 'lp4-2', text: "90도 돌기", emoji: "↩️" }, { id: 'lp4-3', text: "4번", emoji: "4️⃣", size: 'small' } ],
    slots: [ { id: 's_count', correctId: 'lp4-3', size: 'small' } ],
    innerSlots: [ { id: 's_action1', correctId: 'lp4-1' }, { id: 's_action2', correctId: 'lp4-2' } ]
  }
];

export const CONDITION_GAMES = [
  {
    id: 1, type: 'condition',
    title: "1단계: 비 오는 날 ☔", description: "비가 오면 우산을 쓰고, 비가 오지 않으면 모자를 써요!",
    items: [ { id: 'cd1-1', text: "비가 온다", emoji: "🌧️", size: 'small' }, { id: 'cd1-2', text: "우산 쓰기", emoji: "☂️" }, { id: 'cd1-3', text: "모자 쓰기", emoji: "🧢" } ],
    conditionSlot: { id: 's_cond', correctId: 'cd1-1', size: 'small' },
    ifSlots: [ { id: 's_if1', correctId: 'cd1-2' } ],
    elseSlots: [ { id: 's_else1', correctId: 'cd1-3' } ]
  },
  {
    id: 2, type: 'condition',
    title: "2단계: 신호등 🚦", description: "초록불이면 지나가고, 초록불이 아니면 멈춰서 기다려요!",
    items: [ { id: 'cd2-1', text: "초록불이다", emoji: "🟢", size: 'small' }, { id: 'cd2-2', text: "길 건너기", emoji: "🚶" }, { id: 'cd2-3', text: "멈춰서 대기", emoji: "🛑" } ],
    conditionSlot: { id: 's_cond', correctId: 'cd2-1', size: 'small' },
    ifSlots: [ { id: 's_if1', correctId: 'cd2-2' } ],
    elseSlots: [ { id: 's_else1', correctId: 'cd2-3' } ]
  },
  {
    id: 3, type: 'condition',
    title: "3단계: 분리수거 ♻️", description: "자원순환! 종이 상자라면 파란 통에, 아니라면 일반 쓰레기통에!",
    items: [ { id: 'cd3-1', text: "종이 상자다", emoji: "📦", size: 'small' }, { id: 'cd3-2', text: "파란 재활용통", emoji: "🪣" }, { id: 'cd3-3', text: "일반 쓰레기통", emoji: "🗑️" } ],
    conditionSlot: { id: 's_cond', correctId: 'cd3-1', size: 'small' },
    ifSlots: [ { id: 's_if1', correctId: 'cd3-2' } ],
    elseSlots: [ { id: 's_else1', correctId: 'cd3-3' } ]
  },
  {
    id: 4, type: 'condition',
    title: "4단계: 동물 먹이주기 🐰🐻", description: "토끼 친구가 찾아왔다면 당근을 주고, 아니라면(곰이라면) 꿀을 줘요!",
    items: [ { id: 'cd4-1', text: "토끼이다", emoji: "🐰", size: 'small' }, { id: 'cd4-2', text: "당근 주기", emoji: "🥕" }, { id: 'cd4-3', text: "꿀 주기", emoji: "🍯" } ],
    conditionSlot: { id: 's_cond', correctId: 'cd4-1', size: 'small' },
    ifSlots: [ { id: 's_if1', correctId: 'cd4-2' } ],
    elseSlots: [ { id: 's_else1', correctId: 'cd4-3' } ]
  }
];

export const GAME_MODE_DATA = {
  sequence: {
    id: 'sequence',
    title: '순차 알고리즘',
    subtitle: '순서대로 차례차례!',
    color: '#eb5e3f',
    icon: '1️⃣',
    levels: SEQUENCE_GAMES
  },
  loop: {
    id: 'loop',
    title: '반복 알고리즘',
    subtitle: '같은 행동을 여러 번!',
    color: '#4b8bf4',
    icon: '🔄',
    levels: LOOP_GAMES
  },
  condition: {
    id: 'condition',
    title: '조건 알고리즘',
    subtitle: '상황에 따라 다르게!',
    color: '#845ec2',
    icon: '❓',
    levels: CONDITION_GAMES
  }
}
