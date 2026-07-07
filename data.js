// Kho A: Từ điển Phương ngữ Bắc Trung Bộ (Lexicon)
const DIALECT_LEXICON = [
  {
    id: "l1",
    word: "răng",
    region: "Nghệ Tĩnh, Bình Trị Thiên",
    provinces: ["Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế"],
    meaning: "sao, tại sao, thế nào",
    example: "Răng bữa ni mi đi học trễ rứa?",
    exampleTranslation: "Sao hôm nay mày đi học muộn thế?",
    culturalInsight: "Từ 'răng' là một trong những phương ngữ tiêu biểu nhất của khu vực miền Trung, xuất hiện rộng rãi trong ca dao, dân ca Ví, Giặm Nghệ Tĩnh và ca Huế. Về mặt ngữ âm học, nó giữ nguyên âm cổ từ tiếng Việt-Mường cổ."
  },
  {
    id: "l2",
    word: "mô",
    region: "Nghệ Tĩnh, Bình Trị Thiên",
    provinces: ["Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế"],
    meaning: "đâu, ở đâu, chỗ nào",
    example: "Mi đi mô về rứa, có mua chi cho tui không?",
    exampleTranslation: "Mày đi đâu về thế, có mua gì cho tao không?",
    culturalInsight: "Trong ca dao miền Trung có câu: 'Đi mô cũng nhớ về Hà Tĩnh'. Từ 'mô' vừa dùng để hỏi địa điểm, vừa dùng để phủ định (ví dụ: 'Có mô' nghĩa là 'Làm gì có')."
  },
  {
    id: "l3",
    word: "tê",
    region: "Nghệ Tĩnh, Bình Trị Thiên",
    provinces: ["Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế"],
    meaning: "kia, bên kia, đằng kia",
    example: "Nhà tui ở bên tê sông, đối diện cái rú nớ.",
    exampleTranslation: "Nhà tôi ở bên kia sông, đối diện cái núi đó.",
    culturalInsight: "Thường đi kèm trong bộ tứ từ chỉ vị trí: 'đây - đó - tê - nớ'. Thể hiện khoảng cách không gian xa hơn 'đây' và 'đó', mang sắc thái chỉ dẫn trực quan."
  },
  {
    id: "l4",
    word: "rứa",
    region: "Nghệ Tĩnh, Bình Trị Thiên",
    provinces: ["Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế"],
    meaning: "thế, vậy, thế thế",
    example: "Đời răng mà buồn rứa hả trời!",
    exampleTranslation: "Cuộc đời sao mà buồn thế hả trời!",
    culturalInsight: "Từ này thường được dùng cuối câu làm từ cảm thán hoặc trợ từ khẳng định thái độ. Khi kết hợp thành 'răng rứa' (sao vậy) tạo nên nhạc tính đặc trưng của người miền Trung."
  },
  {
    id: "l5",
    word: "nớ",
    region: "Nghệ Tĩnh, Bình Trị Thiên",
    provinces: ["Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế"],
    meaning: "ấy, đó, người ấy",
    example: "Em nớ có nụ cười răng mà duyên rứa không biết.",
    exampleTranslation: "Em ấy có nụ cười sao mà duyên thế không biết.",
    culturalInsight: "Vừa chỉ vật ở xa, vừa là cách xưng hô thân mật cho người thứ ba, đặc biệt là người thương trong các bài hát giao duyên Ví Giặm hay hò Huế."
  },
  {
    id: "l6",
    word: "mần",
    region: "Thanh Hóa, Nghệ Tĩnh, Bình Trị Thiên",
    provinces: ["Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế"],
    meaning: "làm, thực hiện",
    example: "Bữa ni mần cấy chi ăn cho ngon ngon đi mi.",
    exampleTranslation: "Hôm nay làm cái gì ăn cho ngon ngon đi mày.",
    culturalInsight: "Biến âm phổ biến của từ 'làm'. Chữ 'mần' thể hiện sự lao động, chịu thương chịu khó gắn liền với cuộc sống lam lũ của người dân dải đất miền Trung nắng gió."
  },
  {
    id: "l7",
    word: "tỏi",
    region: "Thanh Hóa",
    provinces: ["Thanh Hóa"],
    meaning: "biết, nghe thấy, hiểu rõ",
    example: "Tao đón thế mi có tỏi chi không?",
    exampleTranslation: "Tao nói thế mày có hiểu gì không?",
    culturalInsight: "Phương ngữ độc đáo đặc trưng của vùng Thanh Hóa (đặc biệt là vùng Quảng Xương, Hoằng Hóa). 'Tỏi' có gốc từ Hán Việt cổ tương đương chữ 'Thấu' (hiểu rõ, thấu tỏ)."
  },
  {
    id: "l8",
    word: "đón",
    region: "Thanh Hóa",
    provinces: ["Thanh Hóa"],
    meaning: "bảo, nói, kể",
    example: "Đừng nghe hắn đón bậy đón bạ.",
    exampleTranslation: "Đừng nghe nó nói linh tinh.",
    culturalInsight: "Sử dụng nhiều trong ngôn ngữ sinh hoạt hàng ngày ở Thanh Hóa. Từ này phản ánh sự biến đổi thanh điệu và phụ âm đầu cổ của vùng ven biển Bắc Trung Bộ."
  },
  {
    id: "l9",
    word: "trốc",
    region: "Nghệ Tĩnh",
    provinces: ["Nghệ An", "Hà Tĩnh"],
    meaning: "đầu, cái đầu",
    example: "Đi nắng không đội mũ có ngày đau trốc nghe con.",
    exampleTranslation: "Đi nắng không đội mũ có ngày đau đầu nghe con.",
    culturalInsight: "Có gốc từ cổ 'trốc cú' (đầu gối) hoặc 'trốc' chỉ phần cao nhất. Được dùng rất phổ biến trong các gia dịch xứ Nghệ để nhắc nhở con cái."
  },
  {
    id: "l10",
    word: "bọ",
    region: "Bình Trị Thiên (Quảng Bình)",
    provinces: ["Quảng Bình", "Quảng Trị"],
    meaning: "bố, cha, tía",
    example: "Bọ tui đi làm ngoài đồng từ sáng sớm chưa về.",
    exampleTranslation: "Bố tôi đi làm ngoài đồng từ sáng sớm chưa về.",
    culturalInsight: "Từ ngữ xưng hô thiêng liêng biểu tượng của Quảng Bình. Hình ảnh 'Mẹ Suốt' và 'Bọ' đã đi vào văn học kháng chiến như những biểu tượng kiên cường."
  },
  {
    id: "l11",
    word: "mạ",
    region: "Bình Trị Thiên",
    provinces: ["Quảng Bình", "Quảng Trị", "Thừa Thiên Huế"],
    meaning: "mẹ, u, má",
    example: "Mạ ơi, con mới đi chợ về có mua bánh lọc cho mạ nè.",
    exampleTranslation: "Mẹ ơi, con mới đi chợ về có mua bánh lọc cho mẹ nè.",
    culturalInsight: "Một từ vô cùng ngọt ngào trong tiếng Huế và Quảng Trị. Từ 'mạ' gợi nhớ đến sự dịu dàng, tảo tần nuôi con khôn lớn bên dòng sông Hương hay sông Thạch Hãn."
  },
  {
    id: "l12",
    word: "ngái",
    region: "Nghệ Tĩnh, Bình Trị Thiên",
    provinces: ["Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị"],
    meaning: "xa, xa xôi",
    example: "Đường từ đây lên rú ngái lắm, đi mỏi chân rã rời.",
    exampleTranslation: "Đường từ đây lên núi xa lắm, đi mỏi chân rã rời.",
    culturalInsight: "Được dùng trong câu hát nổi tiếng: 'Đường đi tuy ngái nhưng nghĩa tình thì gần'. Thể hiện tâm lý không ngại khoảng cách của người dân quê xứ Nghệ."
  },
  {
    id: "l13",
    word: "nác",
    region: "Nghệ Tĩnh, Bình Trị Thiên",
    provinces: ["Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị"],
    meaning: "nước",
    example: "Rót cho tui cấy bát nác chè xanh nóng hổi đi.",
    exampleTranslation: "Rót cho tôi cái bát nước chè xanh nóng hổi đi.",
    culturalInsight: "Nét văn hóa 'nác chè chát' (nước chè xanh) là linh hồn giao tiếp của người Nghệ An, Hà Tĩnh. Khách đến nhà luôn được tiếp đãi bằng một bát nác chè xanh om nóng."
  },
  {
    id: "l14",
    word: "rú",
    region: "Nghệ Tĩnh",
    provinces: ["Nghệ An", "Hà Tĩnh"],
    meaning: "núi, rừng núi",
    example: "Dân bản mình sống dựa vào cái rú này bao đời nay.",
    exampleTranslation: "Dân bản mình sống dựa vào cái núi này bao đời nay.",
    culturalInsight: "Chữ 'rú' chỉ ngọn núi rậm rạp hoang sơ. Trong tiếng Nghệ, rú và bể (biển) là hai thực thể địa lý tự nhiên định hình nên tính cách can trường của họ."
  },
  {
    id: "l15",
    word: "khu",
    region: "Bình Trị Thiên",
    provinces: ["Quảng Bình", "Quảng Trị", "Thừa Thiên Huế"],
    meaning: "mông, phần sau của cơ thể",
    example: "Hắn trượt chân ngã đau ê ẩm cả khu.",
    exampleTranslation: "Nó trượt chân ngã đau ê ẩm cả mông.",
    culturalInsight: "Từ cổ, có liên quan đến các từ vựng Việt-Mường chỉ phần dưới hoặc phía sau. Mang sắc thái đùa vui dí dỏm trong giao tiếp hàng ngày."
  },
  {
    id: "l16",
    word: "clả",
    region: "Thanh Hóa",
    provinces: ["Thanh Hóa"],
    meaning: "quả trứng, trứng",
    example: "Gà nhà tui đẻ được mấy clả trứng to lắm.",
    exampleTranslation: "Gà nhà tôi đẻ được mấy quả trứng to lắm.",
    culturalInsight: "Là di tích phát âm cổ của tổ hợp phụ âm đầu 'kl-' trong tiếng Việt cổ (như tl-, bl-, kl-). Hiện nay chỉ còn lưu giữ ở một số vùng nông thôn hẻo lánh của Thanh Hóa."
  },
  {
    id: "l17",
    word: "bữa ni",
    region: "Nghệ Tĩnh, Bình Trị Thiên",
    provinces: ["Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế"],
    meaning: "hôm nay, bữa nay",
    example: "Bữa ni trời nắng to rực rỡ, thích hợp đi phơi lúa.",
    exampleTranslation: "Hôm nay trời nắng to rực rỡ, thích hợp đi phơi lúa.",
    culturalInsight: "Sự kết hợp của 'bữa' (ngày) và 'ni' (này). Phổ biến khắp dải đất miền Trung từ Hà Tĩnh đổ vào Huế."
  },
  {
    id: "l18",
    word: "cấy",
    region: "Thanh Hóa, Nghệ Tĩnh",
    provinces: ["Thanh Hóa", "Nghệ An", "Hà Tĩnh"],
    meaning: "cái (lượng từ hoặc chỉ đồ vật)",
    example: "Cấy nhà ni xây từ thời bọ hắn còn trẻ.",
    exampleTranslation: "Cái nhà này xây từ thời bố nó còn trẻ.",
    culturalInsight: "Thay thế cho lượng từ 'cái' trong tiếng phổ thông. Người xứ Nghệ thường nói 'cấy bàn', 'cấy ghế', 'cấy bút' tạo âm điệu trầm ấm."
  },
  {
    id: "l19",
    word: "du",
    region: "Nghệ Tĩnh",
    provinces: ["Nghệ An", "Hà Tĩnh"],
    meaning: "con dâu",
    example: "Nhà nớ mới rước được cô du thảo hiền lắm.",
    exampleTranslation: "Nhà đó mới đón được cô con dâu thảo hiền lắm.",
    culturalInsight: "Biến âm từ 'dâu'. Ở nông thôn Nghệ Tĩnh, lễ đón du (đón dâu) là một ngày hội làng thực sự với nhiều phong tục hát Ví đối đáp duyên dáng."
  },
  {
    id: "l20",
    word: "bữa tê",
    region: "Nghệ Tĩnh, Bình Trị Thiên",
    provinces: ["Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế"],
    meaning: "hôm kia",
    example: "Bữa tê tui thấy hắn đi chợ Đông Ba mua chi nhiều lắm.",
    exampleTranslation: "Hôm kia tôi thấy nó đi chợ Đông Ba mua gì nhiều lắm.",
    culturalInsight: "Chỉ thời gian quá khứ gần (2 ngày trước), tương ứng với vị trí không gian ở xa 'tê'."
  }
];

