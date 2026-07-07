/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AudioSample, DialectWord, MapRegion, LeaderboardUser } from './types';

export const DEMO_WORDS: DialectWord[] = [
  {
    id: 'w1',
    word: 'răng',
    region: 'Huế',
    meaning: 'sao, tại sao, thế nào',
    exampleSentence: 'Răng bữa ni mi đi học trễ rứa?',
    standardTranslation: 'Sao hôm nay bạn đi học trễ thế?',
    culturalNote: 'Từ "răng" là từ hỏi kinh điển của dải đất miền Trung, đặc biệt là người Huế và xứ Quảng. Nó xuất hiện rộng rãi trong ca dao, dân ca và thơ Phú Xuân.',
    popularityScore: 92
  },
  {
    id: 'w2',
    word: 'mô',
    region: 'Huế',
    meaning: 'đâu, chỗ nào',
    exampleSentence: 'Mệ đi mô rứa?',
    standardTranslation: 'Bà đi đâu vậy?',
    culturalNote: 'Từ "mô" dùng để hỏi vị trí hoặc phủ định hoàn toàn ("có thấy chi mô" = không thấy gì cả).',
    popularityScore: 95
  },
  {
    id: 'w3',
    word: 'rứa',
    region: 'Huế',
    meaning: 'vậy, thế, thế kia',
    exampleSentence: 'Răng mà đẹp rứa!',
    standardTranslation: 'Sao mà đẹp thế!',
    culturalNote: 'Sự kết hợp của "mô - răng - rứa - tê" tạo nên nhạc điệu bổng trầm đặc thù của phương ngữ Thừa Thiên Huế, thường có âm điệu trầm buồn đặc trưng.',
    popularityScore: 89
  },
  {
    id: 'w4',
    word: 'mệ',
    region: 'Huế',
    meaning: 'bà (nội/ngoại), người phụ nữ lớn tuổi có vai vế',
    exampleSentence: 'Mệ có khỏe không mệ?',
    standardTranslation: 'Bà có khỏe không bà?',
    culturalNote: 'Ở Huế, "Mệ" là từ tôn kính gọi bà hoặc người lớn tuổi, xuất phát từ cách gọi hoàng tộc triều Nguyễn (ví dụ các Mệ).',
    popularityScore: 85
  },
  {
    id: 'w5',
    word: 'chừ',
    region: 'Huế',
    meaning: 'giờ, bây giờ',
    exampleSentence: 'Chừ mần răng đây mệ?',
    standardTranslation: 'Giờ làm thế nào đây bà?',
    culturalNote: 'Ghép từ "chữ ni" thành giờ này, "chừ" chỉ thời gian hiện tại diễn ra hành động.',
    popularityScore: 82
  },
  {
    id: 'w6',
    word: 'hổng',
    region: 'Nam Bộ',
    meaning: 'không',
    exampleSentence: 'Tui hổng chịu đâu à nghen.',
    standardTranslation: 'Tôi không chịu đâu nhé.',
    culturalNote: 'Người Nam Bộ biến âm từ "không" thành "hông" rồi "hổng", mang sắc thái nhẹ nhàng, nũng nịu và dễ mến.',
    popularityScore: 97
  },
  {
    id: 'w7',
    word: 'bển',
    region: 'Nam Bộ',
    meaning: 'bên ấy, bên đó',
    exampleSentence: 'Má mới đi qua bển chơi rồi.',
    standardTranslation: 'Mẹ mới đi qua bên kia chơi rồi.',
    culturalNote: 'Người miền Tây có thói quen gộp từ và thêm dấu hỏi đại diện cho từ chỉ khoảng cách: bên ấy -> bển, bên kia -> bển, dưới ấy -> dướiẩ, trong ấy -> trongẩ.',
    popularityScore: 88
  },
  {
    id: 'w8',
    word: 'mần',
    region: 'Nam Bộ',
    meaning: 'làm',
    exampleSentence: 'Bữa nay mần cái gì ăn ngon ngon đi tui phụ.',
    standardTranslation: 'Hôm nay làm món gì ăn ngon ngon đi tôi giúp.',
    culturalNote: 'Từ "mần" dùng cả ở miền Trung và miền Nam, nhưng ở Nam Bộ từ này mang màu sắc sông nước nông nghiệp chân chất giản dị.',
    popularityScore: 94
  },
  {
    id: 'w9',
    word: 'dữ hôn',
    region: 'Nam Bộ',
    meaning: 'quá trời, dữ dội, ghê thế',
    exampleSentence: 'Bữa nay trời mát dữ hôn.',
    standardTranslation: 'Hôm nay trời mát lạnh quá trời luôn.',
    culturalNote: '"Dữ hôn" (hay dữ thần) đặt ở cuối câu để tăng sắc thái cảm thán khẳng định cho hiện tượng trước đó.',
    popularityScore: 86
  },
  {
    id: 'w10',
    word: 'tui',
    region: 'Nam Bộ',
    meaning: 'tôi, mình',
    exampleSentence: 'Tui nói cho nghe nè.',
    standardTranslation: 'Tôi nói cho nghe này.',
    culturalNote: 'Đại từ nhân xưng thân mật tạo mối quan hệ bình đẳng mang đậm văn hóa khẩn hoang sông nước Nam Bộ.',
    popularityScore: 91
  },
  {
    id: 'w11',
    word: 'nhỉ',
    region: 'Bắc Bộ',
    meaning: 'nhé, nha (từ biểu thị sự đồng tình ở cuối câu)',
    exampleSentence: 'Hôm nay thời tiết đẹp quá nhỉ!',
    standardTranslation: 'Hôm nay thời tiết đẹp quá nha!',
    culturalNote: 'Từ đệm cuối câu đặc trưng của người Hà Nội và đồng bằng sông Hồng thể hiện sự lịch thiệp, gợi chuyện kết nối.',
    popularityScore: 93
  },
  {
    id: 'w12',
    word: 'đấy',
    region: 'Bắc Bộ',
    meaning: 'đó (từ chỉ vị trí hoặc nhấn mạnh)',
    exampleSentence: 'Bạn đi đâu đấy?',
    standardTranslation: 'Bạn đi đâu thế?',
    culturalNote: 'Sử dụng thường xuyên để hỏi han tự nhiên giữa hàng xóm láng giềng xưa vùng nông thôn Bắc Bộ.',
    popularityScore: 90
  },
  {
    id: 'w13',
    word: 'cơ mà',
    region: 'Bắc Bộ',
    meaning: 'nhưng mà, vậy mà',
    exampleSentence: 'Tôi dặn bạn rồi cơ mà.',
    standardTranslation: 'Tôi dặn bạn rồi mà lại.',
    culturalNote: 'Cụm nhấn mạnh điều kiện đã biết hoặc tỏ thái độ giải thích nhẹ nhàng.',
    popularityScore: 85
  },
  {
    id: 'w14',
    word: 'chi',
    region: 'Quảng Nam',
    meaning: 'gì, cái gì',
    exampleSentence: 'Nói cái chi rứa mi?',
    standardTranslation: 'Nói cái gì thế bạn?',
    culturalNote: 'Người xứ Quảng thường đổi các nguyên âm chính, âm sắc gãy gọn, nặng trĩu chất phù sa dòng Thu Bồn.',
    popularityScore: 89
  },
  {
    id: 'w15',
    word: 'nỏ',
    region: 'Nghệ Tĩnh',
    meaning: 'không, chả',
    exampleSentence: 'Tui nỏ biết chi mô.',
    standardTranslation: 'Tôi không biết gì đâu nhé.',
    culturalNote: '"Nỏ" là đặc trưng rất riêng biệt của xứ Nghệ (Nghệ An & Hà Tĩnh), khẳng định sự từ chối thẳng thắn nhưng đầy cảm xúc mộc mạc.',
    popularityScore: 92
  }
];

