import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import VideosPage from "../pages/VideosPage";
import { useVideos } from "../context/VideosContext";
import { useFontSize } from "../context/FontSizeContext";

// ------------------ MOCKS ------------------
vi.mock("../components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>
}));

vi.mock("../components/VideoCard", () => ({
  default: ({ video }) => <div>{video.title}</div>
}));

vi.mock("../context/VideosContext", () => ({
  useVideos: vi.fn()
}));

vi.mock("../context/FontSizeContext", () => ({
  useFontSize: vi.fn()
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// ------------------ TESTS ------------------
describe("VideosPage", () => {
  const mockGetVideos = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useFontSize.mockReturnValue({ fontSize: 16 });
  });

  test("renderiza Navbar y lista de videos", () => {
    useVideos.mockReturnValue({
      getVideos: mockGetVideos,
      videos: [
        { _id: "1", title: "Video 1" },
        { _id: "2", title: "Video 2" }
      ],
      isAdmin: true
    });

    render(
      <MemoryRouter>
        <VideosPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
    expect(screen.getByText("Video 1")).toBeInTheDocument();
    expect(screen.getByText("Video 2")).toBeInTheDocument();
    expect(mockGetVideos).toHaveBeenCalled();
  });

  test("muestra mensaje y botón cuando no hay videos", () => {
    useVideos.mockReturnValue({
      getVideos: mockGetVideos,
      videos: [],
      isAdmin: true
    });

    render(
      <MemoryRouter>
        <VideosPage />
      </MemoryRouter>
    );

    expect(screen.getByText("No hay resultados")).toBeInTheDocument();

    // Obtenemos el botón correcto cuando no hay videos
    const addButton = screen.getByRole("button", { name: "+ Añadir Video" });
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(mockNavigate).toHaveBeenCalledWith("/add-videos");
  });

  test("botón de añadir video adicional funciona en grid", () => {
    useVideos.mockReturnValue({
      getVideos: mockGetVideos,
      videos: [{ _id: "1", title: "Video 1" }],
      isAdmin: true
    });

    render(
      <MemoryRouter>
        <VideosPage />
      </MemoryRouter>
    );

    // Obtenemos todas las instancias y seleccionamos la que está dentro de la grid
    const addCards = screen.getAllByText("+ Añadir Video");
    const gridAddCard = addCards[addCards.length - 1]; // Última instancia
    fireEvent.click(gridAddCard);

    expect(mockNavigate).toHaveBeenCalledWith("/add-videos");
  });

  test("no muestra botón de añadir video si no es admin", () => {
    useVideos.mockReturnValue({
      getVideos: mockGetVideos,
      videos: [{ _id: "1", title: "Video 1" }],
      isAdmin: false
    });

    render(
      <MemoryRouter>
        <VideosPage />
      </MemoryRouter>
    );

    expect(screen.queryByText("+ Añadir Video")).not.toBeInTheDocument();
  });
});