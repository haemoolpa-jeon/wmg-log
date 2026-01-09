export type Lang = 'ko' | 'en'
type Name = { ko: string; en: string }
type Tag = { id: string; name: Name; k?: boolean }
type Sub = { id: string; name: Name; tags: Tag[] }
type Cat = { category_id: string; name: Name; sub_categories: Sub[] }

export const flavorData: Cat[] = [
  {
    category_id: 'cereal',
    name: { ko: '곡물', en: 'Cereal' },
    sub_categories: [
      { id: 'malt', name: { ko: '몰트', en: 'Malt' }, tags: [
        { id: 'malt', name: { ko: '몰트', en: 'Malt' } },
        { id: 'barley', name: { ko: '보리', en: 'Barley' } },
        { id: 'porridge', name: { ko: '오트밀', en: 'Porridge' } },
        { id: 'bran', name: { ko: '밀기울', en: 'Bran' } },
        { id: 'cereal', name: { ko: '시리얼', en: 'Cereal' } },
        { id: 'nurungji', name: { ko: '누룽지', en: 'Nurungji' }, k: true },
      ]},
      { id: 'bread', name: { ko: '빵/비스킷', en: 'Bread' }, tags: [
        { id: 'bread', name: { ko: '빵', en: 'Bread' } },
        { id: 'toast', name: { ko: '토스트', en: 'Toast' } },
        { id: 'biscuit', name: { ko: '비스킷', en: 'Biscuit' } },
        { id: 'cracker', name: { ko: '크래커', en: 'Cracker' } },
        { id: 'cake', name: { ko: '케이크', en: 'Cake' } },
      ]},
      { id: 'yeasty', name: { ko: '효모', en: 'Yeasty' }, tags: [
        { id: 'yeast', name: { ko: '효모', en: 'Yeast' } },
        { id: 'dough', name: { ko: '반죽', en: 'Dough' } },
        { id: 'beer', name: { ko: '맥주', en: 'Beer' } },
      ]},
    ]
  },
  {
    category_id: 'fruity',
    name: { ko: '과일', en: 'Fruity' },
    sub_categories: [
      { id: 'citrus', name: { ko: '시트러스', en: 'Citrus' }, tags: [
        { id: 'lemon', name: { ko: '레몬', en: 'Lemon' } },
        { id: 'orange', name: { ko: '오렌지', en: 'Orange' } },
        { id: 'orange_peel', name: { ko: '오렌지필', en: 'Orange Peel' } },
        { id: 'lime', name: { ko: '라임', en: 'Lime' } },
        { id: 'grapefruit', name: { ko: '자몽', en: 'Grapefruit' } },
        { id: 'tangerine', name: { ko: '귤', en: 'Tangerine' } },
        { id: 'yuja', name: { ko: '유자', en: 'Yuja' }, k: true },
      ]},
      { id: 'orchard', name: { ko: '과수원', en: 'Orchard' }, tags: [
        { id: 'apple', name: { ko: '사과', en: 'Apple' } },
        { id: 'green_apple', name: { ko: '청사과', en: 'Green Apple' } },
        { id: 'pear', name: { ko: '배', en: 'Pear' } },
        { id: 'peach', name: { ko: '복숭아', en: 'Peach' } },
        { id: 'apricot', name: { ko: '살구', en: 'Apricot' } },
        { id: 'plum', name: { ko: '자두', en: 'Plum' } },
        { id: 'cherry', name: { ko: '체리', en: 'Cherry' } },
        { id: 'nectarine', name: { ko: '천도복숭아', en: 'Nectarine' } },
      ]},
      { id: 'tropical', name: { ko: '열대과일', en: 'Tropical' }, tags: [
        { id: 'banana', name: { ko: '바나나', en: 'Banana' } },
        { id: 'pineapple', name: { ko: '파인애플', en: 'Pineapple' } },
        { id: 'mango', name: { ko: '망고', en: 'Mango' } },
        { id: 'coconut', name: { ko: '코코넛', en: 'Coconut' } },
        { id: 'passion_fruit', name: { ko: '패션프루트', en: 'Passion Fruit' } },
        { id: 'kiwi', name: { ko: '키위', en: 'Kiwi' } },
      ]},
      { id: 'dried', name: { ko: '건과일', en: 'Dried Fruit' }, tags: [
        { id: 'raisin', name: { ko: '건포도', en: 'Raisin' } },
        { id: 'prune', name: { ko: '푸룬', en: 'Prune' } },
        { id: 'fig', name: { ko: '무화과', en: 'Fig' } },
        { id: 'date', name: { ko: '대추야자', en: 'Date' } },
        { id: 'fruit_cake', name: { ko: '과일케이크', en: 'Fruit Cake' } },
        { id: 'jujube', name: { ko: '대추', en: 'Jujube' }, k: true },
        { id: 'gotgam', name: { ko: '곶감', en: 'Dried Persimmon' }, k: true },
      ]},
      { id: 'berry', name: { ko: '베리', en: 'Berry' }, tags: [
        { id: 'strawberry', name: { ko: '딸기', en: 'Strawberry' } },
        { id: 'raspberry', name: { ko: '라즈베리', en: 'Raspberry' } },
        { id: 'blackberry', name: { ko: '블랙베리', en: 'Blackberry' } },
        { id: 'blueberry', name: { ko: '블루베리', en: 'Blueberry' } },
        { id: 'cranberry', name: { ko: '크랜베리', en: 'Cranberry' } },
      ]},
      { id: 'cooked', name: { ko: '조리된 과일', en: 'Cooked Fruit' }, tags: [
        { id: 'stewed_apple', name: { ko: '조린 사과', en: 'Stewed Apple' } },
        { id: 'marmalade', name: { ko: '마말레이드', en: 'Marmalade' } },
        { id: 'jam', name: { ko: '잼', en: 'Jam' } },
        { id: 'candied_fruit', name: { ko: '설탕절임 과일', en: 'Candied Fruit' } },
      ]},
    ]
  },
  {
    category_id: 'floral',
    name: { ko: '꽃/허브', en: 'Floral' },
    sub_categories: [
      { id: 'floral', name: { ko: '꽃', en: 'Floral' }, tags: [
        { id: 'rose', name: { ko: '장미', en: 'Rose' } },
        { id: 'lavender', name: { ko: '라벤더', en: 'Lavender' } },
        { id: 'jasmine', name: { ko: '자스민', en: 'Jasmine' } },
        { id: 'violet', name: { ko: '바이올렛', en: 'Violet' } },
        { id: 'honeysuckle', name: { ko: '인동덩굴', en: 'Honeysuckle' } },
        { id: 'heather', name: { ko: '헤더', en: 'Heather' } },
        { id: 'geranium', name: { ko: '제라늄', en: 'Geranium' } },
      ]},
      { id: 'herbal', name: { ko: '허브', en: 'Herbal' }, tags: [
        { id: 'mint', name: { ko: '민트', en: 'Mint' } },
        { id: 'eucalyptus', name: { ko: '유칼립투스', en: 'Eucalyptus' } },
        { id: 'thyme', name: { ko: '타임', en: 'Thyme' } },
        { id: 'rosemary', name: { ko: '로즈마리', en: 'Rosemary' } },
        { id: 'sage', name: { ko: '세이지', en: 'Sage' } },
        { id: 'fennel', name: { ko: '펜넬', en: 'Fennel' } },
        { id: 'tea', name: { ko: '차', en: 'Tea' } },
      ]},
      { id: 'green', name: { ko: '풀/잎', en: 'Green' }, tags: [
        { id: 'grass', name: { ko: '풀', en: 'Grass' } },
        { id: 'hay', name: { ko: '건초', en: 'Hay' } },
        { id: 'straw', name: { ko: '짚', en: 'Straw' } },
        { id: 'green_leaves', name: { ko: '푸른 잎', en: 'Green Leaves' } },
        { id: 'fir', name: { ko: '전나무', en: 'Fir' } },
        { id: 'pine_needle', name: { ko: '솔잎', en: 'Pine Needle' } },
      ]},
    ]
  },
  {
    category_id: 'peaty',
    name: { ko: '피트/스모키', en: 'Peaty' },
    sub_categories: [
      { id: 'smoky', name: { ko: '훈연', en: 'Smoky' }, tags: [
        { id: 'bonfire', name: { ko: '모닥불', en: 'Bonfire' } },
        { id: 'campfire', name: { ko: '캠프파이어', en: 'Campfire' } },
        { id: 'charcoal', name: { ko: '숯', en: 'Charcoal' } },
        { id: 'ash', name: { ko: '재', en: 'Ash' } },
        { id: 'incense', name: { ko: '향', en: 'Incense' } },
        { id: 'peat_smoke', name: { ko: '피트 연기', en: 'Peat Smoke' } },
      ]},
      { id: 'medicinal', name: { ko: '약품', en: 'Medicinal' }, tags: [
        { id: 'iodine', name: { ko: '요오드', en: 'Iodine' } },
        { id: 'hospital', name: { ko: '병원', en: 'Hospital' } },
        { id: 'bandage', name: { ko: '반창고', en: 'Bandage' } },
        { id: 'tar', name: { ko: '타르', en: 'Tar' } },
        { id: 'diesel', name: { ko: '디젤', en: 'Diesel' } },
      ]},
      { id: 'maritime', name: { ko: '바다', en: 'Maritime' }, tags: [
        { id: 'sea_salt', name: { ko: '바다소금', en: 'Sea Salt' } },
        { id: 'seaweed', name: { ko: '해초', en: 'Seaweed' } },
        { id: 'brine', name: { ko: '염수', en: 'Brine' } },
        { id: 'oyster', name: { ko: '굴', en: 'Oyster' } },
        { id: 'smoked_fish', name: { ko: '훈제 생선', en: 'Smoked Fish' } },
        { id: 'anchovy', name: { ko: '멸치', en: 'Anchovy' } },
      ]},
      { id: 'earthy', name: { ko: '흙', en: 'Earthy' }, tags: [
        { id: 'earth', name: { ko: '흙', en: 'Earth' } },
        { id: 'moss', name: { ko: '이끼', en: 'Moss' } },
        { id: 'mushroom', name: { ko: '버섯', en: 'Mushroom' } },
        { id: 'truffle', name: { ko: '트러플', en: 'Truffle' } },
        { id: 'wet_earth', name: { ko: '젖은 흙', en: 'Wet Earth' } },
      ]},
    ]
  },
  {
    category_id: 'winey',
    name: { ko: '와인/셰리', en: 'Winey' },
    sub_categories: [
      { id: 'wine', name: { ko: '와인', en: 'Wine' }, tags: [
        { id: 'sherry', name: { ko: '셰리', en: 'Sherry' } },
        { id: 'port', name: { ko: '포트', en: 'Port' } },
        { id: 'red_wine', name: { ko: '레드와인', en: 'Red Wine' } },
        { id: 'white_wine', name: { ko: '화이트와인', en: 'White Wine' } },
        { id: 'madeira', name: { ko: '마데이라', en: 'Madeira' } },
        { id: 'brandy', name: { ko: '브랜디', en: 'Brandy' } },
      ]},
      { id: 'nutty', name: { ko: '견과류', en: 'Nutty' }, tags: [
        { id: 'almond', name: { ko: '아몬드', en: 'Almond' } },
        { id: 'walnut', name: { ko: '호두', en: 'Walnut' } },
        { id: 'hazelnut', name: { ko: '헤이즐넛', en: 'Hazelnut' } },
        { id: 'peanut', name: { ko: '땅콩', en: 'Peanut' } },
        { id: 'chestnut', name: { ko: '밤', en: 'Chestnut' } },
        { id: 'marzipan', name: { ko: '마지팬', en: 'Marzipan' } },
        { id: 'praline', name: { ko: '프랄린', en: 'Praline' } },
      ]},
      { id: 'chocolate', name: { ko: '초콜릿', en: 'Chocolate' }, tags: [
        { id: 'dark_chocolate', name: { ko: '다크초콜릿', en: 'Dark Chocolate' } },
        { id: 'milk_chocolate', name: { ko: '밀크초콜릿', en: 'Milk Chocolate' } },
        { id: 'cocoa', name: { ko: '코코아', en: 'Cocoa' } },
        { id: 'cacao_nibs', name: { ko: '카카오닙스', en: 'Cacao Nibs' } },
      ]},
      { id: 'coffee', name: { ko: '커피', en: 'Coffee' }, tags: [
        { id: 'coffee', name: { ko: '커피', en: 'Coffee' } },
        { id: 'espresso', name: { ko: '에스프레소', en: 'Espresso' } },
        { id: 'mocha', name: { ko: '모카', en: 'Mocha' } },
      ]},
    ]
  },
  {
    category_id: 'woody',
    name: { ko: '오크/나무', en: 'Woody' },
    sub_categories: [
      { id: 'wood', name: { ko: '나무', en: 'Wood' }, tags: [
        { id: 'oak', name: { ko: '오크', en: 'Oak' } },
        { id: 'cedar', name: { ko: '시더', en: 'Cedar' } },
        { id: 'sandalwood', name: { ko: '백단향', en: 'Sandalwood' } },
        { id: 'pine', name: { ko: '소나무', en: 'Pine' } },
        { id: 'sawdust', name: { ko: '톱밥', en: 'Sawdust' } },
        { id: 'cigar_box', name: { ko: '시가박스', en: 'Cigar Box' } },
      ]},
      { id: 'vanilla', name: { ko: '바닐라/단맛', en: 'Vanilla' }, tags: [
        { id: 'vanilla', name: { ko: '바닐라', en: 'Vanilla' } },
        { id: 'caramel', name: { ko: '카라멜', en: 'Caramel' } },
        { id: 'toffee', name: { ko: '토피', en: 'Toffee' } },
        { id: 'butterscotch', name: { ko: '버터스카치', en: 'Butterscotch' } },
        { id: 'honey', name: { ko: '꿀', en: 'Honey' } },
        { id: 'maple', name: { ko: '메이플', en: 'Maple' } },
        { id: 'fudge', name: { ko: '퍼지', en: 'Fudge' } },
        { id: 'custard', name: { ko: '커스터드', en: 'Custard' } },
      ]},
      { id: 'spice', name: { ko: '스파이스', en: 'Spice' }, tags: [
        { id: 'cinnamon', name: { ko: '시나몬', en: 'Cinnamon' } },
        { id: 'nutmeg', name: { ko: '넛맥', en: 'Nutmeg' } },
        { id: 'clove', name: { ko: '정향', en: 'Clove' } },
        { id: 'ginger', name: { ko: '생강', en: 'Ginger' } },
        { id: 'black_pepper', name: { ko: '후추', en: 'Black Pepper' } },
        { id: 'allspice', name: { ko: '올스파이스', en: 'Allspice' } },
        { id: 'anise', name: { ko: '아니스', en: 'Anise' } },
        { id: 'licorice', name: { ko: '감초', en: 'Licorice' } },
      ]},
      { id: 'toasted', name: { ko: '토스트/로스팅', en: 'Toasted' }, tags: [
        { id: 'charred_oak', name: { ko: '탄 오크', en: 'Charred Oak' } },
        { id: 'burnt_toast', name: { ko: '탄 토스트', en: 'Burnt Toast' } },
        { id: 'roasted', name: { ko: '로스팅', en: 'Roasted' } },
      ]},
    ]
  },
  {
    category_id: 'feinty',
    name: { ko: '가죽/담배', en: 'Feinty' },
    sub_categories: [
      { id: 'leather', name: { ko: '가죽', en: 'Leather' }, tags: [
        { id: 'leather', name: { ko: '가죽', en: 'Leather' } },
        { id: 'saddle', name: { ko: '안장', en: 'Saddle' } },
        { id: 'suede', name: { ko: '스웨이드', en: 'Suede' } },
      ]},
      { id: 'tobacco', name: { ko: '담배', en: 'Tobacco' }, tags: [
        { id: 'tobacco', name: { ko: '담배잎', en: 'Tobacco' } },
        { id: 'cigar', name: { ko: '시가', en: 'Cigar' } },
        { id: 'pipe_tobacco', name: { ko: '파이프 담배', en: 'Pipe Tobacco' } },
      ]},
      { id: 'honey_wax', name: { ko: '꿀/왁스', en: 'Honey/Wax' }, tags: [
        { id: 'beeswax', name: { ko: '밀랍', en: 'Beeswax' } },
        { id: 'polish', name: { ko: '광택제', en: 'Polish' } },
        { id: 'candle_wax', name: { ko: '양초', en: 'Candle Wax' } },
      ]},
      { id: 'dairy', name: { ko: '유제품', en: 'Dairy' }, tags: [
        { id: 'butter', name: { ko: '버터', en: 'Butter' } },
        { id: 'cream', name: { ko: '크림', en: 'Cream' } },
        { id: 'cheese', name: { ko: '치즈', en: 'Cheese' } },
        { id: 'buttermilk', name: { ko: '버터밀크', en: 'Buttermilk' } },
      ]},
    ]
  },
  {
    category_id: 'sulphury',
    name: { ko: '황/기타', en: 'Sulphury' },
    sub_categories: [
      { id: 'sulphur', name: { ko: '황', en: 'Sulphur' }, tags: [
        { id: 'match', name: { ko: '성냥', en: 'Match' } },
        { id: 'gunpowder', name: { ko: '화약', en: 'Gunpowder' } },
        { id: 'fireworks', name: { ko: '불꽃놀이', en: 'Fireworks' } },
      ]},
      { id: 'rubber', name: { ko: '고무', en: 'Rubber' }, tags: [
        { id: 'rubber', name: { ko: '고무', en: 'Rubber' } },
        { id: 'tire', name: { ko: '타이어', en: 'Tire' } },
        { id: 'eraser', name: { ko: '지우개', en: 'Eraser' } },
      ]},
      { id: 'vegetal', name: { ko: '채소', en: 'Vegetal' }, tags: [
        { id: 'cabbage', name: { ko: '양배추', en: 'Cabbage' } },
        { id: 'onion', name: { ko: '양파', en: 'Onion' } },
        { id: 'garlic', name: { ko: '마늘', en: 'Garlic' } },
        { id: 'cooked_veg', name: { ko: '익힌 채소', en: 'Cooked Vegetables' } },
      ]},
      { id: 'solvent', name: { ko: '용제', en: 'Solvent' }, tags: [
        { id: 'nail_polish', name: { ko: '매니큐어', en: 'Nail Polish' } },
        { id: 'paint', name: { ko: '페인트', en: 'Paint' } },
        { id: 'varnish', name: { ko: '니스', en: 'Varnish' } },
        { id: 'glue', name: { ko: '접착제', en: 'Glue' } },
      ]},
      { id: 'savory', name: { ko: '감칠맛', en: 'Savory' }, tags: [
        { id: 'soy_sauce', name: { ko: '간장', en: 'Soy Sauce' }, k: true },
        { id: 'miso', name: { ko: '된장', en: 'Miso' }, k: true },
        { id: 'umami', name: { ko: '감칠맛', en: 'Umami' } },
        { id: 'meaty', name: { ko: '고기', en: 'Meaty' } },
      ]},
    ]
  },
]

