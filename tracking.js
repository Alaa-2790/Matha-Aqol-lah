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
    'a[data-buy-method="paypal_or_card"]',
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
  }

  const paymentLinks = document.querySelectorAll("a[data-buy-method]");

  for (const link of paymentLinks) {
    link.addEventListener("click", () => {
      const paymentMethod = link.dataset.buyMethod || "unknown";
      const eventDetails = {
        content_name: "ماذا أقول له؟",
        content_ids: ["aPH50"],
        content_type: "product",
        payment_method: paymentMethod,
        link_url: link.href,
        value: 69,
        currency: "SAR",
      };

      if (typeof window.gtag === "function") {
        window.gtag("event", "buy_click", eventDetails);
      }

      if (typeof window.fbq === "function") {
        window.fbq("trackCustom", "PaymentOptionClick", eventDetails);

        if (paymentMethod === "paypal_or_card") {
          window.fbq("trackCustom", "CheckoutClick", eventDetails);
        }
      }
    });
  }
})();
