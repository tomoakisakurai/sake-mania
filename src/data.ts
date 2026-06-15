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
  { id: 'hiroki', name: '飛露喜 特別純米', brewery: '廣木酒造本店', pref: '福島', cls: '特別純米 無濾過生原酒', polish: '55%', rice: '五百万石', yeast: '非公開', smv: '+2.0', abv: '16%', temp: '冷酒', x: 58, y: 34, rating: 4.6, count: 238, tags: ['ジューシー', '旨み', 'キレ'], desc: '廃業寸前から「飛露喜」で復活し、淡麗から旨口への潮流を作った会津坂下の名蔵。透明感ある旨みとシャープな後口。' },
  { id: 'kokuryu', name: '黒龍 いっちょらい', brewery: '黒龍酒造', pref: '福井', cls: '吟醸', polish: '55%', rice: '五百万石', yeast: '非公開', smv: '+4.0', abv: '15%', temp: '冷酒・常温', x: 36, y: 42, rating: 4.2, count: 184, tags: ['上品', '端麗'], desc: '越前の銘醸蔵。「いっちょらい」は福井弁で一張羅。気品ある吟醸香と滑らかな喉ごし、料理を引き立てる端正な酒質。' },
  { id: 'zaku', name: '作 雅乃智 中取り', brewery: '清水清三郎商店', pref: '三重', cls: '純米大吟醸', polish: '50%', rice: '山田錦', yeast: '非公開', smv: '非公開', abv: '16%', temp: '冷酒', x: 46, y: 26, rating: 4.4, count: 209, tags: ['エレガント', 'フルーティ', '伊勢志摩サミット'], desc: '伊勢志摩サミットの乾杯酒に選ばれた鈴鹿の蔵。きめ細やかな泡と華やかさ、洗練された甘みと酸のバランスが世界に評価された。' },
  { id: 'isojiman', name: '磯自慢 純米吟醸', brewery: '磯自慢酒造', pref: '静岡', cls: '純米吟醸', polish: '55%', rice: '山田錦', yeast: '静岡酵母', smv: '+5.0', abv: '16%', temp: '冷酒', x: 40, y: 34, rating: 4.4, count: 176, tags: ['上品', 'キレ', '吟醸香'], desc: '焼津の名門。静岡酵母由来の上品な吟醸香とクリアでシャープな後口。サミット晩餐会にも供された格式高い一本。' },
  { id: 'tatenokawa', name: '楯野川 清流 純米大吟醸', brewery: '楯の川酒造', pref: '山形', cls: '純米大吟醸', polish: '50%', rice: '出羽燦々', yeast: '非公開', smv: '±0.0', abv: '15%', temp: '冷酒', x: 42, y: 30, rating: 4.2, count: 158, tags: ['全量純米大吟醸', '綺麗', '軽快'], desc: '全量純米大吟醸を掲げる酒田の蔵。クリアで軽快な飲み口と穏やかな果実香。食事に寄り添うデイリーな大吟醸。' },
  { id: 'yukinobosha', name: '雪の茅舎 純米吟醸', brewery: '齋彌酒造店', pref: '秋田', cls: '純米吟醸', polish: '55%', rice: '山田錦・秋田酒こまち', yeast: '自社酵母', smv: '+2.0', abv: '16%', temp: '冷酒・常温', x: 48, y: 46, rating: 4.2, count: 149, tags: ['やわらか', '櫂入れせず', '自然派'], desc: '櫂入れせず・濾過せず・割水せずの三無い造り。秋田由利本荘の蔵が醸す、やわらかく繊細でふくらみのある酒質。' },
  { id: 'senkin', name: '仙禽 オーガニック・ナチュール', brewery: 'せんきん', pref: '栃木', cls: '純米', polish: '90%', rice: 'ドメーヌさくら 亀ノ尾', yeast: '蔵付酵母', smv: '非公開', abv: '14%', temp: '冷酒', x: 64, y: 28, rating: 4.1, count: 142, tags: ['酸', '甘酸', 'ナチュール'], desc: 'さくら市の蔵。江戸返り・ドメーヌ化を掲げ、地元の水と米と蔵付酵母で醸す。甘酸っぱくジューシーなモダン酒の旗手。' },
  { id: 'kid', name: '紀土 KID 純米吟醸', brewery: '平和酒造', pref: '和歌山', cls: '純米吟醸', polish: '50%', rice: '山田錦・五百万石', yeast: '非公開', smv: '+2.0', abv: '15%', temp: '冷酒・常温', x: 38, y: 30, rating: 4.1, count: 167, tags: ['軽快', 'コスパ', '清涼'], desc: '「水の国、和歌山。」を掲げる海南の蔵。やわらかな水を思わせる清涼感と軽快な甘み。価格以上の満足度で人気。' },
  { id: 'shichihonyari', name: '七本鎗 純米', brewery: '冨田酒造', pref: '滋賀', cls: '純米', polish: '60%', rice: '玉栄', yeast: '非公開', smv: '+4.0', abv: '15%', temp: '常温・燗', x: 60, y: 64, rating: 4.0, count: 121, tags: ['米の旨み', '燗映え', '滋賀の地酒'], desc: '賤ヶ岳の七本槍に由来する湖北の老舗。地元産米にこだわり、骨太で米の旨みがしっかり乗る、燗で映える食中酒。' },
  { id: 'shimeharitsuru', name: '〆張鶴 純', brewery: '宮尾酒造', pref: '新潟', cls: '純米吟醸', polish: '50%', rice: '五百万石', yeast: '非公開', smv: '+3.0', abv: '15%', temp: '冷酒・ぬる燗', x: 28, y: 54, rating: 4.1, count: 138, tags: ['淡麗', '上品', '定番'], desc: '村上の銘酒。淡麗ながらほのかな旨みと気品があり、すっと消える後口。新潟淡麗の中でもやわらかさで愛される。' },
  { id: 'hakkaisan', name: '八海山 特別本醸造', brewery: '八海醸造', pref: '新潟', cls: '特別本醸造', polish: '55%', rice: '五百万石ほか', yeast: '非公開', smv: '+5.0', abv: '15.5%', temp: '冷酒・燗', x: 24, y: 60, rating: 4.0, count: 201, tags: ['淡麗辛口', '食中', '定番'], desc: '南魚沼の大蔵。雪国の清冽な水で醸す淡麗辛口の代表格。毎日飲んでも飽きない、食事を静かに支える普段使いの名酒。' },
  { id: 'dewazakura', name: '出羽桜 桜花吟醸酒', brewery: '出羽桜酒造', pref: '山形', cls: '吟醸', polish: '50%', rice: '出羽燦々ほか', yeast: '非公開', smv: '+5.0', abv: '15%', temp: '冷酒', x: 34, y: 24, rating: 4.1, count: 173, tags: ['吟醸香', '定番', '華やか'], desc: '吟醸酒ブームの火付け役。手頃な価格で華やかな吟醸香を楽しめる「桜花」は、吟醸入門の定番として長く愛される。' },
  { id: 'urakasumi', name: '浦霞 禅 純米吟醸', brewery: '佐浦', pref: '宮城', cls: '純米吟醸', polish: '50%', rice: '山田錦・トヨニシキ', yeast: '非公開', smv: '+1.0', abv: '15.5%', temp: '冷酒・常温', x: 40, y: 50, rating: 4.1, count: 156, tags: ['上品', '食中', 'バランス'], desc: '塩竈の老舗。「禅」は穏やかな香りとふくよかな旨み、綺麗な後口のバランスが見事。和食に静かに寄り添う food-friendly。' },
  { id: 'kaiun', name: '開運 祝酒 特別本醸造', brewery: '土井酒造場', pref: '静岡', cls: '特別本醸造', polish: '60%', rice: '山田錦ほか', yeast: '静岡酵母', smv: '+5.0', abv: '15%', temp: '冷酒・燗', x: 30, y: 56, rating: 4.0, count: 119, tags: ['辛口', 'スッキリ', '縁起'], desc: '掛川の蔵。名杜氏・波瀬正吉の流れを汲む。すっきりとした辛口で晴れの日にふさわしい「祝酒」。コスパにも優れる。' },
  { id: 'masumi', name: '真澄 あらばしり', brewery: '宮坂醸造', pref: '長野', cls: '吟醸 生酒', polish: '55%', rice: '美山錦ほか', yeast: '7号', smv: '+2.0', abv: '15%', temp: '冷酒', x: 38, y: 38, rating: 4.1, count: 134, tags: ['7号酵母発祥', 'やわらか', '生酒'], desc: '協会7号酵母発祥の諏訪の蔵。「あらばしり」はフレッシュで華やか。穏やかな香りとやわらかな飲み口は7号の真骨頂。' },
  { id: 'daishichi', name: '大七 純米生酛', brewery: '大七酒造', pref: '福島', cls: '純米(生酛)', polish: '69%', rice: '五百万石ほか', yeast: '非公開', smv: '+3.0', abv: '15%', temp: 'ぬる燗◎', x: 66, y: 62, rating: 4.2, count: 162, tags: ['生酛', 'コク', '燗映え'], desc: '生酛造り一筋の二本松の蔵。扁平精米による綺麗な雑味のなさと、生酛らしいコクと酸。燗にすると旨みが大きく開く。' },
  { id: 'tengumai', name: '天狗舞 山廃仕込純米酒', brewery: '車多酒造', pref: '石川', cls: '純米(山廃)', polish: '60%', rice: '五百万石ほか', yeast: '非公開', smv: '+4.0', abv: '16%', temp: '常温・燗◎', x: 74, y: 58, rating: 4.2, count: 158, tags: ['山廃', '濃醇', '黄金色'], desc: '山廃仕込の代名詞。黄金色に色づく濃醇な旨みと力強い酸。白山の蔵が放つ、燗で真価を発揮する濃厚旨口の王者。' },
  { id: 'kikuhime', name: '菊姫 山廃純米', brewery: '菊姫', pref: '石川', cls: '純米(山廃)', polish: '70%', rice: '山田錦', yeast: '非公開', smv: '+1.5', abv: '16%', temp: 'ぬる燗◎', x: 72, y: 60, rating: 4.1, count: 137, tags: ['山廃', '熟成', '力強い'], desc: '加賀の剛醸。山田錦を用いた山廃純米は、熟成を経て力強い旨みと複雑味を増す。骨太な味わいを好む者を唸らせる。' },
  { id: 'kakurei', name: '鶴齢 純米', brewery: '青木酒造', pref: '新潟', cls: '純米', polish: '65%', rice: '五百万石', yeast: '非公開', smv: '+3.0', abv: '15%', temp: '冷酒・燗', x: 50, y: 52, rating: 4.0, count: 112, tags: ['旨口', 'やわらか', '魚沼'], desc: '魚沼塩沢の老舗。淡麗一辺倒の新潟にあって、ふくよかでやわらかな旨口を貫く。雪室の里が育む滋味深い食中酒。' },
  { id: 'ugonotsuki', name: '雨後の月 純米大吟醸', brewery: '相原酒造', pref: '広島', cls: '純米大吟醸', polish: '50%', rice: '山田錦', yeast: '非公開', smv: '非公開', abv: '16%', temp: '冷酒', x: 44, y: 28, rating: 4.2, count: 129, tags: ['華やか', '上品', '果実香'], desc: '呉の蔵。月光のように澄んだ酒を目指す。華やかな果実香と上品な甘み、繊細でクリアな酒質が女性人気も高い。' },
  { id: 'oroku', name: '王禄 丈径', brewery: '王禄酒造', pref: '島根', cls: '純米', polish: '70%', rice: '山田錦', yeast: '非公開', smv: '非公開', abv: '16%', temp: '冷酒・常温', x: 62, y: 46, rating: 4.2, count: 108, tags: ['力強い', '旨み', '無濾過'], desc: '松江の小蔵が一切妥協なく醸す通好みの酒。「丈径」は凝縮した旨みと張りのある酸。生詰の鮮度管理にも徹底的にこだわる。' },
  { id: 'shinomine', name: '篠峯 純米吟醸', brewery: '千代酒造', pref: '奈良', cls: '純米吟醸', polish: '55%', rice: '山田錦', yeast: '非公開', smv: '+3.0', abv: '16%', temp: '冷酒・常温', x: 54, y: 42, rating: 4.1, count: 96, tags: ['酸', 'しっかり', '食中'], desc: '葛城山麓の蔵。「篠峯」は伸びやかな酸としっかりした飲み応え。多彩なラインナップでマニアの支持を集める奈良の実力蔵。' },
  { id: 'kagatobi', name: '加賀鳶 純米大吟醸', brewery: '福光屋', pref: '石川', cls: '純米大吟醸', polish: '50%', rice: '山田錦', yeast: '非公開', smv: '+5.0', abv: '16%', temp: '冷酒', x: 40, y: 44, rating: 4.0, count: 124, tags: ['全量純米', '綺麗', 'キレ'], desc: '金沢最古の蔵で全量純米醸造。「加賀鳶」は綺麗な含み香とシャープなキレ。伝統の技で安定した品質を保つ。' },
  { id: 'daishinshu', name: '大信州 純米大吟醸', brewery: '大信州酒造', pref: '長野', cls: '純米大吟醸', polish: '49%', rice: 'ひとごこち', yeast: '非公開', smv: '非公開', abv: '16%', temp: '冷酒', x: 42, y: 26, rating: 4.1, count: 101, tags: ['香り高い', '華やか', '信州'], desc: '松本の蔵。契約栽培の長野県産米にこだわり、果実を思わせる華やかな香りとみずみずしい甘み。安曇野の伏流水が育む。' },
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
  '廣木酒造本店': { city: '会津坂下町', founded: 1625, desc: '「飛露喜」の蔵。廃業寸前から無濾過生原酒で復活し、淡麗から旨口への時代の転換点を作った会津坂下の名門。' },
  '黒龍酒造': { city: '永平寺町', founded: 1804, desc: '越前の銘醸蔵。日本酒における大吟醸の高級化を早くから追求し、気品ある酒質で全国の食通を魅了し続ける。' },
  '清水清三郎商店': { city: '鈴鹿市', founded: 1869, desc: '鈴鹿の蔵。「作(ざく)」が伊勢志摩サミットの乾杯酒に選ばれ世界へ。洗練された甘みと酸、きめ細やかな泡が身上。' },
  '磯自慢酒造': { city: '焼津市', founded: 1830, desc: '焼津の名門。静岡酵母由来の上品な吟醸香とクリアな後口で知られ、サミット晩餐会にも供された格式高い蔵。' },
  '楯の川酒造': { city: '酒田市', founded: 1832, desc: '全量純米大吟醸を掲げる酒田の蔵。「楯野川」でクリアかつ軽快な大吟醸を日常に。挑戦的な商品開発でも知られる。' },
  '齋彌酒造店': { city: '由利本荘市', founded: 1902, desc: '「雪の茅舎」の蔵。櫂入れせず・濾過せず・割水せずの自然な造りで、やわらかく繊細な酒質を生む秋田の蔵。' },
  'せんきん': { city: 'さくら市', founded: 1806, desc: '「仙禽」の蔵。江戸返り・ドメーヌ化を掲げ、地元の水・米・蔵付酵母にこだわる。甘酸っぱくモダンな酒の旗手。' },
  '平和酒造': { city: '海南市', founded: 1928, desc: '「紀土」「平和クラフト」の蔵。「水の国、和歌山。」を掲げ、清涼感ある軽快な酒質とコストパフォーマンスで人気。' },
  '冨田酒造': { city: '長浜市', founded: 1534, desc: '賤ヶ岳の七本槍に由来する湖北の老舗。地元産米にこだわり、骨太で燗映えする滋賀の地酒を醸し続ける。' },
  '宮尾酒造': { city: '村上市', founded: 1819, desc: '「〆張鶴」の蔵。村上の銘酒として、淡麗ながら気品とやわらかさを湛えた酒質で長く愛される。' },
  '八海醸造': { city: '南魚沼市', founded: 1922, desc: '「八海山」の蔵。雪国の清冽な水で醸す淡麗辛口の代表格。普段使いの食中酒として全国区の人気を誇る大蔵。' },
  '出羽桜酒造': { city: '天童市', founded: 1892, desc: '吟醸酒ブームの火付け役。「桜花吟醸酒」で華やかな吟醸香を手頃に広め、吟醸入門の定番を作った天童の蔵。' },
  '佐浦': { city: '塩竈市', founded: 1724, desc: '「浦霞」の蔵。塩竈の老舗として穏やかな香りとふくよかな旨み、綺麗な後口の food-friendly な酒を醸す。' },
  '土井酒造場': { city: '掛川市', founded: 1872, desc: '「開運」の蔵。名杜氏・波瀬正吉の流れを汲み、すっきりとした辛口と縁起の良い酒名で親しまれる掛川の蔵。' },
  '宮坂醸造': { city: '諏訪市', founded: 1662, desc: '協会7号酵母発祥の「真澄」の蔵。穏やかでやわらかな7号らしい酒質を、諏訪の地で長く守り続ける。' },
  '大七酒造': { city: '二本松市', founded: 1752, desc: '生酛造り一筋の二本松の蔵。扁平精米による綺麗さと生酛のコク・酸を両立。燗で大きく開く濃醇旨口。' },
  '車多酒造': { city: '白山市', founded: 1823, desc: '「天狗舞」の蔵。山廃仕込の代名詞として、黄金色の濃醇な旨みと力強い酸を放つ加賀の銘醸蔵。' },
  '菊姫': { city: '白山市', founded: 1822, desc: '加賀の剛醸「菊姫」。山田錦を活かした山廃純米は熟成で力強い旨みと複雑味を増す、骨太な味わいの蔵。' },
  '青木酒造': { city: '南魚沼市', founded: 1717, desc: '「鶴齢」の蔵。淡麗が主流の新潟にあって、ふくよかでやわらかな旨口を貫く魚沼塩沢の老舗。' },
  '相原酒造': { city: '呉市', founded: 1875, desc: '「雨後の月」の蔵。月光のように澄んだ酒を目指し、華やかな果実香と上品な甘みの繊細な酒質を醸す呉の蔵。' },
  '王禄酒造': { city: '松江市', founded: 1764, desc: '松江の小蔵。一切妥協のない酒造りと徹底した鮮度管理で、凝縮した旨みと張りのある酸の通好みの酒を生む。' },
  '千代酒造': { city: '御所市', founded: 1873, desc: '葛城山麓の蔵。「篠峯」で伸びやかな酸としっかりした飲み応えを表現し、多彩なラインナップでマニアを惹きつける。' },
  '福光屋': { city: '金沢市', founded: 1625, desc: '金沢最古の蔵で全量純米醸造。「加賀鳶」など綺麗でキレのある酒を、伝統の技と安定した品質で届ける。' },
  '大信州酒造': { city: '松本市', founded: 1888, desc: '松本の蔵。契約栽培の長野県産米にこだわり、安曇野の伏流水で華やかでみずみずしい大吟醸を醸す。' },
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
