// Luôn lấy bản mới nhất của trang từ mạng (không dùng bản lưu tạm), để mỗi lần cập nhật anh Nam thấy ngay
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  if (e.request.mode === 'navigate') e.respondWith(fetch(e.request, { cache: 'no-store' }).catch(function () { return Response.error(); }));
});