// Kho B: Corpus Audio có nhãn (Audio Database)
// Nhãn chủ đề gồm: "Lịch sử & Văn hóa", "Giọng ca đặc trưng (Ví Giặm, Ca Huế...)", "Tổng quan vùng (Địa lý, Đời sống...)"
const AUDIO_CORPUS = [
  {
    id: "a1",
    title: "Ký ức Chợ Vinh xưa",
    province: "Nghệ An",
    dialectGroup: "Nghệ Tĩnh",
    speaker: "Nguyễn Văn Hùng",
    ageGroup: "56-70",
    gender: "Nam",
    topic: "Tổng quan vùng (Địa lý, Đời sống...)",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Demo URL
    transcriptDialect: "Tui nhớ hồi tê cấy Chợ Vinh hắn lụp xụp chớ không khang trang như bữa ni mô. Người ta bán chè xanh bát chát thơm lừng cả một vùng.",
    transcriptStandard: "Tôi nhớ hồi kia cái Chợ Vinh nó lụp xụp chứ không khang trang như hôm nay đâu. Người ta bán nước chè xanh nóng hổi thơm lừng cả một vùng.",
    verified: true,
    confidence: 96,
    tags: ["Chợ Vinh", "Nét sinh hoạt xưa", "Nghệ Tĩnh"]
  },
  {
    id: "a2",
    title: "Hát Ví Giặm Đò Sa Nam",
    province: "Nghệ An",
    dialectGroup: "Nghệ Tĩnh",
    speaker: "Trần Thị Lan",
    ageGroup: "36-55",
    gender: "Nữ",
    topic: "Giọng ca đặc trưng (Ví Giặm, Ca Huế...)",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    transcriptDialect: "Ai ơi đi mô cũng nhớ về dòng sông Lam. Nghe câu hò Ví Giặm mộc mạc quê mình răng mà thương rứa không biết.",
    transcriptStandard: "Ai ơi đi đâu cũng nhớ về dòng sông Lam. Nghe câu hò Ví Giặm mộc mạc quê mình sao mà thương thế không biết.",
    verified: true,
    confidence: 98,
    tags: ["Ví Giặm", "Dân ca Nghệ Tĩnh", "Sông Lam"]
  },
  {
    id: "a3",
    title: "Lời dặn dò của Mạ Huế",
    province: "Thừa Thiên Huế",
    dialectGroup: "Bình Trị Thiên",
    speaker: "Lê Thị Thảo",
    ageGroup: "71+",
    gender: "Nữ",
    topic: "Lịch sử & Văn hóa",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    transcriptDialect: "Con đi học xa cố mần ăn học hành cho đàng hoàng nghe con. Đừng có đua đòi chúng bạn rồi đau trốc mệt người ra tê.",
    transcriptStandard: "Con đi học xa cố gắng học hành cho đàng hoàng nghe con. Đừng có đua đòi bạn bè rồi đau đầu mệt người ra đấy.",
    verified: true,
    confidence: 94,
    tags: ["Gia đình", "Huế thương", "Lời dặn"]
  },
  {
    id: "a4",
    title: "Sự tích rú Thiên Cầm",
    province: "Hà Tĩnh",
    dialectGroup: "Nghệ Tĩnh",
    speaker: "Phan Văn Bình",
    ageGroup: "18-35",
    gender: "Nam",
    topic: "Lịch sử & Văn hóa",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    transcriptDialect: "Bọ tui đón cấy rú Thiên Cầm ni ngày xưa vua nghe tiếng đàn trời mà đặt tên rứa. Đứng trên đỉnh rú gió thổi nghe rì rào sướng tai lắm.",
    transcriptStandard: "Bố tôi bảo cái núi Thiên Cầm này ngày xưa vua nghe tiếng đàn trời mà đặt tên thế. Đứng trên đỉnh núi gió thổi nghe rì rào thích tai lắm.",
    verified: true,
    confidence: 91,
    tags: ["Hà Tĩnh", "Thiên Cầm", "Truyền thuyết"]
  },
  {
    id: "a5",
    title: "Hò hụi chèo đò Quảng Bình",
    province: "Quảng Bình",
    dialectGroup: "Bình Trị Thiên",
    speaker: "Nguyễn Quốc Việt",
    ageGroup: "36-55",
    gender: "Nam",
    topic: "Giọng ca đặc trưng (Ví Giặm, Ca Huế...)",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    transcriptDialect: "Dưới sông Nhật Lệ quê mình, bọ mạ tui hồi xưa chèo đò hò hụi vang cả khúc sông. Nhịp chèo mần cho lòng người hăng hái vô cùng.",
    transcriptStandard: "Dưới sông Nhật Lệ quê mình, bố mẹ tôi hồi xưa chèo đò hò hụi vang cả khúc sông. Nhịp chèo làm cho lòng người hăng hái vô cùng.",
    verified: true,
    confidence: 93,
    tags: ["Hò hụi", "Quảng Bình", "Nhật Lệ"]
  },
  {
    id: "a6",
    title: "Phát âm cổ 'Clả trứng' Hoằng Hóa",
    province: "Thanh Hóa",
    dialectGroup: "Thanh Hóa",
    speaker: "Lê Văn Tỏi",
    ageGroup: "71+",
    gender: "Nam",
    topic: "Lịch sử & Văn hóa",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    transcriptDialect: "Dân làng tui hồi xưa vẫn đón gà đẻ clả trứng chớ không đón quả trứng đâu. Giờ bọn trẻ hắn đi học trường phổ thông nên ít đón từ ni rồi.",
    transcriptStandard: "Dân làng tôi hồi xưa vẫn nói gà đẻ quả trứng chứ không nói quả trứng đâu. Giờ bọn trẻ nó đi học trường phổ thông nên ít nói từ này rồi.",
    verified: true,
    confidence: 89,
    tags: ["Phát âm cổ", "Hoằng Hóa", "Thanh Hóa"]
  },
  {
    id: "a7",
    title: "Ca Huế trên sông Hương",
    province: "Thừa Thiên Huế",
    dialectGroup: "Bình Trị Thiên",
    speaker: "Đặng Hoàng Yến",
    ageGroup: "18-35",
    gender: "Nữ",
    topic: "Giọng ca đặc trưng (Ví Giặm, Ca Huế...)",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    transcriptDialect: "Đêm ni trời trong nác mát, mời anh lên thuyền nghe ca Huế. Câu hò mái nhì mái đẩy ngọt ngào răng mà lay động lòng người rứa.",
    transcriptStandard: "Đêm nay trời trong nước mát, mời anh lên thuyền nghe ca Huế. Câu hò mái nhì mái đẩy ngọt ngào sao mà lay động lòng người thế.",
    verified: true,
    confidence: 97,
    tags: ["Ca Huế", "Sông Hương", "Huế"]
  },
  {
    id: "a8",
    title: "Hồi ức vĩ tuyến 17",
    province: "Quảng Trị",
    dialectGroup: "Bình Trị Thiên",
    speaker: "Trương Minh Đức",
    ageGroup: "71+",
    gender: "Nam",
    topic: "Lịch sử & Văn hóa",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    transcriptDialect: "Bên tê sông Bến Hải quê mình thời chiến tranh bom đạn dữ dội lắm. Bọ mạ tui mần hầm sâu dưới đất để trú ẩn qua ngày.",
    transcriptStandard: "Bên kia sông Bến Hải quê mình thời chiến tranh bom đạn dữ dội lắm. Bố mẹ tôi làm hầm sâu dưới đất để trú ẩn qua ngày.",
    verified: true,
    confidence: 95,
    tags: ["Quảng Trị", "Hiền Lương", "Lịch sử"]
  }
];