export const categoryIcons: Record<string, string> = {
  cereal: '🌾',
  fruity: '🍎',
  floral: '🌸',
  peaty: '🔥',
  winey: '🍷',
  woody: '🪵',
  feinty: '👜',
  sulphury: '⚗️',
}

// Emoji icons for individual flavors
export const flavorIcons: Record<string, string> = {
  // Cereal
  malt: '🌾', barley: '🌾', porridge: '🥣', bran: '🌾', cereal: '🥣', nurungji: '🍚',
  bread: '🍞', toast: '🍞', biscuit: '🍪', cracker: '🍘', cake: '🎂',
  yeast: '🫓', dough: '🫓', beer: '🍺',
  // Citrus
  lemon: '🍋', orange: '🍊', orange_peel: '🍊', lime: '🍋‍🟩', grapefruit: '🍊', tangerine: '🍊', yuja: '🍋',
  // Orchard
  apple: '🍎', green_apple: '🍏', pear: '🍐', peach: '🍑', apricot: '🍑', plum: '🫐', cherry: '🍒', nectarine: '🍑',
  // Tropical
  banana: '🍌', pineapple: '🍍', mango: '🥭', coconut: '🥥', passion_fruit: '🥭', kiwi: '🥝',
  // Dried
  raisin: '🍇', prune: '🫐', fig: '🫒', date: '🌴', fruit_cake: '🍰', jujube: '🫘', gotgam: '🍂',
  // Berry
  strawberry: '🍓', raspberry: '🍓', blackberry: '🫐', blueberry: '🫐', cranberry: '🫐',
  // Cooked
  stewed_apple: '🍎', marmalade: '🍊', jam: '🍓', candied_fruit: '🍬',
  // Floral
  rose: '🌹', lavender: '💜', jasmine: '🌸', violet: '💜', honeysuckle: '🌺', heather: '🌸', geranium: '🌺',
  // Herbal
  mint: '🌿', eucalyptus: '🌿', thyme: '🌿', rosemary: '🌿', sage: '🌿', fennel: '🌿', tea: '🍵',
  // Green
  grass: '🌱', hay: '🌾', straw: '🌾', green_leaves: '🍃', fir: '🌲', pine_needle: '🌲',
  // Smoky
  bonfire: '🔥', campfire: '🏕️', charcoal: '♨️', ash: 'ite', incense: '🪔', peat_smoke: '💨',
  // Medicinal
  iodine: '💊', hospital: '🏥', bandage: '🩹', tar: '⚫', diesel: '⛽',
  // Maritime
  sea_salt: '🧂', seaweed: '🌿', brine: '🌊', oyster: '🦪', smoked_fish: '🐟', anchovy: '🐟',
  // Earthy
  earth: '🌍', moss: '🌿', mushroom: '🍄', truffle: '🍄', wet_earth: '🌧️',
  // Wine
  sherry: '🍷', port: '🍷', red_wine: '🍷', white_wine: '🥂', madeira: '🍷', brandy: '🥃',
  // Nutty
  almond: '🥜', walnut: '🌰', hazelnut: '🌰', peanut: '🥜', chestnut: '🌰', marzipan: '🥜', praline: '🍬',
  // Chocolate
  dark_chocolate: '🍫', milk_chocolate: '🍫', cocoa: '🍫', cacao_nibs: '🍫',
  // Coffee
  coffee: '☕', espresso: '☕', mocha: '☕',
  // Wood
  oak: '🪵', cedar: '🪵', sandalwood: '🪵', pine: '🌲', sawdust: '🪵', cigar_box: '📦',
  // Vanilla/Sweet
  vanilla: '🍦', caramel: '🍮', toffee: '🍬', butterscotch: '🍬', honey: '🍯', maple: '🍁', fudge: '🍫', custard: '🍮',
  // Spice
  cinnamon: '🫚', nutmeg: '🫚', clove: '🫚', ginger: '🫚', black_pepper: '🫚', allspice: '🫚', anise: '⭐', licorice: '🫚',
  // Toasted
  charred_oak: '🔥', burnt_toast: '🍞', roasted: '🔥',
  // Leather
  leather: '👜', saddle: '🐴', suede: '👜',
  // Tobacco
  tobacco: '🍂', cigar: '🚬', pipe_tobacco: '🚬',
  // Honey/Wax
  beeswax: '🐝', polish: '✨', candle_wax: '🕯️',
  // Dairy
  butter: '🧈', cream: '🥛', cheese: '🧀', buttermilk: '🥛',
  // Sulphur
  match: '🔥', gunpowder: '💥', fireworks: '🎆',
  // Rubber
  rubber: '⚫', tire: '🛞', eraser: '📝',
  // Vegetal
  cabbage: '🥬', onion: '🧅', garlic: '🧄', cooked_veg: '🥗',
  // Solvent
  nail_polish: '💅', paint: '🎨', varnish: '🖌️', glue: '📎',
  // Savory
  soy_sauce: '🫘', miso: '🫘', umami: '🍜', meaty: '🥩',
}

