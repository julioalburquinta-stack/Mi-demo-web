import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../pages/RegisterPage";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { FontSizeProvider } from "../context/FontSizeContext";

// Mock de useAuth
const mockSignup = vi.fn().mockResolvedValue(); // Aseguramos que sea async

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    signup: mockSignup,
    isAuthenticated: false,
    errors: [],
  }),
  AuthProvider: ({ children }) => <>{children}</>, // mock del provider
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <FontSizeProvider>
          <RegisterPage />
        </FontSizeProvider>
      </BrowserRouter>
    );
  });

  test("renderiza el título de registro", () => {
    expect(screen.getByText(/Registro/i)).toBeInTheDocument();
  });

  test("renderiza los campos de formulario", () => {
    expect(screen.getByPlaceholderText("Nombre de usuario")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
  });

  test("envía el formulario con datos válidos", async () => {
    // Rellenar inputs
    fireEvent.change(screen.getByPlaceholderText("Nombre de usuario"), { target: { value: "Juan" } });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), { target: { value: "juan@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "123456" } });

    // Seleccionar el formulario
    const form = screen.getByPlaceholderText("Nombre de usuario").closest("form");

    // Hacer submit directamente sobre el formulario
    fireEvent.submit(form);

    // Esperar que se haya llamado el mockSignup con los datos correctos
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        username: "Juan",
        email: "juan@mail.com",
        password: "123456",
      });
    });
  });

  test("muestra enlace a login", () => {
    expect(screen.getByRole("link", { name: /Inicie sesión/i })).toBeInTheDocument();
  });
});