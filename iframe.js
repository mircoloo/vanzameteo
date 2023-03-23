var iframe = document.getElementById('my-iframe');
var iframeWrapper = document.querySelector('.iframe-wrapper');

function resizeIframe() {
  var height = iframe.contentWindow.document.body.scrollHeight;
  iframe.style.height = height + 'px';
  iframeWrapper.style.height = height + 'px';
}

iframe.onload = function() {
  resizeIframe();
};

window.onresize = function() {
  resizeIframe();
};