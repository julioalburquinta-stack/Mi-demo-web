import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import HomePage from "../pages/HomePage";
import { useFontSize } from "../context/FontSizeContext";
import { useAuth } from "../context/AuthContext";

// ------------------ MOCKS ------------------
vi.mock("../components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>,
}));

vi.mock("../context/FontSizeContext", () => ({
  useFontSize: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ------------------ TESTS ------------------
describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useFontSize.mockReturnValue({ fontSize: 16 });
    useAuth.mockReturnValue({ user: { isAdmin: true } });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  });

  test("renderiza el Navbar", () => {
    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
  });

  test("renderiza los botones principales incluyendo admin", () => {
    const labels = [
      "Sobre Nosotros",
      "Agenda de Eventos",
      "Juego de Memoria",
      "Beneficios Tercera Edad",
      "Videos Rutinas de Ejercicios",
      "Guía de Nutrición",
      "Usuarios Asist. Geri", // Solo admin
    ];

    labels.forEach((label) => {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    });
  });

  test("botones disparan navegación simulada", () => {
    const gameButton = screen.getByRole("button", { name: /Juego de Memoria/i });
    fireEvent.click(gameButton);
    expect(mockNavigate).toHaveBeenCalledWith("/game");

    const usersButton = screen.getByRole("button", { name: /Usuarios Asist. Geri/i });
    fireEvent.click(usersButton);
    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });

  test("renderiza el footer con derechos reservados", () => {
    expect(screen.getByText(/Asistente Geri © 2025/i)).toBeInTheDocument();
  });
});