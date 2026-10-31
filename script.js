// One deliberate motion moment: the hero tally counts up once, like a
// total settling on a ledger. Respects reduced-motion and only runs once.
(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var values = document.querySelectorAll('.tally__value[data-count-to]');

  if (!values.length) return;

  if (prefersReducedMotion) {
    values.forEach(function (el) {
      el.textContent = el.getAttribute('data-count-to');
    });
    return;
  }

  var duration = 900;

  function animate(el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10);
    var start = performance.now();

    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            values.forEach(animate);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(values[0]);
  } else {
    values.forEach(animate);
  }
})();
