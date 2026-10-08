(() => {
  "use strict";

  document.documentElement.lang = "fa";
  document.documentElement.dir = "rtl";

  const translations = {
    "MINECRAFT LAUNCHER": "لانچر ماینکرفت",
    "Dashboard": "داشبورد",
    "Accounts": "حساب‌ها",
    "Versions": "نسخه‌ها",
    "Mods": "مودها",
    "Servers": "سرورها",
    "Transfer": "انتقال",
    "Backup / Restore": "پشتیبان‌گیری و بازیابی",
    "Settings": "تنظیمات",
    "Ready": "آماده",
    "Ready to play?": "آماده‌ای بازی کنی؟",
    "Your Minecraft launcher. Your profiles. Your settings.":
      "لانچر ماینکرفت تو؛ پروفایل‌ها و تنظیماتت.",
    "▶ PLAY": "▶ بازی",
    "Account": "حساب",
    "Manage": "مدیریت",
    "Choose": "انتخاب",
    "View servers": "نمایش سرورها",
    "Voice Chat": "گفت‌وگوی صوتی",
    "Voice Chat integration isn't connected yet.":
      "قابلیت گفت‌وگوی صوتی هنوز وصل نشده.",
    "Offline profile": "پروفایل آفلاین",
    "This is a local profile for the launcher UI, not a Microsoft account.":
      "این پروفایل محلی لانچر است، نه حساب مایکروسافت.",
    "Player name": "نام بازیکن",
    "Save profile": "ذخیره پروفایل",
    "Saved profiles": "پروفایل‌های ذخیره‌شده",
    "No extra profiles saved.": "پروفایل اضافه‌ای ذخیره نشده.",
    "Add another local profile": "افزودن پروفایل محلی دیگر",
    "Add profile": "افزودن پروفایل",
    "Game version": "نسخه بازی",
    "Version": "نسخه",
    "Save version": "ذخیره نسخه",
    "Mod loaders": "لودرهای مود",
    "Loader installation and actual game launching still need integration.":
      "نصب لودرها و اجرای واقعی بازی هنوز اضافه نشده.",
    "Mod manager": "مدیریت مودها",
    "Save a list of mods you want to manage. This doesn't install mod files.":
      "فهرست مودها را ذخیره کن؛ این کار مودها را نصب نمی‌کند.",
    "Mod name": "نام مود",
    "Add mod": "افزودن مود",
    "Your mods": "مودهای تو",
    "No mods saved yet.": "هنوز مودی ذخیره نشده.",
    "Server list": "فهرست سرورها",
    "Server name": "نام سرور",
    "Server address": "آدرس سرور",
    "Add server": "افزودن سرور",
    "Saved servers": "سرورهای ذخیره‌شده",
    "Copy address": "کپی آدرس",
    "Remove": "حذف",
    "No servers saved yet.": "هنوز سروری ذخیره نشده.",
    "Backup your launcher data": "پشتیبان‌گیری از اطلاعات لانچر",
    "Export your saved profiles, mod list, servers and settings to JSON.":
      "پروفایل‌ها، مودها، سرورها و تنظیماتت را در فایل پشتیبان ذخیره کن.",
    "Export backup": "دریافت فایل پشتیبان",
    "Restore a backup": "بازیابی پشتیبان",
    "Choose a JSON backup previously exported by this launcher.":
      "فایل پشتیبانی را که قبلاً از لانچر گرفته‌ای انتخاب کن.",
    "Restore backup": "بازیابی پشتیبان",
    "Launcher settings": "تنظیمات لانچر",
    "Memory allocation (RAM)": "مقدار حافظه (RAM)",
    "Theme": "پوسته",
    "Dark": "تیره",
    "Local mode": "حالت محلی",
    "Latest": "آخرین نسخه",
    "Profile saved!": "پروفایل ذخیره شد!",
    "Profile added!": "پروفایل اضافه شد!",
    "Version preference saved!": "نسخه ذخیره شد!",
    "Mod entry added!": "مود اضافه شد!",
    "Server saved!": "سرور ذخیره شد!",
    "Settings saved!": "تنظیمات ذخیره شد!",
    "Backup exported!": "فایل پشتیبان آماده شد!",
    "Choose a backup file first.": "اول فایل پشتیبان را انتخاب کن.",
    "Backup restored!": "پشتیبان بازیابی شد!",
    "That backup file is invalid.": "فایل پشتیبان معتبر نیست.",
    "Minecraft runtime is not connected yet.":
      "قابلیت اجرای ماینکرفت هنوز متصل نشده."
  };

  function translateTextNode(node) {
    const original = node.nodeValue;
    const trimmed = original.trim();

    if (!trimmed) return;

    let result = translations[trimmed];

    if (!result) {
      let match = trimmed.match(/^Selected version:\s*(.+)$/);
      if (match) result = "نسخه انتخاب‌شده: " + match[1];
    }

    if (!result) {
      let match = trimmed.match(/^(\d+) saved mod entries$/);
      if (match) result = match[1] + " مود ذخیره‌شده";
    }

    if (result && result !== trimmed) {
      const leading = original.match(/^\s*/)[0];
      const trailing = original.match(/\s*$/)[0];
      node.nodeValue = leading + result + trailing;
    }
  }

  function translateAttributes(element) {
    for (const attribute of ["placeholder", "title", "aria-label"]) {
      const value = element.getAttribute(attribute);
      if (value && translations[value]) {
        element.setAttribute(attribute, translations[value]);
      }
    }
  }

  function translateTree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE &&
        root.nodeType !== Node.DOCUMENT_NODE) return;

    if (root.nodeType === Node.ELEMENT_NODE) {
      translateAttributes(root);
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      translateTextNode(node);
    }

    if (root.querySelectorAll) {
      root.querySelectorAll("*").forEach(translateAttributes);
    }
  }

  const style = document.createElement("style");
  style.textContent = `
    body {
      direction: rtl !important;
      font-family: Tahoma, "Segoe UI", sans-serif !important;
    }

    aside {
      border-right: 0 !important;
      border-left: 1px solid #26303c !important;
    }

    .nav {
      text-align: right !important;
    }

    .logo span {
      margin-left: 0 !important;
      margin-right: 5px !important;
    }

    .status i {
      margin-right: 0 !important;
      margin-left: 7px !important;
    }

    #toast {
      right: auto !important;
      left: 20px !important;
    }

    input[name="address"] {
      direction: ltr !important;
      text-align: left !important;
    }
  `;

  document.head.appendChild(style);
  translateTree(document.body);

  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === "characterData") {
        translateTextNode(record.target);
      }

      record.addedNodes.forEach(translateTree);
      if (record.type === "attributes") {
        translateAttributes(record.target);
      }
    }
  });

  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["placeholder", "title", "aria-label"]
  });
})();
