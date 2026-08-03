/** Add a copy button next to Hangul names under .place > small on flowchart pages. */
(function () {
  const HANGUL = /[\uAC00-\uD7A3]/;

  function injectStyles() {
    if (document.getElementById("ko-copy-style")) return;
    const style = document.createElement("style");
    style.id = "ko-copy-style";
    style.textContent = `
      .place .ko-row {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 6px;
        margin-top: 2px;
      }
      .place .ko-row small {
        font-weight: 400;
      }
      .ko-copy-btn {
        flex-shrink: 0;
        border: 1px solid rgba(100, 80, 120, 0.28);
        background: #fffefb;
        color: #6b5a78;
        font-size: 0.55rem;
        font-weight: 600;
        font-family: inherit;
        padding: 2px 7px;
        border-radius: 999px;
        cursor: pointer;
        line-height: 1.4;
      }
      .ko-copy-btn:hover,
      .ko-copy-btn.copied {
        color: #8b4a9a;
        border-color: rgba(139, 74, 154, 0.45);
        background: #faf5ff;
      }
      .ko-copy-toast {
        position: fixed;
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%) translateY(10px);
        background: #3d2a45;
        color: #fffef8;
        font-size: 0.78rem;
        font-weight: 600;
        padding: 10px 16px;
        border-radius: 999px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s, transform 0.2s;
        z-index: 1000;
        max-width: min(90vw, 360px);
        text-align: center;
      }
      .ko-copy-toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  function copyText(text) {
    const value = String(text || "").trim();
    if (!value) return Promise.resolve(false);
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value).then(
        () => true,
        () => fallbackCopy(value)
      );
    }
    return Promise.resolve(fallbackCopy(value));
  }

  function fallbackCopy(value) {
    try {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (_) {
      return false;
    }
  }

  function showToast(msg) {
    let el = document.getElementById("ko-copy-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "ko-copy-toast";
      el.className = "ko-copy-toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove("show"), 1400);
  }

  /** Prefer the Hangul segment before · / ・ for taxi search. */
  function koCopyValue(raw) {
    const t = String(raw || "").trim();
    if (!t) return "";
    const parts = t.split(/\s*[·・|]\s*/);
    for (const part of parts) {
      if (HANGUL.test(part)) return part.trim();
    }
    return t;
  }

  function enhance() {
    injectStyles();
    document.querySelectorAll(".place").forEach((place) => {
      const small = place.querySelector(":scope > small");
      if (!small || small.dataset.koReady) return;
      const raw = small.textContent.trim();
      if (!HANGUL.test(raw)) return;
      small.dataset.koReady = "1";

      const copyVal = koCopyValue(raw);
      const row = document.createElement("span");
      row.className = "ko-row";
      small.replaceWith(row);
      row.appendChild(small);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ko-copy-btn";
      btn.textContent = "複製";
      btn.title = `複製韓文名：${copyVal}`;
      btn.setAttribute("aria-label", `複製韓文名 ${copyVal}`);
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const ok = await copyText(copyVal);
        if (ok) {
          btn.classList.add("copied");
          btn.textContent = "已複製";
          showToast(`已複製：${copyVal}`);
          setTimeout(() => {
            btn.classList.remove("copied");
            btn.textContent = "複製";
          }, 1200);
        } else {
          showToast("複製失敗，請長按韓文手動複製");
        }
      });
      row.appendChild(btn);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhance);
  } else {
    enhance();
  }
})();
