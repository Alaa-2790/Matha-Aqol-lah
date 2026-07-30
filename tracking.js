(() => {
  "use strict";

  const attributionKeys = [
    "fbclid",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];
  const storagePrefix = "maql_";
  const currentParams = new URLSearchParams(window.location.search);

  for (const key of attributionKeys) {
    const currentValue = currentParams.get(key);
    if (currentValue) {
      window.sessionStorage.setItem(`${storagePrefix}${key}`, currentValue);
    }
  }

  const checkoutLinks = document.querySelectorAll(
    'a[href^="https://payhip.com/buy?link=aPH50"]',
  );

  for (const link of checkoutLinks) {
    const checkoutUrl = new URL(link.href);

    for (const key of attributionKeys) {
      const value =
        currentParams.get(key) ||
        window.sessionStorage.getItem(`${storagePrefix}${key}`);
      if (value) {
        checkoutUrl.searchParams.set(key, value);
      }
    }

    link.href = checkoutUrl.toString();
    link.addEventListener("click", () => {
      if (typeof window.fbq === "function") {
        window.fbq("trackCustom", "CheckoutClick", {
          content_name: "ماذا أقول له؟",
          content_ids: ["aPH50"],
          content_type: "product",
          value: 18.5,
          currency: "USD",
        });
      }
    });
  }
})();
