export const CAFES = [
  { id: 'starbucks', name: '스타벅스 강남R점', initial: 'S', color: '#00704A', fg: '#fff', rating: '4.8', dist: '120m', wait: '5분' },
  { id: 'mega', name: '메가커피 역삼점', initial: 'M', color: '#FFC400', fg: '#3A2E00', rating: '4.6', dist: '80m', wait: '3분' },
  { id: 'twosome', name: '투썸플레이스 선릉점', initial: 'T', color: '#C8102E', fg: '#fff', rating: '4.7', dist: '200m', wait: '8분' },
  { id: 'ediya', name: '이디야커피 강남점', initial: 'E', color: '#1A4FA0', fg: '#fff', rating: '4.5', dist: '150m', wait: '6분' },
  { id: 'compose', name: '컴포즈커피 테헤란점', initial: 'C', color: '#122C4B', fg: '#fff', rating: '4.6', dist: '90m', wait: '4분' },
  { id: 'paik', name: '빽다방 강남대로점', initial: '빽', color: '#FFE000', fg: '#1A1A1A', rating: '4.4', dist: '240m', wait: '7분' },
]

export const MAP_POS = [
  ['52%', '30%'],
  ['30%', '52%'],
  ['72%', '40%'],
  ['44%', '66%'],
  ['66%', '64%'],
  ['24%', '34%'],
]

export const CATS = ['추천', '커피', '라떼', '티·에이드', '디저트']

export const MENUS = [
  { id: 'm1', name: '아메리카노', price: 4500, popular: true, cat: [0, 1] },
  { id: 'm2', name: '카페 라떼', price: 5000, popular: false, cat: [0, 2] },
  { id: 'm3', name: '돌체 라떼', price: 6300, popular: true, cat: [0, 2] },
  { id: 'm4', name: '바닐라 라떼', price: 5500, popular: false, cat: [2] },
  { id: 'm5', name: '카푸치노', price: 5000, popular: false, cat: [1, 2] },
  { id: 'm6', name: '자몽 허니 블랙티', price: 6300, popular: false, cat: [0, 3] },
  { id: 'm7', name: '콜드브루', price: 4900, popular: true, cat: [1] },
  { id: 'm8', name: '딸기 초코 케이크', price: 6500, popular: false, cat: [4] },
]

export const SAMPLE_CHAT = [
  { name: '민준', text: '저 아아요 ☕', me: false },
  { name: '서연', text: '나는 돌체라떼 핫', me: false },
  { name: '나', text: '아아 두 잔이요!', me: true },
  { name: '지후', text: '바닐라라떼 아이스로 주세요', me: false },
]

export const CAP_PEOPLE = [
  { name: '김민준', menu: '아메리카노', temp: 'ICE' },
  { name: '이서연', menu: '돌체 라떼', temp: 'HOT' },
  { name: '나', menu: '아메리카노 2잔', temp: 'ICE' },
  { name: '박지후', menu: '바닐라 라떼', temp: 'ICE' },
]

export const ANALYZE_STEPS = ['대화에서 메뉴 키워드 찾는 중', '온도(핫/아이스) 구분하는 중', '사람별로 묶는 중']

export const PREFS = [
  { label: '기본 온도', opts: ['HOT', 'ICE'] },
  { label: '당도', opts: ['적게', '보통', '많이'] },
  { label: '우유', opts: ['일반', '오트', '두유'] },
]

export const INITIAL_PEOPLE = [
  { id: 'me', name: '나', isMe: true, color: '#1F6E50', fg: '#fff', items: [{ id: 'i1', name: '아메리카노', temp: 'ICE', qty: 1, price: 4500 }] },
  { id: 'p1', name: '김민준', color: '#E8A13C', fg: '#fff', items: [{ id: 'i2', name: '돌체 라떼', temp: 'HOT', qty: 1, price: 6300 }] },
  { id: 'p2', name: '이서연', color: '#6A8CC7', fg: '#fff', items: [{ id: 'i3', name: '아메리카노', temp: 'ICE', qty: 2, price: 4500 }] },
  { id: 'p3', name: '박지후', color: '#C77B9E', fg: '#fff', items: [{ id: 'i4', name: '바닐라 라떼', temp: 'ICE', qty: 1, price: 5500 }] },
]

export const PARTICIPANT_STATUS = [
  { name: '나', order: '아이스 아메리카노 1잔', ok: true, bg: '#1F6E50' },
  { name: '김민준', order: '돌체 라떼 HOT 1잔', ok: true, bg: '#E8A13C' },
  { name: '이서연', order: '아이스 아메리카노 2잔', ok: false, bg: '#6A8CC7' },
  { name: '박지후', order: '확인 대기 중', ok: false, bg: '#C77B9E' },
]

export const RECENT_ORDERS = [
  { initial: 'S', color: '#00704A', fg: '#fff', cafeId: 'starbucks', name: '스타벅스 강남R점', summary: '아메리카노 외 3잔 · 18,100원', date: '2일 전' },
  { initial: 'M', color: '#FFC400', fg: '#3A2E00', cafeId: 'mega', name: '메가커피 역삼점', summary: '카페라떼 외 5잔 · 21,500원', date: '지난주' },
]

export function won(n) {
  return n.toLocaleString('ko-KR') + '원'
}