// Dữ liệu câu hỏi nhanh và câu trả lời RAG của Chatbot
const CHATBOT_RAG_DATABASE = [
  {
    keywords: ["răng", "rang la gi", "nghia la gi"],
    response: `**"Răng"** có nghĩa là **"sao, tại sao, thế nào"** trong tiếng phổ thông.
- **Khu vực sử dụng:** Rất phổ biến tại Nghệ An, Hà Tĩnh, Quảng Bình, Quảng Trị, Thừa Thiên Huế.
- **Ví dụ thực tế:** *"Răng bữa ni mi đi học trễ rứa?"* tương đương *"Sao hôm nay mày đi học muộn thế?"*
- **Ý nghĩa văn hóa:** Từ "răng" mang ngữ âm cổ, phản ánh bản sắc ngôn ngữ đậm chất miền Trung. Bạn sẽ nghe từ này thường xuyên trong hò Ví Giặm hay các bài ca Huế.`
  },
  {
    keywords: ["mô, tê, răng, rứa", "mo te rang rua"],
    response: `Bộ tứ **"Mô - Tê - Răng - Rứa"** được coi là **"mật mã ngôn ngữ"** của người dân xứ Nghệ và Bình Trị Thiên:
1. **Mô:** Đâu, ở đâu, chỗ nào (Ví dụ: *Đi mô đó?*)
2. **Tê:** Kia, bên kia, đằng kia (Ví dụ: *Bên tê sông*)
3. **Răng:** Sao, tại sao, thế nào (Ví dụ: *Răng mà buồn rứa?*)
4. **Rứa:** Thế, thế này, vậy (Ví dụ: *Đúng rứa!*)

Khi kết hợp chúng lại tạo nên ngữ điệu nhịp nhàng, trầm bổng đặc trưng của giọng miền Trung.`
  },
  {
    keywords: ["người huế dặn", "nguoi hue dan co", "hue dan"],
    response: `Người Huế thường dùng những lời dặn dò nhẹ nhàng, ngọt ngào nhưng rất sâu sắc để răn dạy con cái. Trong đó xuất hiện nhiều từ địa phương thân thương:
- Gọi mẹ là **"Mạ"**, gọi bố là **"Ba"** hoặc **"Bọ"** (ở vùng nông thôn).
- Dặn con học hành chăm chỉ: *"Con đi học cố mần ăn học hành cho đàng hoàng nghe con."*
- Nhắc nhở giữ gìn sức khỏe: *"Đi nắng nhớ đội nón không thôi đau trốc (đau đầu) tê."*
- Răn dạy về sự lễ phép và hiền lành qua các câu nói dùng từ **"nớ"**, **"rứa"** để biểu thị sự kính trọng và nhỏ nhẹ.`
  },
  {
    keywords: ["so sánh", "nghệ tĩnh và nam bộ", "nghe tinh", "nam bo"],
    response: `**So sánh tiếng Nghệ Tĩnh (Nghệ An - Hà Tĩnh) và tiếng Nam Bộ:**

| Đặc điểm | Tiếng Nghệ Tĩnh | Tiếng Nam Bộ |
| :--- | :--- | :--- |
| **Hỏi / Đâu** | Dùng từ **"Mô"** (Ví dụ: *Đi mô đó?*) | Dùng từ **"Đâu"** (Ví dụ: *Đi đâu đó?*) |
| **Sao / Tại sao** | Dùng từ **"Răng"** (Ví dụ: *Răng rứa?*) | Dùng từ **"Sao"** (Ví dụ: *Sao vậy?*) |
| **Thế này / Vậy** | Dùng từ **"Rứa"** (Ví dụ: *Thấy rứa*) | Dùng từ **"Vậy"** (Ví dụ: *Thấy vậy*) |
| **Thanh điệu** | Nặng, trầm sâu, giữ nguyên âm cổ, dấu hỏi/ngã phát âm nặng gần như nhau. | Nhẹ nhàng, bằng phẳng, không phân biệt rõ dấu hỏi và dấu ngã (đều phát âm hơi giống dấu hỏi). |
| **Tính cách biểu thị** | Mộc mạc, bền bỉ, kiên cường qua âm sắc trầm nặng. | Phóng khoáng, cởi mở, thân thiện qua âm sắc bay bổng. |`
  }
];
