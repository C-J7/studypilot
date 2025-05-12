import { Sun, Moon } from "@tabler/icons-react";


function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        color: "var(--primary)",
        transition: "color 0.2s"
      }}
    >
      {theme === "light" ? <Sun size={28} stroke={2} /> : <Moon size={28} stroke={2} />}
    </button>
  );
}

export default ThemeToggle;
