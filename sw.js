const CACHE_NAME = 'daily-challenge-v2';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './stamp.png',
    './manifest.json',
    './icon-72.png',
    './icon-96.png',
    './icon-128.png',
    './icon-144.png',
    './icon-152.png',
    './icon-192.png',
    './icon-384.png',
    './icon-512.png'
];

// 설치 이벤트
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('캐시 파일들을 저장 중...');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('모든 파일이 캐시되었습니다');
                return self.skipWaiting();
            })
    );
});

// 활성화 이벤트
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('이전 캐시 삭제:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('서비스 워커가 활성화되었습니다');
                return self.clients.claim();
            })
    );
});

// 네트워크 요청 처리
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 캐시에서 찾으면 반환
                if (response) {
                    return response;
                }

                // 네트워크에서 가져오기
                return fetch(event.request)
                    .then(response => {
                        // 유효한 응답인지 확인
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // 응답을 복제하여 캐시에 저장
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // 네트워크 실패 시 오프라인 페이지 반환 (선택사항)
                        if (event.request.destination === 'document') {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});

// 백그라운드 동기화 (선택사항)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            console.log('백그라운드 동기화 실행')
        );
    }
});

// 푸시 알림 처리 (선택사항)
self.addEventListener('push', event => {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: './icon-192.png',
            badge: './icon-96.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '1'
            }
        };

        event.waitUntil(
            self.registration.showNotification('일상 목표 챌린지', options)
        );
    }
});