import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ForgotPassword from "../pages/ForgotPassword";
import { useFontSize } from "../context/FontSizeContext";
import { sendResetLink } from "../api/passwordApi";

// ------------------ MOCKS ------------------
vi.mock("../components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>
}));

vi.mock("../context/FontSizeContext", () => ({
  useFontSize: vi.fn()
}));

vi.mock("../api/passwordApi", () => ({
  sendResetLink: vi.fn()
}));

describe("ForgotPassword", () => {
  beforeEach(() => {
    useFontSize.mockReturnValue({ fontSize: 16 });
    vi.clearAllMocks();
    render(<ForgotPassword />);
  });

  test("renderiza el Navbar y título", () => {
    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Recuperar Contraseña/i })).toBeInTheDocument();
  });

  test("permite escribir en el input de email", () => {
    const input = screen.getByPlaceholderText("tu@correo.com");
    fireEvent.change(input, { target: { value: "usuario@test.com" } });
    expect(input.value).toBe("usuario@test.com");
  });

  test("envía el formulario y muestra mensaje de éxito", async () => {
    sendResetLink.mockResolvedValueOnce({});
    const input = screen.getByPlaceholderText("tu@correo.com");
    fireEvent.change(input, { target: { value: "usuario@test.com" } });

    const boton = screen.getByText("Enviar link");
    fireEvent.click(boton);

    expect(await screen.findByText(/Si usuario@test.com está registrado/i)).toBeInTheDocument();
    expect(sendResetLink).toHaveBeenCalledWith("usuario@test.com");
  });

  test("muestra mensaje de error si sendResetLink falla", async () => {
    sendResetLink.mockRejectedValueOnce({ response: { data: { message: "Correo inválido" } } });
    const input = screen.getByPlaceholderText("tu@correo.com");
    fireEvent.change(input, { target: { value: "bad@test.com" } });

    const boton = screen.getByText("Enviar link");
    fireEvent.click(boton);

    expect(await screen.findByText("Correo inválido")).toBeInTheDocument();
  });
});