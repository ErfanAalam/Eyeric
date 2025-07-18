// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#008080", // teal-800
        secondary: "#008080", // Purple-600
        accent: "#008080", // Amber-500
        background: "#ffffff", // Gray-50
        text: "#333333", // Gray-900
        muted: "#6b7280", // Gray-500
        button: "#008080", // teal-800

        success: "#10b981", // Green-500
        error: "#ef4444", // Red-500
        warning: "#facc15", // Yellow-400
        info: "#3b82f6", // Blue-500
      },
    },
  },
};
