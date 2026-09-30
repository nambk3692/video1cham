// Địa chỉ Apps Script chạy ngầm (ghi Sheet, tạo mã, gửi mail). Đổi ở đây nếu triển khai lại web app mới.
var API = 'https://script.google.com/macros/s/AKfycbwqlgoDDfppaoqDku5BaNfEDkHWPX4J5Tp2exzKKmieLxYR1lusC_FgTTA1_fLf-0FbnQ/exec';
var $ = function (id) { return document.getElementById(id); };

// Đọc tham số từ cả ?query lẫn #hash (mã kích hoạt để ở #hash cho khỏi gửi lên máy chủ)
function params() {
  var p = {};
  [location.search.slice(1), location.hash.slice(1)].forEach(function (s) {
    s.split('&').forEach(function (kv) {
      if (!kv) return;
      var i = kv.indexOf('=');
      var k = i < 0 ? kv : kv.slice(0, i);
      var v = i < 0 ? '' : kv.slice(i + 1);
      try { p[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' ')); } catch (e) { p[k] = v; }
    });
  });
  return p;
}

function getConfig() {
  return fetch(API + '?api=config').then(function (r) { return r.json(); });
}

// POST text/plain để không bị preflight CORS
function callApi(body) {
  return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
    .then(function (r) { return r.json(); });
}

function copyText(text, done) {
  function fallback() {
    var t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(t); done(ok);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
  else fallback();
}

function isDeviceId(s) { return /^[A-HJ-NP-Z2-9]{8}$/.test(String(s || '')); }
