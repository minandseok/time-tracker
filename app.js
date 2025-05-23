class TimeTracker {
  constructor() {
    this.isRunning = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedTime = 0; // 일시정지된 총 시간
    this.interval = null;
    this.records = this.loadRecords();
    this.recordToDelete = null; // 삭제할 기록 ID

    this.initializeElements();
    this.bindEvents();
    this.displayRecords();
  }

  initializeElements() {
    this.activityInput = document.getElementById("activityName");
    this.timerDisplay = document.getElementById("timerDisplay");
    this.currentActivity = document.getElementById("currentActivity");
    this.startBtn = document.getElementById("startBtn");
    this.pauseBtn = document.getElementById("pauseBtn");
    this.resumeBtn = document.getElementById("resumeBtn");
    this.stopBtn = document.getElementById("stopBtn");
    this.recordsList = document.getElementById("recordsList");

    // 모달 관련 요소
    this.deleteModal = document.getElementById("deleteModal");
    this.deleteRecordName = document.getElementById("deleteRecordName");
    this.deleteRecordDuration = document.getElementById("deleteRecordDuration");
    this.cancelDeleteBtn = document.getElementById("cancelDelete");
    this.confirmDeleteBtn = document.getElementById("confirmDelete");
  }

  bindEvents() {
    this.startBtn.addEventListener("click", () => this.startTimer());
    this.pauseBtn.addEventListener("click", () => this.pauseTimer());
    this.resumeBtn.addEventListener("click", () => this.resumeTimer());
    this.stopBtn.addEventListener("click", () => this.stopTimer());

    // 모달 이벤트
    this.cancelDeleteBtn.addEventListener("click", () =>
      this.closeDeleteModal()
    );
    this.confirmDeleteBtn.addEventListener("click", () => this.deleteRecord());

    // 모달 오버레이 클릭시 닫기
    this.deleteModal.addEventListener("click", (e) => {
      if (e.target === this.deleteModal) {
        this.closeDeleteModal();
      }
    });

    // ESC 키로 모달 닫기
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.deleteModal.style.display !== "none") {
        this.closeDeleteModal();
      }
    });

    // Enter 키로 타이머 시작
    this.activityInput.addEventListener("keypress", (e) => {
      if (
        e.key === "Enter" &&
        !this.isRunning &&
        !this.isPaused &&
        this.activityInput.value.trim()
      ) {
        this.startTimer();
      }
    });
  }

  startTimer() {
    const activity = this.activityInput.value.trim();
    if (!activity) {
      this.activityInput.focus();
      return;
    }

    this.isRunning = true;
    this.isPaused = false;
    this.startTime = new Date();
    this.pausedTime = 0;

    this.updateButtonStates("running");
    this.activityInput.disabled = true;
    this.currentActivity.textContent = activity;

    this.interval = setInterval(() => {
      this.updateDisplay();
    }, 1000);

    this.updateDisplay();
  }

  pauseTimer() {
    if (!this.isRunning || this.isPaused) return;

    this.isPaused = true;
    this.isRunning = false;
    this.pausedTime += new Date() - this.startTime;

    clearInterval(this.interval);
    this.updateButtonStates("paused");
  }

  resumeTimer() {
    if (!this.isPaused) return;

    this.isRunning = true;
    this.isPaused = false;
    this.startTime = new Date();

    this.updateButtonStates("running");

    this.interval = setInterval(() => {
      this.updateDisplay();
    }, 1000);

    this.updateDisplay();
  }

  stopTimer() {
    if (!this.isRunning && !this.isPaused) return;

    const endTime = new Date();
    let totalDuration;

    if (this.isRunning) {
      // 실행 중이었다면 현재까지의 시간을 추가
      totalDuration = this.pausedTime + (endTime - this.startTime);
    } else {
      // 일시정지 상태였다면 pausedTime만 사용
      totalDuration = this.pausedTime;
    }

    const activity = this.currentActivity.textContent;

    // 기록 저장 (최소 1초 이상인 경우만)
    if (totalDuration >= 1000) {
      const record = {
        id: Date.now(),
        activity: activity,
        startTime: new Date(endTime.getTime() - totalDuration),
        endTime: endTime,
        duration: totalDuration,
      };

      this.records.unshift(record);
      this.saveRecords();
    }

    // UI 리셋
    this.resetTimer();
  }

  resetTimer() {
    this.isRunning = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedTime = 0;
    clearInterval(this.interval);

    this.updateButtonStates("idle");
    this.activityInput.disabled = false;
    this.activityInput.value = "";
    this.currentActivity.textContent = "";
    this.timerDisplay.textContent = "00:00:00";

    this.displayRecords();
    this.activityInput.focus();
  }

  updateButtonStates(state) {
    // 모든 버튼 초기화
    this.startBtn.disabled = true;
    this.pauseBtn.disabled = true;
    this.resumeBtn.disabled = true;
    this.stopBtn.disabled = true;

    this.pauseBtn.style.display = "inline-block";
    this.resumeBtn.style.display = "none";

    switch (state) {
      case "idle":
        this.startBtn.disabled = false;
        break;
      case "running":
        this.pauseBtn.disabled = false;
        this.stopBtn.disabled = false;
        break;
      case "paused":
        this.resumeBtn.disabled = false;
        this.stopBtn.disabled = false;
        this.pauseBtn.style.display = "none";
        this.resumeBtn.style.display = "inline-block";
        break;
    }
  }

  updateDisplay() {
    if (!this.isRunning) return;

    const currentElapsed = new Date() - this.startTime;
    const totalElapsed = this.pausedTime + currentElapsed;
    this.timerDisplay.textContent = this.formatDuration(totalElapsed);
  }

  formatDuration(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  formatTime(date) {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  formatDate(date) {
    const today = new Date();
    const recordDate = new Date(date);

    if (recordDate.toDateString() === today.toDateString()) {
      return "오늘";
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (recordDate.toDateString() === yesterday.toDateString()) {
      return "어제";
    }

    return recordDate.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  }

  displayRecords() {
    if (this.records.length === 0) {
      this.recordsList.innerHTML =
        '<div class="empty-state">아직 기록이 없습니다</div>';
      return;
    }

    // 총 시간과 기록 수 계산
    const totalTime = this.records.reduce(
      (sum, record) => sum + record.duration,
      0
    );
    const recordCount = this.records.length;

    // 총 시간 카드 HTML
    const totalTimeHTML = `
      <div class="total-time-card">
        <div class="total-label">총 기록 시간</div>
        <div class="total-duration">${this.formatDuration(totalTime)}</div>
        <div class="total-count">${recordCount}개의 활동 기록</div>
      </div>
    `;

    // 개별 기록 HTML
    const recordsHTML = this.records
      .map((record) => {
        const startTime = new Date(record.startTime);
        const endTime = new Date(record.endTime);

        return `
          <div class="record-item">
            <div class="record-header">
              <div class="record-main">
                <div class="record-activity">${record.activity}</div>
                <div class="record-duration">${this.formatDuration(
                  record.duration
                )}</div>
              </div>
              <button class="delete-btn" data-record-id="${
                record.id
              }" title="삭제">
                ×
              </button>
            </div>
            <div class="record-time">
              <span>${this.formatDate(startTime)} ${this.formatTime(
          startTime
        )} - ${this.formatTime(endTime)}</span>
            </div>
          </div>
        `;
      })
      .join("");

    this.recordsList.innerHTML = totalTimeHTML + recordsHTML;

    // 삭제 버튼 이벤트 연결
    this.attachDeleteEvents();
  }

  attachDeleteEvents() {
    const deleteButtons = this.recordsList.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const recordId = parseInt(button.dataset.recordId);
        const record = this.records.find((r) => r.id === recordId);
        if (record) {
          this.openDeleteModal(record);
        }
      });
    });
  }

  saveRecords() {
    localStorage.setItem("timeTracker_records", JSON.stringify(this.records));
  }

  loadRecords() {
    const saved = localStorage.getItem("timeTracker_records");
    return saved ? JSON.parse(saved) : [];
  }

  // 데이터 내보내기 기능 (추후 사용 가능)
  exportData() {
    const data = {
      records: this.records,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `time-tracker-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 모달 관련 메서드
  openDeleteModal(record) {
    this.recordToDelete = record.id;
    this.deleteRecordName.textContent = record.activity;
    this.deleteRecordDuration.textContent = this.formatDuration(
      record.duration
    );
    this.deleteModal.style.display = "block";
  }

  closeDeleteModal() {
    this.deleteModal.style.display = "none";
  }

  deleteRecord() {
    if (!this.recordToDelete) return;

    this.records = this.records.filter(
      (record) => record.id !== this.recordToDelete
    );
    this.saveRecords();
    this.displayRecords();
    this.closeDeleteModal();
    this.recordToDelete = null;
  }
}

// 앱 초기화
document.addEventListener("DOMContentLoaded", () => {
  const tracker = new TimeTracker();

  // 개발자 도구에서 데이터 내보내기 가능하도록
  window.timeTracker = tracker;

  console.log("Time Tracker가 시작되었습니다!");
  console.log("데이터를 내보내려면 timeTracker.exportData()를 실행하세요.");
});
