import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AboutUsPage from "../pages/AboutUsPage";
import { useFontSize } from "../context/FontSizeContext";

// ------------------ MOCKS ------------------
vi.mock("../components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>,
}));

vi.mock("../context/FontSizeContext", () => ({
  useFontSize: vi.fn(),
}));

// ------------------ TESTS ------------------
describe("AboutUsPage", () => {
  beforeEach(() => {
    // Mock del tamaño de fuente
    useFontSize.mockReturnValue({ fontSize: 16 });

    render(
      <MemoryRouter>
        <AboutUsPage />
      </MemoryRouter>
    );
  });

  test("renderiza el Navbar correctamente", () => {
    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
  });

  test("renderiza la sección de bienvenida", () => {
    expect(screen.getByRole("heading", { name: /¡Bienvenidos a Asistente Geri!/i })).toBeInTheDocument();
    expect(screen.getByText(/Tu apoyo digital para un envejecimiento activo/i)).toBeInTheDocument();
  });

  test("renderiza la sección 'Quiénes somos'", () => {
    expect(screen.getByRole("heading", { name: /Quiénes somos/i })).toBeInTheDocument();
    expect(screen.getByText(/Somos un equipo dedicado/i)).toBeInTheDocument();
  });

  test("renderiza los valores con imágenes y texto", () => {
    const valores = ["Accesibilidad", "Respeto", "Inclusión"];
    valores.forEach((valor) => {
      expect(screen.getByText(valor)).toBeInTheDocument();
    });

    const images = screen.getAllByRole("img");
    expect(images.length).toBe(3);
    expect(images[0]).toHaveAttribute("alt", "Accesibilidad");
    expect(images[1]).toHaveAttribute("alt", "Respeto");
    expect(images[2]).toHaveAttribute("alt", "Inclusión");
  });

  test("renderiza el cuadro de aviso sobre ajuste de letra", () => {
    expect(screen.getByRole("heading", { name: /Aviso/i })).toBeInTheDocument();
    expect(screen.getByText(/Si tienes dificultad para leer/i)).toBeInTheDocument();
  });

  test("renderiza el footer con derechos reservados", () => {
    expect(screen.getByText(/Asistente Geri © 2025/i)).toBeInTheDocument();
  });
});