export const DEMO_SAMPLES: AudioSample[] = [
  {
    id: 's1',
    title: 'Giọng cụ bà Vĩ Dạ - Thừa Thiên Huế',
    region: 'Huế',
    province: 'Thừa Thiên Huế',
    speakerAgeGroup: 'Trên 50',
    speakerGender: 'Nữ',
    speakerName: 'Bà Nguyễn Thị Tâm (65 tuổi)',
    topic: 'Sinh hoạt hằng ngày',
    audioUrl: 'hue_me_di_mo',
    duration: '00:14',
    transcriptAi: 'mệ đi mô rứa mệ ơi mệ đi chợ chừ về răng rứa',
    transcriptVerified: 'Mệ đi mô rứa mệ? Mệ đi chợ chừ về răng rứa?',
    standardVietnameseTranslation: 'Bà đi đâu vậy bà? Bà đi chợ giờ về sao thế?',
    dialectWords: ['mệ', 'mô', 'rứa', 'chừ', 'răng'],
    status: 'approved',
    likes: 45,
    plays: 231,
    createdAt: '2026-05-12T10:11:00Z',
    audioQuality: {
      volume: 'Tốt',
      noise: 'Thấp',
      duration: 14,
      score: 96
    }
  },
  {
    id: 's2',
    title: 'Ký ức miền Tây sông nước - Cần Thơ',
    region: 'Nam Bộ',
    province: 'Cần Thơ',
    speakerAgeGroup: '18-30',
    speakerGender: 'Nam',
    speakerName: 'Lê Minh Triết (24 tuổi)',
    topic: 'Ký ức quê hương',
    audioUrl: 'nambo_bua_nay',
    duration: '00:11',
    transcriptAi: 'bữa nay trời mát dữ hôn qua bển mần chút chuyện rồi tui dìa',
    transcriptVerified: 'Bữa nay trời mát dữ hôn. Qua bển mần chút chuyện rồi tui dìa.',
    standardVietnameseTranslation: 'Hôm nay trời rất mát mẻ. Qua bên kia làm chút công việc rồi tôi về.',
    dialectWords: ['bữa nay', 'dữ hôn', 'bển', 'mần', 'tui', 'dìa'],
    status: 'approved',
    likes: 38,
    plays: 189,
    createdAt: '2026-05-15T08:24:00Z',
    audioQuality: {
      volume: 'Tốt',
      noise: 'Thấp',
      duration: 11,
      score: 94
    }
  },
  {
    id: 's3',
    title: 'Thời tiết đông Hà Nội - Hoàn Kiếm',
    region: 'Bắc Bộ',
    province: 'Hà Nội',
    speakerAgeGroup: '31-50',
    speakerGender: 'Nữ',
    speakerName: 'Phạm Thu Trang (35 tuổi)',
    topic: 'Ký ức quê hương',
    audioUrl: 'bacbo_troi_ret',
    duration: '00:10',
    transcriptAi: 'trời rét quá đi mất lạnh buốt thế này đi ra ngoài đường ngại nhỉ',
    transcriptVerified: 'Trời rét quá đi mất! Lạnh buốt thế này đi ra ngoài đường ngại nhỉ?',
    standardVietnameseTranslation: 'Trời lạnh quá đi mất! Lạnh buốt thế này đi ra ngoài đường rất ngại đúng không?',
    dialectWords: ['nhỉ', 'đấy'],
    status: 'approved',
    likes: 27,
    plays: 142,
    createdAt: '2026-05-20T14:30:00Z',
    audioQuality: {
      volume: 'Tốt',
      noise: 'Trung bình',
      duration: 10,
      score: 90
    }
  },
  {
    id: 's4',
    title: 'Tiếng hỏi xứ Quảng - Điện Bàn',
    region: 'Quảng Nam',
    province: 'Quảng Nam',
    speakerAgeGroup: '18-30',
    speakerGender: 'Nam',
    speakerName: 'Trần Thanh Nam (18 tuổi)',
    topic: 'Sinh hoạt hằng ngày',
    audioUrl: 'quangnam_mi_di',
    duration: '00:09',
    transcriptAi: 'mi đi mô rứa mi đi qua nhà tao mần chi đó',
    transcriptVerified: 'Mi đi mô rứa? Mi đi qua nhà tao mần chi đó?',
    standardVietnameseTranslation: 'Bạn đi đâu thế? Bạn đi qua nhà tôi làm gì đấy?',
    dialectWords: ['mi', 'mô', 'rứa', 'tao', 'mần', 'chi'],
    status: 'approved',
    likes: 31,
    plays: 115,
    createdAt: '2026-05-22T09:15:00Z',
    audioQuality: {
      volume: 'Thấp',
      noise: 'Thấp',
      duration: 9,
      score: 88
    }
  },
  {
    id: 's5',
    title: 'Câu ca xứ Nghệ mộc mạc - Hà Tĩnh',
    region: 'Nghệ Tĩnh',
    province: 'Hà Tĩnh',
    speakerAgeGroup: 'Trên 50',
    speakerGender: 'Nam',
    speakerName: 'Bác Nguyễn Phan Vy (52 tuổi)',
    topic: 'Ca dao tục ngữ',
    audioUrl: 'nghetinh_nỏ_biết',
    duration: '00:12',
    transcriptAi: 'tui nỏ biết mô mần chi răng rứa tui thương xứ nghệ mình lắm',
    transcriptVerified: 'Tui nỏ biết chi mô. Mần răng rứa? Tui thương xứ Nghệ mình lắm.',
    standardVietnameseTranslation: 'Tôi không biết gì đâu. Làm thế nào vậy? Tôi yêu quý xứ Nghệ của mình lắm.',
    dialectWords: ['tui', 'nỏ', 'chi', 'mô', 'mần', 'răng', 'rứa'],
    status: 'approved',
    likes: 42,
    plays: 198,
    createdAt: '2026-05-25T11:02:00Z',
    audioQuality: {
      volume: 'Tốt',
      noise: 'Thấp',
      duration: 12,
      score: 95
    }
  },
  {
    id: 's6',
    title: 'Ký ức tuổi thơ mưa lụt xứ Huế',
    region: 'Huế',
    province: 'Thừa Thiên Huế',
    speakerAgeGroup: '31-50',
    speakerGender: 'Nữ',
    speakerName: 'Chị Lê Thị Oanh (38 tuổi)',
    topic: 'Ký ức quê hương',
    audioUrl: 'hue_mua_lut',
    duration: '00:15',
    transcriptAi: 'hồi xưa mưa lụt nước ngập ngang thắt lưng đi mô cũng lội rứa mà vui',
    transcriptVerified: 'Hồi xưa mưa lụt nước ngập ngang thắt lưng, đi mô cũng lội rứa mà vui.',
    standardVietnameseTranslation: 'Ngày xưa mưa lụt nước ngập ngang hông, đi đâu cũng phải lội thế mà lại vui.',
    dialectWords: ['mô', 'rứa'],
    status: 'pending',
    likes: 0,
    plays: 5,
    createdAt: '2026-06-02T13:45:00Z',
    audioQuality: {
      volume: 'Tốt',
      noise: 'Trung bình',
      duration: 15,
      score: 85
    }
  }
];

