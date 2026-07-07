class VoiceBankGames {
  constructor() {
    this.score = 0;
    this.wrongAnswers = 0;
    this.currentQuestion = null;
    this.activeGameType = null;
    this.highScores = JSON.parse(localStorage.getItem('vb_highscores') || '{"g1":0,"g2":0,"g3":0,"g4":0}');
    
    // Cache references to the audio playing inside games
    this.gameAudioPlayer = null;
    
    // Matching Game state variables
    this.matchingSelectedLeft = null;
    this.matchingSelectedRight = null;
    this.matchedPairsCount = 0;
    this.matchingPairs = [];
  }

  saveHighScore() {
    localStorage.setItem('vb_highscores', JSON.stringify(this.highScores));
  }

  updateScoreUI() {
    const scoreVal = document.getElementById('game-score-val');
    const wrongVal = document.getElementById('game-wrong-val');
    if (scoreVal) scoreVal.innerText = this.score;
    if (wrongVal) wrongVal.innerText = this.wrongAnswers;
  }

  initHub() {
    this.score = 0;
    this.wrongAnswers = 0;
    this.updateScoreUI();
    
    // Stop any active game audio
    this.stopGameAudio();

    document.getElementById('games-hub').style.display = 'grid';
    document.getElementById('game-arena').classList.remove('active');
    
    // Update high scores on cards
    document.getElementById('hs-g1').innerText = this.highScores.g1;
    document.getElementById('hs-g2').innerText = this.highScores.g2;
    document.getElementById('hs-g3').innerText = this.highScores.g3;
    document.getElementById('hs-g4').innerText = this.highScores.g4;
  }

  stopGameAudio() {
    if (this.gameAudioPlayer) {
      this.gameAudioPlayer.pause();
      this.gameAudioPlayer = null;
      const playIcon = document.getElementById('quiz-play-icon');
      if (playIcon) playIcon.className = 'fas fa-play';
    }
  }

  playAudioSample(url) {
    if (this.gameAudioPlayer) {
      if (!this.gameAudioPlayer.paused) {
        this.gameAudioPlayer.pause();
        document.getElementById('quiz-play-icon').className = 'fas fa-play';
        return;
      }
      this.gameAudioPlayer.play();
      document.getElementById('quiz-play-icon').className = 'fas fa-pause';
      return;
    }

    this.gameAudioPlayer = new Audio(url);
    this.gameAudioPlayer.play();
    document.getElementById('quiz-play-icon').className = 'fas fa-pause';

    this.gameAudioPlayer.onended = () => {
      document.getElementById('quiz-play-icon').className = 'fas fa-play';
    };
  }

  startFeedback(isCorrect, text) {
    const feedbackBox = document.getElementById('quiz-feedback');
    feedbackBox.className = `quiz-feedback active ${isCorrect ? 'correct' : 'wrong'}`;
    feedbackBox.innerHTML = `
      <strong style="color: ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}; display: block; font-size: 15px; margin-bottom: 4px;">
        ${isCorrect ? '<i class="fas fa-check-circle"></i> CHÍNH XÁC!' : '<i class="fas fa-times-circle"></i> CHƯA ĐÚNG!'}
      </strong>
      <span>${text}</span>
    `;
  }

  // --- GAME 1: NGHE GIỌNG ĐOÁN VÙNG ---
  startNewQuestionG1() {
    this.stopGameAudio();
    document.getElementById('quiz-feedback').classList.remove('active');
    
    // Pick a random audio recording from AUDIO_CORPUS
    const index = Math.floor(Math.random() * AUDIO_CORPUS.length);
    const audioObj = AUDIO_CORPUS[index];
    this.currentQuestion = audioObj;

    const gameTitle = document.getElementById('game-title');
    gameTitle.innerText = "Trò chơi: Nghe giọng đoán vùng";

    const gameContent = document.getElementById('game-arena-content');
    gameContent.innerHTML = `
      <p style="text-align: center; margin-bottom: 20px; color: var(--text-muted);">Hãy nghe kỹ đoạn âm thanh dưới đây và dự đoán xem người nói thuộc cụm phương ngữ nào.</p>
      
      <div class="game-audio-player">
        <button class="play-pause-btn" onclick="window.voiceBankGames.playAudioSample('${audioObj.audioUrl}')">
          <i id="quiz-play-icon" class="fas fa-play"></i>
        </button>
        <div>
          <strong style="display: block; font-size: 14px;">Bản ghi âm bí mật #${audioObj.id}</strong>
          <span style="font-size: 12px; color: var(--text-muted);">Độ tuổi người nói: ${audioObj.ageGroup} | Giới tính: ${audioObj.gender}</span>
        </div>
      </div>

      <div class="quiz-options-grid">
        <button class="quiz-option-btn" onclick="window.voiceBankGames.submitG1('Thanh Hóa')">Cụm Thanh Hóa</button>
        <button class="quiz-option-btn" onclick="window.voiceBankGames.submitG1('Nghệ Tĩnh')">Cụm Nghệ Tĩnh (Nghệ An, Hà Tĩnh)</button>
        <button class="quiz-option-btn" onclick="window.voiceBankGames.submitG1('Bình Trị Thiên')">Cụm Bình Trị Thiên (Quảng Bình, Quảng Trị, Huế)</button>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <button class="btn btn-secondary" onclick="window.voiceBankGames.startNewQuestionG1()">Bỏ qua & Sang câu tiếp <i class="fas fa-chevron-right" style="margin-left: 8px;"></i></button>
      </div>
    `;
  }

  submitG1(selectedGroup) {
    const correctGroup = this.currentQuestion.dialectGroup;
    const buttons = document.querySelectorAll('.quiz-option-btn');
    
    // Disable all options
    buttons.forEach(btn => {
      btn.disabled = true;
      if (btn.innerText.includes(correctGroup)) {
        btn.classList.add('correct');
      } else if (btn.innerText.includes(selectedGroup)) {
        btn.classList.add('wrong');
      }
    });

    const isCorrect = (selectedGroup === correctGroup);
    
    if (isCorrect) {
      this.score += 10;
      if (this.score > this.highScores.g1) {
        this.highScores.g1 = this.score;
        this.saveHighScore();
      }
    } else {
      this.wrongAnswers += 1;
    }
    
    this.updateScoreUI();

    const clueMap = {
      'Thanh Hóa': "Vùng Thanh Hóa nổi bật với biến âm phụ âm cổ (như 'clả' - quả trứng) và các từ chỉ nghe riêng ở Thanh Hóa (tỏi, đón).",
      'Nghệ Tĩnh': "Giọng Nghệ Tĩnh (Nghệ An, Hà Tĩnh) có âm vực trầm nặng, mang tính học thuật địa phương sâu sắc và dùng rất nhiều nác (nước), rú (núi), trốc (đầu).",
      'Bình Trị Thiên': "Giọng Bình Trị Thiên nhẹ nhàng ngọt ngào hơn, đặc biệt âm sắc Quảng Bình có bọ, Huế có mạ và từ tê, nớ mềm mại."
    };

    const transcriptHint = `
      <br><em style="display:block; margin-top: 8px; font-size: 13px; color: var(--color-primary)">
        "Transcript gốc: ${this.currentQuestion.transcriptDialect}"
      </em>
    `;

    this.startFeedback(
      isCorrect, 
      `Đáp án đúng là cụm <strong>${correctGroup}</strong> (người nói ở tỉnh ${this.currentQuestion.province}). <br>${clueMap[correctGroup]} ${transcriptHint}`
    );
  }

  // --- GAME 2: GIẢI NGHĨA PHƯƠNG NGỮ ---
  startNewQuestionG2() {
    this.stopGameAudio();
    document.getElementById('quiz-feedback').classList.remove('active');
    
    // Select a random lexicon item
    const index = Math.floor(Math.random() * DIALECT_LEXICON.length);
    const wordObj = DIALECT_LEXICON[index];
    this.currentQuestion = wordObj;

    // Pick 3 wrong options from other meanings
    const allMeanings = DIALECT_LEXICON.map(l => l.meaning).filter(m => m !== wordObj.meaning);
    const uniqueMeanings = [...new Set(allMeanings)];
    
    // Shuffle and pick 3 wrong
    const shuffledWrong = uniqueMeanings.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [wordObj.meaning, ...shuffledWrong].sort(() => 0.5 - Math.random());

    const gameTitle = document.getElementById('game-title');
    gameTitle.innerText = "Trò chơi: Giải nghĩa phương ngữ";

    const gameContent = document.getElementById('game-arena-content');
    
    let optionsHtml = '';
    options.forEach(opt => {
      optionsHtml += `<button class="quiz-option-btn" onclick="window.voiceBankGames.submitG2('${opt.replace(/'/g, "\\'")}')">${opt}</button>`;
    });

    gameContent.innerHTML = `
      <p style="text-align: center; margin-bottom: 20px; color: var(--text-muted);">Hãy chọn nghĩa phổ thông chính xác nhất cho từ phương ngữ được đưa ra.</p>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="font-size: 13px; text-transform: uppercase; color: var(--color-purple); font-weight: 700; letter-spacing: 1px;">Từ cần đoán (Cụm ${wordObj.region}):</span>
        <h2 style="font-size: 48px; font-weight: 800; color: var(--color-primary); margin-top: 8px;">"${wordObj.word}"</h2>
      </div>

      <div class="quiz-options-grid">
        ${optionsHtml}
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <button class="btn btn-secondary" onclick="window.voiceBankGames.startNewQuestionG2()">Bỏ qua & Sang câu tiếp <i class="fas fa-chevron-right" style="margin-left: 8px;"></i></button>
      </div>
    `;
  }

  submitG2(selectedMeaning) {
    const correctMeaning = this.currentQuestion.meaning;
    const buttons = document.querySelectorAll('.quiz-option-btn');
    
    buttons.forEach(btn => {
      btn.disabled = true;
      if (btn.innerText === correctMeaning) {
        btn.classList.add('correct');
      } else if (btn.innerText === selectedMeaning) {
        btn.classList.add('wrong');
      }
    });

    const isCorrect = (selectedMeaning === correctMeaning);
    
    if (isCorrect) {
      this.score += 10;
      if (this.score > this.highScores.g2) {
        this.highScores.g2 = this.score;
        this.saveHighScore();
      }
    } else {
      this.wrongAnswers += 1;
    }
    
    this.updateScoreUI();

    this.startFeedback(
      isCorrect, 
      `Từ <strong>"${this.currentQuestion.word}"</strong> có nghĩa là <strong>"${correctMeaning}"</strong>.<br>
      Ví dụ thực tế: <em>"${this.currentQuestion.example}"</em> $\\rightarrow$ Dịch nghĩa: <em>"${this.currentQuestion.exampleTranslation}"</em>`
    );
  }

  // --- GAME 3: GHÉP CẶP TỪ VỰNG ---
  startNewQuestionG3() {
    this.stopGameAudio();
    document.getElementById('quiz-feedback').classList.remove('active');
    
    // Pick 4 random words
    const shuffled = [...DIALECT_LEXICON].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    // Left side (Words in dialect)
    const leftWords = shuffled.map(x => ({ id: x.id, word: x.word })).sort(() => 0.5 - Math.random());
    // Right side (Meanings)
    const rightMeanings = shuffled.map(x => ({ id: x.id, meaning: x.meaning })).sort(() => 0.5 - Math.random());

    this.matchingPairs = shuffled;
    this.matchedPairsCount = 0;
    this.matchingSelectedLeft = null;
    this.matchingSelectedRight = null;

    const gameTitle = document.getElementById('game-title');
    gameTitle.innerText = "Trò chơi: Ghép cặp từ vựng";

    const gameContent = document.getElementById('game-arena-content');
    
    let leftHtml = '';
    leftWords.forEach(w => {
      leftHtml += `<div id="match-left-${w.id}" class="match-item" onclick="window.voiceBankGames.selectMatchItem('${w.id}', 'left')">${w.word}</div>`;
    });

    let rightHtml = '';
    rightMeanings.forEach(m => {
      rightHtml += `<div id="match-right-${m.id}" class="match-item" onclick="window.voiceBankGames.selectMatchItem('${m.id}', 'right')">${m.meaning}</div>`;
    });

    gameContent.innerHTML = `
      <p style="text-align: center; margin-bottom: 20px; color: var(--text-muted);">Ghép các từ địa phương ở cột trái với nghĩa tiếng phổ thông tương ứng ở cột phải.</p>
      
      <div class="matching-columns">
        <div class="match-column">
          <div style="font-weight: 700; font-size: 12px; color: var(--text-muted); text-transform: uppercase; text-align: center; margin-bottom: 8px;">Phương ngữ</div>
          ${leftHtml}
        </div>
        <div class="match-column">
          <div style="font-weight: 700; font-size: 12px; color: var(--text-muted); text-transform: uppercase; text-align: center; margin-bottom: 8px;">Nghĩa phổ thông</div>
          ${rightHtml}
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <button class="btn btn-secondary" onclick="window.voiceBankGames.startNewQuestionG3()">Trộn cặp mới <i class="fas fa-redo-alt" style="margin-left: 8px;"></i></button>
      </div>
    `;
  }

  selectMatchItem(id, column) {
    if (column === 'left') {
      // If already matched, do nothing
      if (document.getElementById(`match-left-${id}`).classList.contains('matched')) return;

      // Select new Left item
      if (this.matchingSelectedLeft) {
        document.getElementById(`match-left-${this.matchingSelectedLeft}`).classList.remove('selected');
      }
      this.matchingSelectedLeft = id;
      document.getElementById(`match-left-${id}`).classList.add('selected');
    } else {
      // If already matched, do nothing
      if (document.getElementById(`match-right-${id}`).classList.contains('matched')) return;

      // Select new Right item
      if (this.matchingSelectedRight) {
        document.getElementById(`match-right-${this.matchingSelectedRight}`).classList.remove('selected');
      }
      this.matchingSelectedRight = id;
      document.getElementById(`match-right-${id}`).classList.add('selected');
    }

    // Check if we have selected from both columns
    if (this.matchingSelectedLeft && this.matchingSelectedRight) {
      this.checkMatch();
    }
  }

  checkMatch() {
    const leftId = this.matchingSelectedLeft;
    const rightId = this.matchingSelectedRight;

    const leftElem = document.getElementById(`match-left-${leftId}`);
    const rightElem = document.getElementById(`match-right-${rightId}`);

    if (leftId === rightId) {
      // Correct Match!
      leftElem.classList.remove('selected');
      rightElem.classList.remove('selected');
      
      leftElem.classList.add('matched');
      rightElem.classList.add('matched');

      this.score += 5;
      if (this.score > this.highScores.g3) {
        this.highScores.g3 = this.score;
        this.saveHighScore();
      }
      
      this.matchedPairsCount++;
      this.updateScoreUI();

      if (this.matchedPairsCount === 4) {
        this.startFeedback(true, "Tuyệt vời! Bạn đã hoàn thành chính xác tất cả các cặp từ trong lượt này!");
      }
    } else {
      // Wrong Match
      leftElem.classList.remove('selected');
      rightElem.classList.remove('selected');
      
      // Temporary warning glow
      leftElem.style.borderColor = 'var(--color-danger)';
      rightElem.style.borderColor = 'var(--color-danger)';
      
      this.wrongAnswers += 1;
      this.updateScoreUI();

      const matchedWord = this.matchingPairs.find(x => x.id === leftId);
      this.startFeedback(false, `Cặp từ ghép chưa đúng. Từ <strong>"${matchedWord.word}"</strong> có nghĩa là <strong>"${matchedWord.meaning}"</strong>.`);

      setTimeout(() => {
        leftElem.style.borderColor = '';
        rightElem.style.borderColor = '';
      }, 1200);
    }

    this.matchingSelectedLeft = null;
    this.matchingSelectedRight = null;
  }

  // --- GAME 4: ĐOÁN CHỦ ĐỀ BẢN GHI ---
  startNewQuestionG4() {
    this.stopGameAudio();
    document.getElementById('quiz-feedback').classList.remove('active');
    
    // Pick a random audio recording from AUDIO_CORPUS
    const index = Math.floor(Math.random() * AUDIO_CORPUS.length);
    const audioObj = AUDIO_CORPUS[index];
    this.currentQuestion = audioObj;

    const gameTitle = document.getElementById('game-title');
    gameTitle.innerText = "Trò chơi: Đoán chủ đề bản ghi";

    const uniqueTopics = ["Lịch sử & Văn hóa", "Giọng ca đặc trưng (Ví Giặm, Ca Huế...)", "Tổng quan vùng (Địa lý, Đời sống...)"];

    const gameContent = document.getElementById('game-arena-content');
    
    let optionsHtml = '';
    uniqueTopics.forEach(top => {
      optionsHtml += `<button class="quiz-option-btn" onclick="window.voiceBankGames.submitG4('${top.replace(/'/g, "\\'")}')">${top}</button>`;
    });

    gameContent.innerHTML = `
      <p style="text-align: center; margin-bottom: 20px; color: var(--text-muted);">Lắng nghe nội dung bản ghi và đoán xem đoạn âm thanh này thuộc chủ đề chính thức nào của dự án.</p>
      
      <div class="game-audio-player">
        <button class="play-pause-btn" onclick="window.voiceBankGames.playAudioSample('${audioObj.audioUrl}')">
          <i id="quiz-play-icon" class="fas fa-play"></i>
        </button>
        <div>
          <strong style="display: block; font-size: 14px;">Bản ghi âm bí mật #${audioObj.id}</strong>
          <span style="font-size: 12px; color: var(--text-muted);">Tỉnh phát: ${audioObj.province} | Giới tính: ${audioObj.gender}</span>
        </div>
      </div>

      <div class="quiz-options-grid" style="grid-template-columns: 1fr;">
        ${optionsHtml}
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <button class="btn btn-secondary" onclick="window.voiceBankGames.startNewQuestionG4()">Bỏ qua & Sang câu tiếp <i class="fas fa-chevron-right" style="margin-left: 8px;"></i></button>
      </div>
    `;
  }

  submitG4(selectedTopic) {
    const correctTopic = this.currentQuestion.topic;
    const buttons = document.querySelectorAll('.quiz-option-btn');
    
    buttons.forEach(btn => {
      btn.disabled = true;
      if (btn.innerText === correctTopic) {
        btn.classList.add('correct');
      } else if (btn.innerText === selectedTopic) {
        btn.classList.add('wrong');
      }
    });

    const isCorrect = (selectedTopic === correctTopic);
    
    if (isCorrect) {
      this.score += 10;
      if (this.score > this.highScores.g4) {
        this.highScores.g4 = this.score;
        this.saveHighScore();
      }
    } else {
      this.wrongAnswers += 1;
    }
    
    this.updateScoreUI();

    this.startFeedback(
      isCorrect, 
      `Chủ đề chính xác là: <strong>${correctTopic}</strong>. <br>
      Bản ghi nói về: <strong>"${this.currentQuestion.title}"</strong> (Tags: ${this.currentQuestion.tags.join(', ')}).`
    );
  }

  // Active game director
  launchGame(gameId) {
    this.activeGameType = gameId;
    
    document.getElementById('games-hub').style.display = 'none';
    document.getElementById('game-arena').classList.add('active');

    if (gameId === 1) {
      this.startNewQuestionG1();
    } else if (gameId === 2) {
      this.startNewQuestionG2();
    } else if (gameId === 3) {
      this.startNewQuestionG3();
    } else if (gameId === 4) {
      this.startNewQuestionG4();
    }
  }
}

// Instantiate and bind to window
window.voiceBankGames = new VoiceBankGames();
