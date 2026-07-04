import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import EventsPage from "../pages/EventsPage";
import { useEvents } from "../context/EventsContext";
import { useFontSize } from "../context/FontSizeContext";

// ------------------ MOCKS ------------------
vi.mock("../components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>,
}));

vi.mock("../components/EventCard", () => ({
  default: ({ event }) => <div>Mock EventCard: {event.title}</div>,
}));

vi.mock("../context/EventsContext", () => ({
  useEvents: vi.fn(),
}));

vi.mock("../context/FontSizeContext", () => ({
  useFontSize: vi.fn(),
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
describe("EventsPage", () => {
  const mockGetEvents = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useFontSize.mockReturnValue({ fontSize: 16 });
  });

  test("renderiza Navbar y lista de eventos", () => {
    useEvents.mockReturnValue({
      getEvents: mockGetEvents,
      events: [
        { _id: "1", title: "Evento 1" },
        { _id: "2", title: "Evento 2" },
      ],
    });

    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
    expect(screen.getByText("Mock EventCard: Evento 1")).toBeInTheDocument();
    expect(screen.getByText("Mock EventCard: Evento 2")).toBeInTheDocument();
    expect(mockGetEvents).toHaveBeenCalled();
  });

  test("muestra mensaje y botón cuando no hay eventos", () => {
    useEvents.mockReturnValue({
      getEvents: mockGetEvents,
      events: [],
    });

    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("No hay eventos aún")).toBeInTheDocument();

    const addButton = screen.getByRole("button", { name: "+ Añadir Evento" });
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(mockNavigate).toHaveBeenCalledWith("/add-events");
  });

  test("botón de añadir evento adicional en grid funciona", () => {
    useEvents.mockReturnValue({
      getEvents: mockGetEvents,
      events: [{ _id: "1", title: "Evento 1" }],
    });

    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    );

    const addCards = screen.getAllByText("+ Añadir Evento");
    const gridAddCard = addCards[addCards.length - 1]; // última instancia corresponde a la card de grid
    fireEvent.click(gridAddCard);

    expect(mockNavigate).toHaveBeenCalledWith("/add-events");
  });

  test("botón de instrucciones muestra el manual y permite volver", () => {
    useEvents.mockReturnValue({
      getEvents: mockGetEvents,
      events: [],
    });

    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    );

    const instructionsButton = screen.getByRole("button", { name: "Instrucciones" });
    fireEvent.click(instructionsButton);

    // Verificamos que el manual se muestra
    expect(screen.getByText("Manual de Instrucciones")).toBeInTheDocument();

    const volverButton = screen.getByRole("button", { name: "Volver a la agenda" });
    expect(volverButton).toBeInTheDocument();

    fireEvent.click(volverButton);
    // Verificamos que el manual desaparece
    expect(screen.queryByText("Manual de Instrucciones")).not.toBeInTheDocument();
  });
});