export const DEMO_REGIONS: MapRegion[] = [
  {
    id: 'reg_bac',
    regionName: 'Bắc Bộ',
    provinces: ['Hà Nội', 'Hải Phòng', 'Bắc Ninh', 'Nam Định', 'Thái Bình', 'Ninh Bình'],
    sampleCount: 412,
    wordCount: 120,
    commonWords: ['nhỉ', 'đấy', 'cơ mà', 'thế à', 'thế hả', 'u', 'bố'],
    culturalTags: ['Thăng Long', 'Hát quan họ', 'Đồng bằng sông Hồng', 'Làng cổ'],
    coordinates: { x: 30, y: 15 },
    stats: { maleCount: 200, femaleCount: 212, under18: 45, from18to30: 150, from31to50: 140, above50: 77 }
  },
  {
    id: 'reg_nghe',
    regionName: 'Nghệ Tĩnh',
    provinces: ['Nghệ An', 'Hà Tĩnh'],
    sampleCount: 203,
    wordCount: 74,
    commonWords: ['mô', 'tê', 'răng', 'rứa', 'nỏ', 'chi', 'ngái', 'trốc'],
    culturalTags: ['Sông Lam', 'Núi Hồng', 'Ví Giặm', 'Đồ Sơn'],
    coordinates: { x: 36, y: 32 },
    stats: { maleCount: 98, femaleCount: 105, under18: 20, from18to30: 65, from31to50: 78, above50: 40 }
  },
  {
    id: 'reg_hue',
    regionName: 'Huế',
    provinces: ['Thừa Thiên Huế', 'Quảng Trị', 'Quảng Bình'],
    sampleCount: 538,
    wordCount: 156,
    commonWords: ['mệ', 'mô', 'răng', 'rứa', 'chừ', 'tê', 'mung', 'gấy', 'bọ'],
    culturalTags: ['Sông Hương', 'Cố đô', 'Ca Huế', 'Nam Giao', 'Áo dài'],
    coordinates: { x: 42, y: 45 },
    stats: { maleCount: 250, femaleCount: 288, under18: 58, from18to30: 180, from31to50: 190, above50: 110 }
  },
  {
    id: 'reg_quang',
    regionName: 'Quảng Nam',
    provinces: ['Quảng Nam', 'Đà Nẵng', 'Quảng Ngãi'],
    sampleCount: 185,
    wordCount: 65,
    commonWords: ['mi', 'tau', 'mô', 'chi', 'rứa', 'miết', 'ngó', 'kính'],
    culturalTags: ['Huế cổ', 'Hội An', 'Sông Thu Bồn', 'Ba Na Hills'],
    coordinates: { x: 50, y: 55 },
    stats: { maleCount: 90, femaleCount: 95, under18: 15, from18to30: 70, from31to50: 60, above50: 40 }
  },
  {
    id: 'reg_nam',
    regionName: 'Nam Bộ',
    provinces: ['TP. Hồ Chí Minh', 'Cần Thơ', 'Đồng Tháp', 'An Giang', 'Bến Tre', 'Cà Mau'],
    sampleCount: 621,
    wordCount: 198,
    commonWords: ['hổng', 'bển', 'mần', 'dữ hôn', 'tui', 'dìa', 'má', 'bông', 'nước đá'],
    culturalTags: ['Cải lương', 'Chợ nổi', 'Miền Tây', 'Đồng Sen', 'Đại lộ Đông Tây'],
    coordinates: { x: 50, y: 88 },
    stats: { maleCount: 295, femaleCount: 326, under18: 80, from18to30: 240, from31to50: 181, above50: 120 }
  }
];

