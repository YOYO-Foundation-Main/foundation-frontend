export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // already loaded
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      console.log("✅ Razorpay SDK Loaded");
      resolve(true);
    };

    script.onerror = () => {
      console.error("❌ Razorpay SDK Failed");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};