export const getFlavorIcon = (id: string): string => {
  return flavorIcons[id] || '•'
}

export const getTagName = (id: string, lang: Lang): string => {
  for (const cat of flavorData) {
    for (const sub of cat.sub_categories) {
      const tag = sub.tags.find(t => t.id === id)
      if (tag) return tag.name[lang]
    }
  }
  return id
}

export const whiskyColors = [
  { value: 0.0, name: { ko: '진 클리어', en: 'Gin Clear' }, hex: '#FFFFFF' },
  { value: 0.1, name: { ko: '화이트 와인', en: 'White Wine' }, hex: '#FFFDE7' },
  { value: 0.2, name: { ko: '페일 스트로', en: 'Pale Straw' }, hex: '#FFF9C4' },
  { value: 0.3, name: { ko: '페일 골드', en: 'Pale Gold' }, hex: '#FFF176' },
  { value: 0.4, name: { ko: '연한 금색', en: 'Jonquil' }, hex: '#FFEE58' },
  { value: 0.5, name: { ko: '옐로우 골드', en: 'Yellow Gold' }, hex: '#FFD54F' },
  { value: 0.6, name: { ko: '올드 골드', en: 'Old Gold' }, hex: '#FFCA28' },
  { value: 0.7, name: { ko: '앰버', en: 'Amber' }, hex: '#FFB300' },
  { value: 0.8, name: { ko: '딥 골드', en: 'Deep Gold' }, hex: '#FFA000' },
  { value: 0.9, name: { ko: '아몬티야도', en: 'Amontillado' }, hex: '#FF8F00' },
  { value: 1.0, name: { ko: '딥 코퍼', en: 'Deep Copper' }, hex: '#E65100' },
  { value: 1.1, name: { ko: '버니시드', en: 'Burnished' }, hex: '#D84315' },
  { value: 1.2, name: { ko: '올로로소', en: 'Oloroso' }, hex: '#BF360C' },
  { value: 1.3, name: { ko: '러셋', en: 'Russet' }, hex: '#A1260D' },
  { value: 1.4, name: { ko: '토니', en: 'Tawny' }, hex: '#8D1C0A' },
  { value: 1.5, name: { ko: '오번', en: 'Auburn' }, hex: '#7B1508' },
  { value: 1.6, name: { ko: '마호가니', en: 'Mahogany' }, hex: '#6D1106' },
  { value: 1.7, name: { ko: '번트 엄버', en: 'Burnt Umber' }, hex: '#5D0F05' },
  { value: 1.8, name: { ko: '올드 오크', en: 'Old Oak' }, hex: '#4E0D04' },
  { value: 1.9, name: { ko: '브라운 셰리', en: 'Brown Sherry' }, hex: '#3E0A03' },
  { value: 2.0, name: { ko: '트리클', en: 'Treacle' }, hex: '#2E0802' },
]
