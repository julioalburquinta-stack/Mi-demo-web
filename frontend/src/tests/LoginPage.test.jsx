import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import LoginPage from "../pages/LoginPage";
import { useAuth } from "../context/AuthContext";
import { useFontSize } from "../context/FontSizeContext";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";

// ------------------ MOCKS ------------------
vi.mock("../components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn()
}));

vi.mock("../context/FontSizeContext", () => ({
  useFontSize: vi.fn()
}));

const mockNavigate = vi.fn();

// Mock parcial de react-router-dom para mantener MemoryRouter
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe("LoginPage", () => {
  const mockSignin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useFontSize.mockReturnValue({ fontSize: 16 });
    useAuth.mockReturnValue({
      signin: mockSignin,
      errors: [],
      isAuthenticated: false
    });
  });

  test("renderiza la página con Navbar y campos de formulario", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Navbar
    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();

    // Inputs
    expect(screen.getByPlaceholderText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();

    // Encabezado <h1>
    expect(screen.getByRole("heading", { name: "Iniciar Sesión" })).toBeInTheDocument();

    // Botón de envío
    expect(screen.getByRole("button", { name: "Iniciar Sesión" })).toBeInTheDocument();
  });

  test("muestra errores de validación si los campos están vacíos", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: "Iniciar Sesión" });
    fireEvent.click(button);

    expect(await screen.findByText("Se necesita el email")).toBeInTheDocument();
    expect(await screen.findByText("Se necesita la contraseña")).toBeInTheDocument();
    expect(mockSignin).not.toHaveBeenCalled();
  });

  test("llama a signin con datos correctos", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "123456" } });

    const button = screen.getByRole("button", { name: "Iniciar Sesión" });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSignin).toHaveBeenCalledWith({ email: "test@example.com", password: "123456" });
    });
  });

  test("muestra errores de inicio de sesión del contexto", () => {
    useAuth.mockReturnValue({
      signin: mockSignin,
      errors: ["Usuario o contraseña incorrectos"],
      isAuthenticated: false
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Usuario o contraseña incorrectos")).toBeInTheDocument();
  });

  test("redirige al home si ya está autenticado", () => {
    useAuth.mockReturnValue({
      signin: mockSignin,
      errors: [],
      isAuthenticated: true
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});