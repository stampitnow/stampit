class DailyChallengeApp {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.currentGoalId = null;
        this.masterGoals = this.loadData('masterGoals') || [];
        this.deferredPrompt = null;
        this.initializeElements();
        this.attachEventListeners();
        this.setupPWA();
        this.showGoalSelectionScreen();
    }

    initializeElements() {
        // Screen elements
        this.goalSelectionScreen = document.getElementById('goalSelectionScreen');
        this.dailyTrackingScreen = document.getElementById('dailyTrackingScreen');

        // Goal selection screen elements
        this.newGoalInput = document.getElementById('newGoalInput');
        this.addNewGoalBtn = document.getElementById('addNewGoalBtn');
        this.existingGoalsList = document.getElementById('existingGoalsList');
        this.exportDataBtn = document.getElementById('exportDataBtn');
        this.importDataBtn = document.getElementById('importDataBtn');
        this.importFileInput = document.getElementById('importFileInput');

        // PWA elements
        this.installPrompt = document.getElementById('installPrompt');
        this.installBtn = document.getElementById('installBtn');
        this.dismissBtn = document.getElementById('dismissBtn');

        // Daily tracking screen elements
        this.backToGoalsBtn = document.getElementById('backToGoalsBtn');
        this.currentGoalTitle = document.getElementById('currentGoalTitle');
        this.stampBtn = document.getElementById('stampBtn');
        this.calendar = document.getElementById('calendar');
        this.currentMonthDisplay = document.getElementById('currentMonth');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');
        this.dailyComment = document.getElementById('dailyComment');
        this.saveCommentBtn = document.getElementById('saveCommentBtn');
        this.consecutiveDaysDisplay = document.getElementById('consecutiveDays');
        this.bestRecordDisplay = document.getElementById('bestRecord');
    }

    attachEventListeners() {
        // Goal selection screen listeners
        this.addNewGoalBtn.addEventListener('click', () => this.addNewGoal());
        this.newGoalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addNewGoal();
        });
        this.exportDataBtn.addEventListener('click', () => this.exportData());
        this.importDataBtn.addEventListener('click', () => this.importFileInput.click());
        this.importFileInput.addEventListener('change', (e) => this.importData(e));

        // PWA listeners
        this.installBtn.addEventListener('click', () => this.installPWA());
        this.dismissBtn.addEventListener('click', () => this.dismissInstallPrompt());

        // Daily tracking screen listeners
        this.backToGoalsBtn.addEventListener('click', () => this.showGoalSelectionScreen());
        this.stampBtn.addEventListener('click', () => this.stampToday());
        this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
        this.saveCommentBtn.addEventListener('click', () => this.saveComment());
    }

    showGoalSelectionScreen() {
        this.goalSelectionScreen.classList.remove('hidden');
        this.dailyTrackingScreen.classList.add('hidden');
        this.renderExistingGoals();
    }

    showDailyTrackingScreen(goalId) {
        this.currentGoalId = goalId;
        const goal = this.masterGoals.find(g => g.id === goalId);

        this.goalSelectionScreen.classList.add('hidden');
        this.dailyTrackingScreen.classList.remove('hidden');

        this.selectedDate = new Date();
        this.currentGoalTitle.textContent = goal.title;
        this.renderCalendar();
        this.updateStats();
        this.loadCommentForDate(this.selectedDate);
    }

    addNewGoal() {
        const goalTitle = this.newGoalInput.value.trim();
        if (goalTitle) {
            const newGoal = {
                id: Date.now(),
                title: goalTitle,
                createdDate: this.formatDate(new Date()),
                stampedDates: [],
                comments: {}
            };

            this.masterGoals.push(newGoal);
            this.saveData('masterGoals', this.masterGoals);
            this.newGoalInput.value = '';
            this.renderExistingGoals();
        }
    }

    renderExistingGoals() {
        this.existingGoalsList.innerHTML = this.masterGoals.map(goal => {
            const totalDays = goal.stampedDates ? goal.stampedDates.length : 0;
            const consecutiveDays = this.calculateConsecutiveDaysForGoal(goal);

            return `
                <div class="goal-card">
                    <div class="goal-card-content" onclick="app.selectGoal(${goal.id})">
                        <h3>${goal.title}</h3>
                        <p>생성일: ${goal.createdDate}</p>
                        <div class="goal-stats">
                            최고 ${totalDays}일&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;연속 ${consecutiveDays}일
                        </div>
                    </div>
                    <div class="goal-actions">
                        <button class="edit-goal-btn" onclick="event.stopPropagation(); app.editGoal(${goal.id})">수정</button>
                        <button class="delete-goal-btn" onclick="event.stopPropagation(); app.deleteGoal(${goal.id})">삭제</button>
                    </div>
                </div>
            `;
        }).join('');

        if (this.masterGoals.length === 0) {
            this.existingGoalsList.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">등록된 목표가 없습니다. 새로운 목표를 등록해보세요!</p>';
        }
    }

    selectGoal(goalId) {
        this.showDailyTrackingScreen(goalId);
    }

    editGoal(goalId) {
        const goal = this.masterGoals.find(g => g.id === goalId);
        if (!goal) return;

        const newTitle = prompt('목표 제목을 수정하세요:', goal.title);
        if (newTitle && newTitle.trim() && newTitle.trim() !== goal.title) {
            goal.title = newTitle.trim();
            this.saveData('masterGoals', this.masterGoals);
            this.renderExistingGoals();
            alert('목표가 수정되었습니다!');
        }
    }

    deleteGoal(goalId) {
        const goal = this.masterGoals.find(g => g.id === goalId);
        if (!goal) return;

        const totalDays = goal.stampedDates ? goal.stampedDates.length : 0;
        const confirmMessage = `"${goal.title}" 목표를 삭제하시겠습니까?\n\n총 ${totalDays}일의 기록이 함께 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.`;

        if (confirm(confirmMessage)) {
            this.masterGoals = this.masterGoals.filter(g => g.id !== goalId);
            this.saveData('masterGoals', this.masterGoals);
            this.renderExistingGoals();
            alert('목표가 삭제되었습니다.');
        }
    }

    stampToday() {
        const today = this.formatDate(new Date());
        const goal = this.masterGoals.find(g => g.id === this.currentGoalId);

        if (!goal.stampedDates) {
            goal.stampedDates = [];
        }

        if (!goal.stampedDates.includes(today)) {
            goal.stampedDates.push(today);
            this.saveData('masterGoals', this.masterGoals);
            this.renderCalendar();
            this.updateStats();

            // Add stamp animation effect
            this.stampBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.stampBtn.style.transform = 'scale(1)';
            }, 200);

            alert('축하합니다! 오늘의 목표를 완료했습니다! 🎉');
        } else {
            alert('오늘은 이미 도장을 찍었습니다!');
        }
    }

    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const goal = this.masterGoals.find(g => g.id === this.currentGoalId);

        this.currentMonthDisplay.textContent = `${year}년 ${month + 1}월`;

        // Create weekday headers
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        let calendarHTML = '<div class="weekday-header">';
        weekdays.forEach(day => {
            calendarHTML += `<div class="weekday">${day}</div>`;
        });
        calendarHTML += '</div><div class="calendar-grid">';

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Add previous month's trailing days
        const prevMonth = new Date(year, month, 0);
        const daysInPrevMonth = prevMonth.getDate();

        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            calendarHTML += `<div class="calendar-day other-month">${day}</div>`;
        }

        // Add current month's days
        const today = new Date();
        const todayStr = this.formatDate(today);
        const selectedStr = this.formatDate(this.selectedDate);

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = this.formatDate(date);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedStr;
            const isStamped = goal.stampedDates && goal.stampedDates.includes(dateStr);

            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';
            if (isStamped) classes += ' stamped';

            calendarHTML += `
                <div class="${classes}" data-date="${dateStr}" onclick="app.selectDate('${dateStr}')">
                    ${day}
                    ${isStamped ? '<div class="stamp-icon"></div>' : ''}
                </div>
            `;
        }

        // Add next month's leading days
        const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
        const remainingCells = totalCells - startingDayOfWeek - daysInMonth;

        for (let day = 1; day <= remainingCells; day++) {
            calendarHTML += `<div class="calendar-day other-month">${day}</div>`;
        }

        calendarHTML += '</div>';
        this.calendar.innerHTML = calendarHTML;
    }

    updateStats() {
        const goal = this.masterGoals.find(g => g.id === this.currentGoalId);
        const consecutiveDays = this.calculateConsecutiveDaysForGoal(goal);
        const bestRecord = this.calculateBestRecordForGoal(goal);

        this.consecutiveDaysDisplay.textContent = consecutiveDays;
        this.bestRecordDisplay.textContent = bestRecord;
    }

    calculateConsecutiveDaysForGoal(goal) {
        if (!goal.stampedDates || goal.stampedDates.length === 0) return 0;

        const sortedDates = goal.stampedDates
            .map(dateStr => new Date(dateStr))
            .sort((a, b) => b - a);

        let consecutive = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedDates.length; i++) {
            const date = sortedDates[i];
            date.setHours(0, 0, 0, 0);

            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);

            if (date.getTime() === expectedDate.getTime()) {
                consecutive++;
            } else {
                break;
            }
        }

        return consecutive;
    }

    calculateBestRecordForGoal(goal) {
        if (!goal.stampedDates || goal.stampedDates.length === 0) return 0;

        const sortedDates = goal.stampedDates
            .map(dateStr => new Date(dateStr))
            .sort((a, b) => a - b);

        let maxStreak = 1;
        let currentStreak = 1;

        for (let i = 1; i < sortedDates.length; i++) {
            const currentDate = sortedDates[i];
            const prevDate = sortedDates[i - 1];

            const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);

            if (dayDiff === 1) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }

        return maxStreak;
    }

    selectDate(dateStr) {
        this.selectedDate = new Date(dateStr);
        this.renderCalendar();
        this.loadCommentForDate(this.selectedDate);
    }

    saveComment() {
        const dateStr = this.formatDate(this.selectedDate);
        const comment = this.dailyComment.value.trim();
        const goal = this.masterGoals.find(g => g.id === this.currentGoalId);

        if (!goal.comments) {
            goal.comments = {};
        }

        if (comment) {
            goal.comments[dateStr] = comment;
        } else {
            delete goal.comments[dateStr];
        }

        this.saveData('masterGoals', this.masterGoals);
        alert('활동 기록이 저장되었습니다!');
    }

    loadCommentForDate(date) {
        const dateStr = this.formatDate(date);
        const goal = this.masterGoals.find(g => g.id === this.currentGoalId);
        const comment = (goal.comments && goal.comments[dateStr]) || '';
        this.dailyComment.value = comment;
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    exportData() {
        try {
            const exportData = {
                version: "1.0",
                exportDate: new Date().toISOString(),
                masterGoals: this.masterGoals
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);

            const today = new Date().toISOString().split('T')[0];
            link.download = `daily-challenge-backup-${today}.json`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert('데이터가 성공적으로 내보내졌습니다! 📁');
        } catch (error) {
            alert('데이터 내보내기 중 오류가 발생했습니다: ' + error.message);
        }
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);

                // 데이터 형식 검증
                if (!importedData.masterGoals || !Array.isArray(importedData.masterGoals)) {
                    throw new Error('올바르지 않은 백업 파일 형식입니다.');
                }

                // 기존 데이터와 병합 여부 확인
                const shouldMerge = this.masterGoals.length > 0 ?
                    confirm('기존 데이터가 있습니다. 가져온 데이터와 병합하시겠습니까?\n\n확인: 병합\n취소: 교체') :
                    true;

                if (shouldMerge) {
                    // 데이터 병합 (중복 제거)
                    const existingIds = new Set(this.masterGoals.map(goal => goal.id));
                    const newGoals = importedData.masterGoals.filter(goal => !existingIds.has(goal.id));
                    this.masterGoals = [...this.masterGoals, ...newGoals];
                } else {
                    // 데이터 완전 교체
                    this.masterGoals = importedData.masterGoals;
                }

                this.saveData('masterGoals', this.masterGoals);
                this.renderExistingGoals();

                const importCount = shouldMerge ?
                    importedData.masterGoals.filter(goal => !this.masterGoals.some(existing => existing.id === goal.id)).length :
                    importedData.masterGoals.length;

                alert(`데이터를 성공적으로 가져왔습니다! 📂\n가져온 목표: ${importCount}개`);

                // 파일 입력 초기화
                event.target.value = '';

            } catch (error) {
                alert('데이터 가져오기 중 오류가 발생했습니다: ' + error.message);
                event.target.value = '';
            }
        };

        reader.readAsText(file);
    }

    setupPWA() {
        // PWA 설치 이벤트 리스너
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;

            // 이미 설치되었는지 확인
            if (!window.matchMedia('(display-mode: standalone)').matches) {
                // 첫 방문 후 3초 뒤에 설치 프롬프트 표시
                setTimeout(() => {
                    this.showInstallPrompt();
                }, 3000);
            }
        });

        // 앱이 성공적으로 설치되었을 때
        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            this.hideInstallPrompt();
            console.log('PWA 설치 완료');
        });

        // iOS Safari 감지 및 안내
        if (this.isIOS() && !this.isInStandaloneMode()) {
            this.showIOSInstallGuide();
        }
    }

    showInstallPrompt() {
        if (this.deferredPrompt && this.installPrompt) {
            this.installPrompt.classList.remove('hidden');
        }
    }

    hideInstallPrompt() {
        if (this.installPrompt) {
            this.installPrompt.classList.add('hidden');
        }
    }

    async installPWA() {
        if (!this.deferredPrompt) return;

        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('사용자가 설치를 승인했습니다');
            } else {
                console.log('사용자가 설치를 거절했습니다');
            }

            this.deferredPrompt = null;
            this.hideInstallPrompt();
        } catch (error) {
            console.error('PWA 설치 중 오류:', error);
            this.hideInstallPrompt();
        }
    }

    dismissInstallPrompt() {
        this.hideInstallPrompt();
        // 24시간 동안 프롬프트 표시하지 않음
        localStorage.setItem('installPromptDismissed', Date.now().toString());
    }

    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    isInStandaloneMode() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }

    showIOSInstallGuide() {
        // iOS에서는 수동 설치 안내만 제공
        if (!this.isInStandaloneMode()) {
            setTimeout(() => {
                if (confirm('📱 iPhone에서 앱으로 설치하시겠습니까?\n\n1. Safari 하단의 공유 버튼 탭\n2. "홈 화면에 추가" 선택\n3. "추가" 버튼 탭')) {
                    alert('Safari 브라우저에서 공유 버튼(□↗)을 눌러 "홈 화면에 추가"를 선택해주세요.');
                }
            }, 2000);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DailyChallengeApp();
});

// Add PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}