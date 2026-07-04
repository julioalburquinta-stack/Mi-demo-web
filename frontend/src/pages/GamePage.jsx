import { useEffect, useState } from "react"; 
import { useLocation, useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar"; 
import { useAuth } from "../context/AuthContext"; 
import juego from "../manual/juego.png"; // Imagen del manual

const difficulties = [
  { name: "Muy fácil", rows: 2, cols: 2 },
  { name: "Fácil", rows: 2, cols: 4 },
  { name: "Medio", rows: 4, cols: 4 },
  { name: "Difícil", rows: 6, cols: 4 },
  { name: "Experto", rows: 8, cols: 4 }
];

const allEmojis = [
  "🐶","🐱","🦊","🐼","🐵","🦁","🐸","🐙",
  "🐷","🐰","🦄","🐝","🐞","🦋","🐢","🐍",
  "🐬","🦖","🐝","🐯","🦓","🦒","🦑","🐧",
  "🦩","🐦","🦜","🐴","🐂","🐏","🐪","🦘"
];

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const hasUnsavedChanges = !won && (flipped.length > 0 || solved.length > 0);

  const initializeGame = (newRows = rows, newCols = cols) => {
    const totalCards = newRows * newCols;
    if (totalCards % 2 !== 0) return;
    const pairCount = totalCards / 2;

    const shuffledEmojis = allEmojis
      .sort(() => Math.random() - 0.5)
      .slice(0, pairCount);

    const shuffledCards = [...shuffledEmojis, ...shuffledEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
  };

  useEffect(() => { initializeGame(); }, [rows, cols]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].emoji === cards[secondId].emoji) {
      setSolved((prev) => [...prev, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 800);
    }
  };

  const handleClick = (id) => {
    if (disabled || won || flipped.includes(id) || solved.includes(id)) return;
    if (flipped.length === 0) return setFlipped([id]);
    setFlipped((prev) => [...prev, id]);
    setDisabled(true);
    checkMatch(id);
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) setWon(true);
  }, [solved, cards]);

  const handleDifficultyChange = (level) => {
    if (!won && cards.length > 0 && hasUnsavedChanges) {
      if (!window.confirm("La partida no está completa. ¿Seguro que quieres cambiar la dificultad y perder el progreso?")) return;
    }
    setRows(level.rows);
    setCols(level.cols);
  };

  const handleReset = () => {
    if (!won && cards.length > 0 && hasUnsavedChanges) {
      if (!window.confirm("La partida no está completa. ¿Seguro que quieres reiniciar y perder el progreso?")) return;
    }
    initializeGame();
  };

  const handleLogout = () => {
    if (!won && cards.length > 0 && hasUnsavedChanges) {
      const confirmed = window.confirm(
        "La partida no está completa. Si cierras sesión, perderás el progreso. ¿Deseas continuar?"
      );
      if (!confirmed) return;
    }
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!won && hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [won, hasUnsavedChanges]);

   if (showManual) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F6F1] text-[#2E3A46] font-sans">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar hasUnsavedChanges={hasUnsavedChanges} onLogout={handleLogout} />
      </div>

      <div className="flex flex-col items-center justify-start flex-grow px-6 pt-28 pb-10 overflow-y-auto">
        <h2 className="font-semibold mb-8 text-2xl text-[#2E3A46]">
          Manual de Instrucciones
        </h2>

        <div className="text-left space-y-4 max-w-4xl">
          <p><strong>Paso 1:</strong> Se elige la dificultad desde <strong>"Muy fácil"</strong> a <strong>"Experto"</strong>.</p>
          <p><strong>Paso 2:</strong> Se hace clic en 2 tarjetas con el signo <strong>"?"</strong> para voltearlas. Si los pares son diferentes, volverán al signo <strong>"?"</strong> hasta encontrar uno que coincida.</p>
          <p><strong>Paso 3:</strong> Si el par de cartas volteadas tienen el mismo emoji, las cartas cambian de color de <strong>azul a verde</strong>.</p>
          <p><strong>Paso 4:</strong> Al encontrar todos los pares de emojis, el nivel se completa.</p>
          <p><em>Si se reinicia el nivel, cambia de dificultad o intenta cerrar la página, se mostrará una confirmación con "Aceptar".</em></p>
        </div>

        <img
          src={juego}
          alt="Manual del juego de memoria"
          className="rounded-md shadow-md mx-auto my-10 w-full max-w-5xl"
        />

        <button
          onClick={() => setShowManual(false)}
          className="bg-[#4A90E2] hover:bg-[#357ABD] transform hover:scale-105 transition duration-300 text-white font-semibold px-8 py-3 rounded-md shadow-md"
        >
          Volver a la partida
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F6F1] text-[#2E3A46] font-sans">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar hasUnsavedChanges={hasUnsavedChanges} onLogout={handleLogout} />
      </div>

      <div className="flex-grow p-4 pt-28">
        <h1 className="text-3xl font-bold mb-4 text-center">Juego de Memoria</h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowManual(true)}
            className="bg-[#4A90E2] hover:bg-[#357ABD] transform hover:scale-105 transition duration-300 text-white font-semibold px-8 py-4 rounded-md shadow-md"
          >
            Instrucciones
          </button>
        </div>

        {/* Botones de dificultad */}
        <div className="mb-6 flex gap-4 flex-wrap justify-center">
          {difficulties.map((level) => (
            <button
              key={level.name}
              onClick={() => handleDifficultyChange(level)}
              className={`px-4 py-2 rounded-2xl font-semibold shadow-md transition-transform transform hover:scale-105 ${
                rows === level.rows && cols === level.cols
                  ? "bg-[#4A90E2] text-white"
                  : "bg-[#E1E5EA] text-[#2E3A46]"
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>

        {/* Tablero */}
        <div
          className="grid gap-2 mb-4 justify-center"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
            width: `min(100%, ${cols * 6}rem)`,
            margin: "0 auto"
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className={`aspect-square flex items-center justify-center text-5xl font-bold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-[#88C273] text-white"
                    : "bg-[#4A90E2] text-white"
                  : "bg-[#E1E5EA] text-gray-500"
              }`}
            >
              {isFlipped(card.id) ? card.emoji : "?"}
            </div>
          ))}
        </div>

        {won && (
          <div className="mt-4 text-2xl font-bold text-[#88C273] text-center flex justify-center items-center gap-2">
            {rows === 8 && cols === 4 && <span className="animate-bounce">🎉🎊</span>}
            ¡Has ganado la partida!
            {rows === 8 && cols === 4 && <span className="animate-bounce">🎊🎉</span>}
          </div>
        )}

        <div className="flex justify-center mt-4">
          <button
            onClick={handleReset}
            className="px-5 py-2 bg-[#4A90E2] text-white rounded-2xl font-semibold hover:bg-[#357ABD] transition-colors shadow-md"
          >
            {won ? "Jugar de nuevo" : "Reiniciar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePage;