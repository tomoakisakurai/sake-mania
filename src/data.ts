import type { Brand, OtherRec, Member, Meetup, Bar, KuraMetaEntry } from './types';

export const brands: Brand[] = [
  { id: 'aramasa6', name: '新政 No.6 X-type', brewery: '新政酒造', pref: '秋田', cls: '純米大吟醸(生酒)', polish: '45%', rice: '秋田酒こまち', yeast: '6号', smv: '-2.0', abv: '15%', temp: '冷酒', x: 62, y: 24, rating: 4.6, count: 348, tags: ['フルーティ', 'ガス感', '生酒'], desc: 'きょうかい6号酵母発祥の蔵が醸すフラッグシップ。木桶仕込み・生酛づくりによる繊細な酸とガス感、洋梨のような立ち香。日本酒の現在地を示す一本。' },
  { id: 'jikon', name: '而今 特別純米', brewery: '木屋正酒造', pref: '三重', cls: '特別純米', polish: '60%', rice: '五百万石', yeast: '自社株', smv: '+1.0', abv: '16%', temp: '冷酒・常温', x: 66, y: 34, rating: 4.5, count: 301, tags: ['フルーティ', 'ジューシー'], desc: '「今この瞬間を精一杯に生きる」と名付けられた銘柄。ジューシーな甘みと透明感のあるキレが共存する、入手困難酒の代表格。' },
  { id: 'dassai45', name: '獺祭 純米大吟醸45', brewery: '旭酒造', pref: '山口', cls: '純米大吟醸', polish: '45%', rice: '山田錦', yeast: '非公開', smv: '+3.0', abv: '16%', temp: '冷酒', x: 30, y: 28, rating: 4.2, count: 287, tags: ['フルーティ'], desc: '山田錦を45%まで磨いた定番の純米大吟醸。華やかな吟醸香ときれいな甘み。日本酒入門の定番にして、世界で最も知られる銘柄のひとつ。' },
  { id: 'juyondai', name: '十四代 本丸 秘伝玉返し', brewery: '高木酒造', pref: '山形', cls: '特別本醸造', polish: '55%', rice: '美山錦', yeast: '非公開', smv: '+2.0', abv: '15%', temp: '冷酒', x: 70, y: 38, rating: 4.8, count: 264, tags: ['芳醇', 'やや甘口'], desc: '「幻の酒」の代名詞。芳醇旨口ブームの火付け役であり、含んだ瞬間に広がる甘みの輪郭と静かな余韻は唯一無二。' },
  { id: 'hououbiden', name: '鳳凰美田 剱 辛口純米', brewery: '小林酒造', pref: '栃木', cls: '純米酒', polish: '55%', rice: '五百万石', yeast: '非公開', smv: '+5.0', abv: '16%', temp: 'ぬる燗◎', x: 56, y: 72, rating: 4.1, count: 198, tags: ['辛口', '燗映え'], desc: '香りの鳳凰美田が放つ辛口純米。冷やではキレ、燗では米の旨みが立つ二面性。食中酒としての完成度が高い。' },
  { id: 'kazenomori', name: '風の森 ALPHA 1', brewery: '油長酒造', pref: '奈良', cls: '純米 無濾過無加水生酒', polish: '65%', rice: '秋津穂', yeast: '7号系', smv: '非公開', abv: '14%', temp: '冷酒', x: 48, y: 18, rating: 4.3, count: 232, tags: ['ガス感', '生酒', 'フルーティ'], desc: '「次世代への扉」を掲げるALPHAシリーズの第一章。微発泡のガス感と搾りたてのフレッシュな甘み。低アルコールで飲み疲れしない。' },
  { id: 'kubota', name: '久保田 千寿', brewery: '朝日酒造', pref: '新潟', cls: '吟醸', polish: '55%', rice: '五百万石', yeast: '非公開', smv: '+5.0', abv: '15%', temp: '冷酒・ぬる燗', x: 22, y: 66, rating: 3.9, count: 176, tags: ['辛口', '淡麗'], desc: '淡麗辛口の教科書。香りは穏やかに、飲み飽きしない綺麗な辛口は食事を静かに支える。迷ったときに帰ってくる定番。' },
  { id: 'kuheiji', name: '醸し人九平次 純米大吟醸 山田錦', brewery: '萬乗醸造', pref: '愛知', cls: '純米大吟醸', polish: '50%', rice: '山田錦', yeast: '非公開', smv: '非公開', abv: '16%', temp: '冷酒・常温', x: 44, y: 40, rating: 4.4, count: 189, tags: ['酸', 'エレガント'], desc: 'ワインの文脈で日本酒を語る蔵。白桃のような香りと美しい酸、ミネラル感。和食にも洋食にも寄り添うエレガントな一本。' },
  { id: 'nabeshima', name: '鍋島 純米吟醸 五百万石', brewery: '富久千代酒造', pref: '佐賀', cls: '純米吟醸', polish: '50%', rice: '五百万石', yeast: '非公開', smv: '+1.0', abv: '16%', temp: '冷酒', x: 58, y: 30, rating: 4.4, count: 252, tags: ['フルーティ', 'ジューシー'], desc: '九州を代表する人気銘柄。ジューシーな果実味と心地よいガス感、綺麗な後口。世界一にも輝いた実力派。' },
  { id: 'hanaabi', name: '花陽浴 純米大吟醸', brewery: '南陽醸造', pref: '埼玉', cls: '純米大吟醸 無濾過生原酒', polish: '48%', rice: '八反錦', yeast: '非公開', smv: '非公開', abv: '16%', temp: '冷酒', x: 72, y: 20, rating: 4.5, count: 167, tags: ['フルーティ', '甘口'], desc: '「パイナップル」と形容される圧倒的な果実香。小さな蔵が家族で醸す、抽選必至の甘旨フルーティの極点。' },
  { id: 'denshu', name: '田酒 特別純米', brewery: '西田酒造店', pref: '青森', cls: '特別純米', polish: '55%', rice: '華吹雪', yeast: '非公開', smv: '+0.0', abv: '15.5%', temp: '常温・ぬる燗', x: 52, y: 58, rating: 4.3, count: 221, tags: ['米の旨み', '燗映え'], desc: '「田んぼの酒」を名乗る、米の旨みの教科書。派手さはないが、飲むほどに沁みる王道の純米酒。燗にして真価を発揮する。' },
  { id: 'sharaku', name: '寫樂 純米吟醸', brewery: '宮泉銘醸', pref: '福島', cls: '純米吟醸', polish: '50%', rice: '五百万石', yeast: '非公開', smv: '+1.0', abv: '16%', temp: '冷酒', x: 55, y: 36, rating: 4.4, count: 243, tags: ['ジューシー', 'キレ'], desc: '会津若松の実力蔵。ジューシーな含み香と綺麗なキレのバランスが秀逸で、外さない一本として全国の酒販店が信頼を置く。' },
];

export const others: OtherRec[] = [
  { rid: 'o1', nomi: 24, comments: [{ user: 'sake_to_sakana', avatar: '肴', avatarBg: '#D9C9B8', time: '1時間前', text: '本丸との出会いは事件ですよね。おめでとうございます!' }, { user: 'nihonshu_gaku', avatar: '學', avatarBg: '#CBD8C9', time: '40分前', text: 'どちらのお店ですか?巡礼したい…' }], user: 'kuramoto_taro', avatar: '蔵', avatarBg: '#C9D3E3', time: '2時間前', place: '立ち飲み わさび(大阪)', brandId: 'juyondai', rating: 5, x: 70, y: 38, sweet: 40, temps: ['冷酒'], pairing: '白子ポン酢', memo: 'やっと出会えた。立ち香は控えめ、含むと一気に開く。甘みの輪郭が綺麗で後口は静か。', date: '6月12日' },
  { rid: 'o2', nomi: 9, comments: [], user: 'sake_to_sakana', avatar: '肴', avatarBg: '#D9C9B8', time: '5時間前', place: '自宅', brandId: 'sharaku', rating: 4, x: 55, y: 36, sweet: 50, temps: ['冷酒'], pairing: '刺身盛り', memo: '寫樂はいつも期待を裏切らない。個人的には千本錦より五百万石派。刺身との相性が抜群。', date: '6月12日' },
  { rid: 'o3', nomi: 31, comments: [{ user: 'meigara_hunter', avatar: '探', avatarBg: '#D9C9B8', time: '昨日', text: '開栓2日目の変化もぜひ。酸が出てまた違う表情になります' }], user: 'nihonshu_gaku', avatar: '學', avatarBg: '#CBD8C9', time: '昨日', place: '酒屋で購入', brandId: 'hanaabi', rating: 5, x: 74, y: 18, sweet: 22, temps: ['冷酒'], pairing: 'チーズ', memo: 'パイナップル!としか言いようがない。抽選で当てた甲斐があった。開栓直後の香りは事件。', date: '6月11日' },
  { rid: 'o4', nomi: 18, comments: [{ user: 'tanrei_niigata', avatar: '辛', avatarBg: '#C9D3E3', time: '昨日', text: '50度説、同意です。上がり燗より戻りの方が甘みが乗りますよね' }], user: 'kanzake_kaori', avatar: '燗', avatarBg: '#E0CDB9', time: '昨日', place: 'おでん屋 ふくべ(東京)', brandId: 'denshu', rating: 5, x: 50, y: 62, sweet: 45, temps: ['ぬる燗', '熱燗'], pairing: 'おでん(大根・牛すじ)', memo: '熱燗からの戻り際、50度くらいが一番うまい。出汁との一体感に黙る。', date: '6月11日' },
  { rid: 'o5', nomi: 6, comments: [], user: 'tanrei_niigata', avatar: '辛', avatarBg: '#C9D3E3', time: '2日前', place: '居酒屋 こまち(新潟)', brandId: 'kubota', rating: 4, x: 20, y: 70, sweet: 78, temps: ['冷酒', '常温'], pairing: 'イカの塩辛', memo: '派手さはないが、塩辛と合わせると無限。淡麗辛口はやはり新潟の正義。', date: '6月10日' },
  { rid: 'o6', nomi: 11, comments: [], user: 'awa_hajime', avatar: '泡', avatarBg: '#CBD8C9', time: '3日前', place: '角打ち 油長(奈良)', brandId: 'kazenomori', rating: 4, x: 46, y: 16, sweet: 60, temps: ['冷酒'], pairing: '天ぷら盛り合わせ', memo: '搾りたてのガス感。天ぷらの油をシュワッと流してくれる。低アルで飲み疲れしないのも◎。', date: '6月9日' },
  { rid: 'o7', nomi: 15, comments: [], user: 'meigara_hunter', avatar: '探', avatarBg: '#D9C9B8', time: '4日前', place: '鮨 さが(佐賀)', brandId: 'nabeshima', rating: 5, x: 60, y: 28, sweet: 55, temps: ['冷酒'], pairing: 'イカの活造り', memo: '地元で飲む鍋島は格別。果実味とガス感、イカの甘みと完璧な三重奏。', date: '6月8日' },
  { rid: 'o8', nomi: 21, comments: [{ user: 'kuramoto_taro', avatar: '蔵', avatarBg: '#C9D3E3', time: '4日前', text: '寝かせ而今、羨ましい。私は我慢できた試しがありません' }], user: 'jikon_daisuki', avatar: '而', avatarBg: '#DDD3BE', time: '5日前', place: '自宅', brandId: 'jikon', rating: 5, x: 66, y: 32, sweet: 58, temps: ['冷酒'], pairing: '鰆の西京焼き', memo: '半年寝かせた特別純米。角が取れて甘みがまろやかに。我慢した自分を褒めたい。', date: '6月7日' },
];

export const members: Member[] = [
  { name: 'yuu_sake_log', display: 'あなた', avatar: '悠', avatarBg: '#DDD3BE', dept: 'プロダクト部', taste: 'ジューシー・華やか派' },
  { name: 'kuramoto_taro', display: '蔵本 太郎', avatar: '蔵', avatarBg: '#C9D3E3', dept: '営業部', taste: '芳醇旨口ハンター' },
  { name: 'tanrei_niigata', display: '新潟 淡麗', avatar: '辛', avatarBg: '#C9D3E3', dept: '管理部', taste: '淡麗辛口の伝道師' },
  { name: 'kanzake_kaori', display: '燗 かおり', avatar: '燗', avatarBg: '#E0CDB9', dept: '広報部', taste: 'お燗マイスター' },
  { name: 'awa_hajime', display: '泡 はじめ', avatar: '泡', avatarBg: '#CBD8C9', dept: '開発部', taste: '発泡・低アル党' },
  { name: 'meigara_hunter', display: '銘柄 探', avatar: '探', avatarBg: '#D9C9B8', dept: '企画部', taste: 'レア銘柄ハンター' },
];

export const meetups: Meetup[] = [
  { id: 'jun', status: 'upcoming', phase: 'before', name: '6月のSAKE MEETUP', dateShort: '6/20', dateLabel: '6月20日(金) 19:00〜', place: '本社 8F コラボレーションラウンジ', theme: '夏酒 — 生酒・夏限定をひとつ', host: 'kuramoto_taro', capacity: 12,
    going: ['kuramoto_taro', 'tanrei_niigata', 'awa_hajime', 'kanzake_kaori'],
    bring: [
      { member: 'kuramoto_taro', brandId: 'juyondai', note: '今年こそ本丸を布教したい' },
      { member: 'awa_hajime', brandId: 'kazenomori', note: '夏はやっぱり微発泡から' },
      { member: 'tanrei_niigata', brandId: 'kubota', note: '箸休めに新潟淡麗を一本' },
    ] },
  { id: 'juneve', status: 'past', phase: 'voting', name: '初夏の特別SAKE MEETUP', dateShort: '6/11', dateLabel: '6月11日(水) 19:00〜', place: '本社 8F ラウンジ', theme: '無濾過生原酒くらべ', host: 'yuu_sake_log', attendees: 7, voteDeadline: '6月14日(日) 23:59',
    lineup: [
      { brandId: 'kazenomori', broughtBy: 'awa_hajime', score: 4.4, votes: 2, comment: '搾りたての微発泡。一杯目から場を一気に温めた。' },
      { brandId: 'aramasa6', broughtBy: 'yuu_sake_log', score: 4.5, votes: 2, comment: '生原酒の旨みと酸。今回も安定の人気で接戦に。' },
      { brandId: 'hanaabi', broughtBy: 'meigara_hunter', score: 4.6, votes: 2, comment: 'やっぱりこの果実香は反則。終盤で票を伸ばした。' },
      { brandId: 'denshu', broughtBy: 'tanrei_niigata', score: 4.0, votes: 1, comment: '濃いめの肴に合わせて。通好みの一本。' },
    ] },
  { id: 'may', status: 'past', phase: 'closed', name: '5月のSAKE MEETUP', dateShort: '5/16', dateLabel: '5月16日(金) 19:00〜', place: '本社 8F ラウンジ', theme: '春の生酒', host: 'kanzake_kaori', attendees: 8,
    lineup: [
      { brandId: 'hanaabi', broughtBy: 'meigara_hunter', score: 4.8, votes: 6, comment: '満場一致のパイナップル。抽選を当てた探さんに拍手。' },
      { brandId: 'aramasa6', broughtBy: 'yuu_sake_log', score: 4.5, votes: 4, comment: 'ガス感と酸が話題に。生牡蠣を持ち込んだ人がいて優勝。' },
      { brandId: 'sharaku', broughtBy: 'kanzake_kaori', score: 4.3, votes: 2, comment: '外さない安定感。会の中盤を綺麗に締めた。' },
      { brandId: 'denshu', broughtBy: 'tanrei_niigata', score: 4.1, votes: 1, comment: 'ぬる燗にしたら一気に好きになったという声多数。' },
    ] },
  { id: 'apr', status: 'past', phase: 'closed', name: '4月の歓迎SAKE MEETUP', dateShort: '4/18', dateLabel: '4月18日(金) 19:00〜', place: '本社 8F ラウンジ', theme: '新メンバー歓迎', host: 'yuu_sake_log', attendees: 10,
    lineup: [
      { brandId: 'jikon', broughtBy: 'yuu_sake_log', score: 4.6, votes: 5, comment: '半年寝かせた而今。歓迎会のトリにふさわしい一本。' },
      { brandId: 'nabeshima', broughtBy: 'kuramoto_taro', score: 4.4, votes: 3, comment: '果実味とガス感で初心者にも大好評。' },
      { brandId: 'kuheiji', broughtBy: 'awa_hajime', score: 4.2, votes: 2, comment: 'エレガントな酸。チーズと合わせる派が増殖。' },
    ] },
];

export const kuraMeta: Record<string, KuraMetaEntry> = {
  '新政酒造': { city: '秋田市', founded: 1852, desc: 'きょうかい6号酵母発祥の蔵。全量純米・生酛・木桶仕込みへと回帰し、伝統製法と現代的な感性を融合させて日本酒の新しい時代を切り拓く、秋田の旗手。' },
  '木屋正酒造': { city: '名張市', founded: 1818, desc: '伊賀名張の小さな蔵。「今この瞬間を精一杯に生きる」と名付けた「而今」一筋に、ジューシーで透明感のある酒質を磨き続ける。' },
  '旭酒造': { city: '岩国市', founded: 1948, desc: '「獺祭」一本で世界へ。杜氏制を廃したデータ醸造と山田錦への徹底したこだわりで、純米大吟醸の裾野を世界に広げた革新者。' },
  '高木酒造': { city: '村山市', founded: 1615, desc: '創業四百年を超える山形の名門。「十四代」で芳醇旨口の時代を切り拓き、いまなお「幻の酒」の代名詞であり続ける。' },
  '小林酒造': { city: '小山市', founded: 1872, desc: '「鳳凰美田」の蔵。吟醸香の美しさに定評があり、華やかさとキレを両立させる栃木の実力蔵。' },
  '油長酒造': { city: '御所市', founded: 1719, desc: '大和御所の蔵。「風の森」で無濾過無加水生酒という新ジャンルを確立。微発泡のフレッシュさで日本酒の常識を更新し続ける。' },
  '朝日酒造': { city: '長岡市', founded: 1830, desc: '「久保田」で淡麗辛口を全国区にした新潟長岡の大蔵。飲み飽きしない食中酒の哲学を、半世紀にわたり貫く。' },
  '萬乗醸造': { city: '名古屋市', founded: 1647, desc: '「醸し人九平次」。ワインの文脈で日本酒を再定義する蔵。フランス・ブルゴーニュでワインも醸し、米からの栽培にも取り組む。' },
  '富久千代酒造': { city: '鹿島市', founded: 1922, desc: '「鍋島」の蔵。IWCチャンピオン・サケに輝き、佐賀鹿島の小さな蔵から世界へ。果実味とガス感の心地よさが身上。' },
  '南陽醸造': { city: '羽生市', founded: 1860, desc: '家族経営の小さな蔵が醸す「花陽浴」。パイナップルと形容される圧倒的な果実香で、抽選必至の人気を誇る。' },
  '西田酒造店': { city: '青森市', founded: 1878, desc: '「田酒」の蔵。青森の米と水にこだわり、派手さよりも飲むほどに沁みる米の旨みの王道を行く。' },
  '宮泉銘醸': { city: '会津若松市', founded: 1955, desc: '「寫樂」で全国に名を馳せた会津若松の実力蔵。フレッシュ&ジューシーな酒質と外さない安定感で酒販店の信頼が厚い。' },
};

// [name, col, row] on a 12-column tile grid
export const prefGrid: [string, number, number][] = [
  ['北海道', 12, 1], ['青森', 12, 2], ['秋田', 11, 3], ['岩手', 12, 3], ['山形', 11, 4], ['宮城', 12, 4],
  ['新潟', 10, 5], ['福島', 11, 5],
  ['石川', 8, 6], ['富山', 9, 6], ['長野', 10, 6], ['群馬', 11, 6], ['栃木', 12, 6],
  ['福井', 8, 7], ['岐阜', 9, 7], ['山梨', 10, 7], ['埼玉', 11, 7], ['茨城', 12, 7],
  ['島根', 4, 8], ['鳥取', 5, 8], ['京都', 7, 8], ['滋賀', 8, 8], ['愛知', 9, 8], ['静岡', 10, 8], ['東京', 11, 8], ['千葉', 12, 8],
  ['佐賀', 1, 9], ['福岡', 2, 9], ['山口', 3, 9], ['広島', 4, 9], ['岡山', 5, 9], ['兵庫', 6, 9], ['大阪', 7, 9], ['奈良', 8, 9], ['三重', 9, 9], ['神奈川', 11, 9],
  ['長崎', 1, 10], ['熊本', 2, 10], ['大分', 3, 10], ['愛媛', 5, 10], ['香川', 6, 10], ['和歌山', 8, 10],
  ['沖縄', 1, 11], ['鹿児島', 2, 11], ['宮崎', 3, 11], ['高知', 5, 11], ['徳島', 6, 11],
];

export const bars: Bar[] = [
  { id: 'wasabi', name: '立ち飲み わさび', area: '大阪・天満', type: '立ち飲み', venueQ: '天満 大阪 立ち飲み', brands: ['juyondai', 'jikon', 'nabeshima'], note: '希少銘柄が日替わりで並ぶ天満の名店。10種以上を少量から飲み比べできる。' },
  { id: 'fukube', name: 'おでん ふくべ', area: '東京・八重洲', type: '居酒屋', venueQ: '八重洲 東京 おでん', brands: ['denshu', 'kubota', 'hououbiden'], note: '昭和14年創業。燗酒とおでんの黄金コンビを求めて常連が通う。' },
  { id: 'aburacho', name: '角打ち 油長', area: '奈良・御所', type: '角打ち', venueQ: '御所市 奈良 油長酒造', brands: ['kazenomori'], note: '風の森の蔵元直営。搾りたての一杯を蔵の隣で味わえる。' },
  { id: 'komachi', name: '居酒屋 こまち', area: '新潟・古町', type: '居酒屋', venueQ: '古町 新潟 居酒屋', brands: ['kubota', 'denshu'], note: '新潟地酒と日本海の肴。淡麗辛口の聖地のような一軒。' },
  { id: 'sagasushi', name: '鮨 さが', area: '佐賀・鹿島', type: '寿司', venueQ: '鹿島市 佐賀 鮨', brands: ['nabeshima'], note: '鍋島を地元で。イカの活造りと果実味の競演が名物。' },
];

export const byId = (id: string | null | undefined): Brand | undefined => brands.find(b => b.id === id);
export const memberOf = (name: string): Member =>
  members.find(m => m.name === name) || { name, display: name, avatar: (name || '?').charAt(0), avatarBg: '#DDD3BE' };
