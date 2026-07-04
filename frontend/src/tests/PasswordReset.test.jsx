import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import PasswordReset from "../pages/PasswordReset";
import { useFontSize } from "../context/FontSizeContext";
import { verifyResetToken, resetPassword } from "../api/passwordApi";
import { MemoryRouter } from "react-router-dom";

// ------------------ MOCKS ------------------
vi.mock("../components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>
}));

vi.mock("../context/FontSizeContext", () => ({
  useFontSize: vi.fn()
}));

vi.mock("../api/passwordApi", () => ({
  verifyResetToken: vi.fn(),
  resetPassword: vi.fn()
}));

// Mock parcial de react-router-dom, preservando MemoryRouter, Route, etc.
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "123", token: "abc" })
  };
});

const mockNavigate = vi.fn();

describe("PasswordReset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFontSize.mockReturnValue({ fontSize: 16 });
  });

  test("renderiza Navbar y muestra mensaje de enlace inválido si token falla", async () => {
    verifyResetToken.mockRejectedValueOnce(new Error("Invalid token"));

    render(
      <MemoryRouter>
        <PasswordReset />
      </MemoryRouter>
    );

    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Enlace inválido/i)).toBeInTheDocument();
    });
  });

  test("renderiza formulario si token válido", async () => {
    verifyResetToken.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <PasswordReset />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Actualizar Contraseña/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Nueva contraseña")).toBeInTheDocument();
    });
  });

  test("valida longitud mínima de contraseña", async () => {
    verifyResetToken.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <PasswordReset />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByPlaceholderText("Nueva contraseña"));

    const input = screen.getByPlaceholderText("Nueva contraseña");
    fireEvent.change(input, { target: { value: "123" } });

    const button = screen.getByText("Actualizar contraseña");
    fireEvent.click(button);

    expect(await screen.findByText(/al menos 6 caracteres/i)).toBeInTheDocument();
  });

  test("llama resetPassword y navega tras éxito", async () => {
    verifyResetToken.mockResolvedValueOnce({});
    resetPassword.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <PasswordReset />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByPlaceholderText("Nueva contraseña"));

    const input = screen.getByPlaceholderText("Nueva contraseña");
    fireEvent.change(input, { target: { value: "123456" } });

    const button = screen.getByText("Actualizar contraseña");
    fireEvent.click(button);

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith("123", "abc", "123456");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("muestra error si resetPassword falla", async () => {
    verifyResetToken.mockResolvedValueOnce({});
    resetPassword.mockRejectedValueOnce({ response: { data: { message: "Error backend" } } });

    render(
      <MemoryRouter>
        <PasswordReset />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByPlaceholderText("Nueva contraseña"));

    const input = screen.getByPlaceholderText("Nueva contraseña");
    fireEvent.change(input, { target: { value: "123456" } });

    const button = screen.getByText("Actualizar contraseña");
    fireEvent.click(button);

    expect(await screen.findByText("Error backend")).toBeInTheDocument();
  });
});