export const DEMO_LEADERBOARD: LeaderboardUser[] = [
  { id: 'l1', name: 'Nguyễn Hoài Thương', score: 2450, contributions: 35, badges: ['Người góp giọng Thừa Thiên', 'Sứ giả văn hóa'], avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
  { id: 'l2', name: 'Lê Thạch Bằng', score: 1820, contributions: 24, badges: ['Người mần tiếng Mỹ Tho', 'Am tường phương ngữ'], avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  { id: 'l3', name: 'Phan Bảo Ngọc', score: 1550, contributions: 18, badges: ['Sứ giả Ví Giặm', 'Lắng nghe tốt'], avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
  { id: 'l4', name: 'Trần Vũ Hoàng', score: 1210, contributions: 15, badges: ['Chàng trai Tràng An'], avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }
];

export const DEMO_QUIZ: {
  id: string;
  audioSampleId?: string;
  sentence?: string;
  region: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}[] = [
  {
    id: 'q1',
    audioSampleId: 's1',
    sentence: 'Mệ đi mô rứa mệ?',
    region: 'Huế',
    options: ['Bà đi đâu vậy bà?', 'Mẹ đi chơi hả mẹ?', 'Chị đi học à chị?', 'Bà về chưa bà?'],
    correctAnswer: 'Bà đi đâu vậy bà?',
    explanation: 'Trong tiếng Huế, "Mệ" chỉ bà, "mô" là đâu, "rứa" là vậy. Vì vậy "Mệ đi mô rứa" tương đương với "Bà đi đâu thế".'
  },
  {
    id: 'q2',
    audioSampleId: 's5',
    sentence: 'Tui nỏ biết chi mô.',
    region: 'Nghệ Tĩnh',
    options: ['Tôi không biết gì đâu.', 'Tôi muốn biết cái đó.', 'Tôi cũng thích món này.', 'Tôi đi đây nhé.'],
    correctAnswer: 'Tôi không biết gì đâu.',
    explanation: 'Từ "nỏ" đặc thù xứ Nghệ có nghĩa là "không", "chi" nghĩa là "gì", "mô" nghĩa là "đâu/nào". Gộp lại nghĩa là "Tôi không biết gì đâu/nhé".'
  },
  {
    id: 'q3',
    audioSampleId: 's2',
    sentence: 'Qua bển mần chút chuyện.',
    region: 'Nam Bộ',
    options: ['Qua bên ấy làm việc tí.', 'Sắp tới có chuyện buồn.', 'Ăn một chút bánh ngọt.', 'Đi chơi đằng kia nhanh.'],
    correctAnswer: 'Qua bên ấy làm việc tí.',
    explanation: 'Văn hóa Nam Bộ dùng "bển" làm rút gọn của "bên ấy" và "mần" thay thế cho "làm".'
  }
];
