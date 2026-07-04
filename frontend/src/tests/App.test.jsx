import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AboutUsPage from "../pages/AboutUsPage";
import { useFontSize } from "../context/FontSizeContext";

// ------------------ MOCKS ------------------
vi.mock("../components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>
}));

vi.mock("../context/FontSizeContext", () => ({
  useFontSize: vi.fn()
}));

// ------------------ TESTS ------------------
describe("AboutUsPage (desde App.test.jsx)", () => {
  beforeEach(() => {
    useFontSize.mockReturnValue({ fontSize: 16 });

    render(
      <MemoryRouter>
        <AboutUsPage />
      </MemoryRouter>
    );
  });

  test("renderiza el Navbar", () => {
    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
  });

  test("renderiza sección de bienvenida", () => {
    expect(screen.getByText(/¡Bienvenidos a Asistente Geri!/i)).toBeInTheDocument();
    expect(screen.getByText(/Tu apoyo digital para un envejecimiento activo/i)).toBeInTheDocument();
  });

  test("renderiza sección 'Quiénes somos'", () => {
    // corregido: tilde en "Quiénes"
    expect(screen.getByText(/Quiénes somos/i)).toBeInTheDocument();
    expect(screen.getByText(/Somos un equipo dedicado/i)).toBeInTheDocument();
  });

  test("renderiza los valores con imágenes y texto", () => {
    expect(screen.getByText("Accesibilidad")).toBeInTheDocument();
    expect(screen.getByText("Respeto")).toBeInTheDocument();
    expect(screen.getByText("Inclusión")).toBeInTheDocument();

    const images = screen.getAllByRole("img");
    expect(images.length).toBe(3);
    expect(images[0]).toHaveAttribute("alt", "Accesibilidad");
    expect(images[1]).toHaveAttribute("alt", "Respeto");
    expect(images[2]).toHaveAttribute("alt", "Inclusión");
  });

  test("renderiza el footer con derechos reservados", () => {
    expect(screen.getByText(/Asistente Geri © 2025/i)).toBeInTheDocument();
  });
});