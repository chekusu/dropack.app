// The language selector: choosing a language opens that page. Without JavaScript the
// <noscript> links next to it do the same.
document.getElementById('lang')?.addEventListener('change', (e) => { window.location.href = e.target.value; });
