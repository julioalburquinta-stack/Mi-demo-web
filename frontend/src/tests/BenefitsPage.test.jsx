import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import BenefitsPage from "../pages/BenefitsPage";
import { useBenefits } from "../context/BenefitsContext";

// ------------------ MOCKS ------------------
vi.mock("../components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>,
}));

vi.mock("../components/BenefitsCard", () => ({
  default: ({ benefit }) => <div>{benefit.title}</div>,
}));

vi.mock("../context/BenefitsContext", () => ({
  useBenefits: vi.fn(),
}));

vi.mock("../context/FontSizeContext", () => ({
  useFontSize: vi.fn(() => ({ fontSize: 16 })), // <-- Mockear fontSize aquí
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
describe("BenefitsPage", () => {
  const mockGetBenefits = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock beneficios por defecto
    useBenefits.mockReturnValue({
      getBenefits: mockGetBenefits,
      benefits: [
        { _id: "1", title: "Beneficio 1", description: "Descripción 1" },
        { _id: "2", title: "Beneficio 2", description: "Descripción 2" },
      ],
      isAdmin: false,
    });

    render(
      <MemoryRouter>
        <BenefitsPage />
      </MemoryRouter>
    );
  });

  test("renderiza Navbar y beneficios", () => {
    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
    expect(screen.getByText("Beneficio 1")).toBeInTheDocument();
    expect(screen.getByText("Beneficio 2")).toBeInTheDocument();
  });

  test("llama a getBenefits al montar", () => {
    expect(mockGetBenefits).toHaveBeenCalled();
  });

  test("filtra beneficios según búsqueda", () => {
    const input = screen.getByPlaceholderText(
      "Buscar beneficios por título o descripción..."
    );
    fireEvent.change(input, { target: { value: "2" } });

    expect(screen.queryByText("Beneficio 1")).not.toBeInTheDocument();
    expect(screen.getByText("Beneficio 2")).toBeInTheDocument();
  });

  test("muestra mensaje cuando no hay resultados", () => {
    const input = screen.getByPlaceholderText(
      "Buscar beneficios por título o descripción..."
    );
    fireEvent.change(input, { target: { value: "inexistente" } });

    expect(screen.getByText("No hay resultados")).toBeInTheDocument();
  });

  test("muestra botón de añadir beneficio si es admin y navega al hacer click", () => {
    useBenefits.mockReturnValue({
      getBenefits: mockGetBenefits,
      benefits: [],
      isAdmin: true,
    });

    render(
      <MemoryRouter>
        <BenefitsPage />
      </MemoryRouter>
    );

    const addButton = screen.getByText("+ Añadir Beneficio");
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(mockNavigate).toHaveBeenCalledWith("/add-benefits");
  });

  test("botón de mayúsculas cambia el texto de los beneficios", () => {
    const toggleButton = screen.getByText("Desactivar Mayúsculas");
    fireEvent.click(toggleButton);

    expect(screen.getByText("Beneficio 1")).toBeInTheDocument();
    expect(screen.getByText("Beneficio 2")).toBeInTheDocument();
  });
});