import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import GamePage from "../pages/GamePage";
import { useAuth } from "../context/AuthContext";

// ------------------ MOCKS ------------------
vi.mock("../components/Navbar", () => ({
  default: ({ onLogout }) => (
    <div>
      Mock Navbar
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn()
}));

describe("GamePage", () => {
  let confirmMock;
  let logoutMock;

  beforeEach(() => {
    // Mock de confirm
    confirmMock = vi.spyOn(window, "confirm").mockImplementation(() => true);
    logoutMock = vi.fn();
    useAuth.mockReturnValue({ logout: logoutMock });

    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renderiza Navbar y título del juego", () => {
    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Juego de Memoria/i })).toBeInTheDocument();
  });

  test("muestra los botones de dificultad", () => {
    ["Muy fácil", "Fácil", "Medio", "Difícil", "Experto"].forEach(level => {
      expect(screen.getByText(level)).toBeInTheDocument();
    });
  });

  test("renderiza cartas con '?' al inicio", () => {
    const cartas = screen.getAllByText("?");
    expect(cartas.length).toBeGreaterThan(0);
  });

  test("botón reiniciar reinicia el tablero", () => {
    const botonReiniciar = screen.getByText(/Reiniciar/i);
    fireEvent.click(botonReiniciar);
    expect(screen.getAllByText("?").length).toBeGreaterThan(0);
  });

  test("cambiar dificultad pide confirmación si hay progreso", () => {
    const primeraCarta = screen.getAllByText("?")[0];
    fireEvent.click(primeraCarta);
    const botonMedio = screen.getByText("Medio");
    fireEvent.click(botonMedio);
    expect(confirmMock).toHaveBeenCalled();
  });

  test("handleLogout pide confirmación si hay progreso y ejecuta logout", () => {
    const primeraCarta = screen.getAllByText("?")[0];
    fireEvent.click(primeraCarta);

    const botonLogout = screen.getByText("Logout");
    fireEvent.click(botonLogout);

    expect(confirmMock).toHaveBeenCalled();
    expect(logoutMock).toHaveBeenCalled();
  });

  test("permite abrir y cerrar el manual", () => {
    const botonInstrucciones = screen.getByText("Instrucciones");
    fireEvent.click(botonInstrucciones);
    expect(screen.getByText("Manual de Instrucciones")).toBeInTheDocument();

    const botonVolver = screen.getByText("Volver a la partida");
    fireEvent.click(botonVolver);
    expect(screen.getByText("Juego de Memoria")).toBeInTheDocument();
  });
});