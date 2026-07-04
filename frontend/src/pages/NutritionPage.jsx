import Navbar from "../components/Navbar";
import { useFontSize } from "../context/FontSizeContext";

function NutritionPage() {
  const { fontSize } = useFontSize();

  return (
    <div
      className="flex flex-col min-h-screen text-[#2E3A46] font-sans overflow-x-hidden bg-[#F9F6F1]"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Navbar fija */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col flex-grow px-4 sm:px-6 lg:px-10 py-12 pt-28 max-w-6xl mx-auto">
        {/* Título principal */}
        <div className="text-center mb-10">
          <h1
            className="font-bold text-[#4A90E2] mb-4"
            style={{ fontSize: `${fontSize + 10}px` }}
          >
            Guía de Alimentación del Adulto Mayor
          </h1>
          <p className="font-semibold text-gray-700">
            Consejos prácticos para una alimentación saludable y un estilo de vida activo.
          </p>
        </div>

        {/* Sección 1 - Alimentación saludable */}
        <section className="bg-[#E1E5EA] p-8 rounded-2xl shadow-md mb-10 hover:shadow-lg transition">
          <h2
            className="text-[#4A90E2] font-bold mb-4"
            style={{ fontSize: `${fontSize + 4}px` }}
          >
            Alimentación saludable diaria
          </h2>
          <p className="leading-relaxed mb-4">
            Una alimentación equilibrada incluye el consumo diario de abundantes verduras y frutas, 
            lácteos bajos en grasa, pescados, legumbres, carnes magras, cereales integrales y mucha agua. 
            También se recomienda moderar el uso de sal, azúcar y aceites.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>2 a 3 porciones de <strong>lácteos descremados</strong> (leche, yogurt o quesillo).</li>
            <li>1 porción de <strong>pescado, pollo, huevos o legumbres</strong> para proteínas y minerales.</li>
            <li>3 porciones de <strong>verduras</strong> y 2 porciones de <strong>frutas</strong> al día.</li>
            <li>2 a 3 porciones de <strong>pan integral, cereales y papas cocidas</strong>.</li>
            <li>Incluir pequeñas cantidades de aceite y evitar frituras.</li>
          </ul>
        </section>

        {/* Sección 2 - Recomendaciones sobre bebidas */}
        <section className="bg-[#E1E5EA] p-8 rounded-2xl shadow-md mb-10 hover:shadow-lg transition">
          <h2
            className="text-[#4A90E2] font-bold mb-4"
            style={{ fontSize: `${fontSize + 4}px` }}
          >
            Recomendaciones sobre las bebidas
          </h2>
          <ul className="list-disc pl-6 space-y-2 leading-relaxed">
            <li>
              <strong>Beba 6 a 8 vasos de agua al día</strong>, incluso si no tiene sed. 
              Con la edad, la sensación de sed disminuye, pero el agua sigue siendo esencial.
            </li>
            <li>Evite bebidas azucaradas y reduzca el consumo de té o café, ya que pueden alterar el sueño y causar deshidratación.</li>
            <li>Si consume alcohol, limite su ingesta a una copa de vino tinto por día y evite mezclarlo con medicamentos.</li>
          </ul>
        </section>

        {/* Sección 3 - Consejos para vivir mejor */}
        <section className="bg-[#E1E5EA] p-8 rounded-2xl shadow-md mb-10 hover:shadow-lg transition">
          <h2
            className="text-[#4A90E2] font-bold mb-4"
            style={{ fontSize: `${fontSize + 4}px` }}
          >
            Consejos para vivir más y mejor
          </h2>
          <ul className="list-disc pl-6 space-y-2 leading-relaxed">
            <li>Evite fumar y limite el consumo de alcohol.</li>
            <li>Mantenga un peso corporal adecuado.</li>
            <li>Realice <strong>actividad física regular</strong> (caminar, bailar, nadar o jardinear de 40 a 60 minutos diarios).</li>
            <li>Duerma bien y mantenga horarios regulares de comida.</li>
            <li>Tome suficiente agua durante el día.</li>
          </ul>
        </section>

        {/* Sección 4 - Consejos prácticos de actividad */}
        <section className="bg-[#E1E5EA] p-8 rounded-2xl shadow-md hover:shadow-lg transition mb-10">
          <h2
            className="text-[#4A90E2] font-bold mb-4"
            style={{ fontSize: `${fontSize + 4}px` }}
          >
            Consejos prácticos para ser más activo
          </h2>
          <ul className="list-disc pl-6 space-y-2 leading-relaxed">
            <li>Camine, suba escaleras, arregle el jardín o inscríbase en una clase de baile o deporte.</li>
            <li>Practique entre 40 minutos y 1 hora diaria de actividad moderada.</li>
            <li>Si tiene limitaciones físicas, consulte a un profesional de salud para adaptar los ejercicios.</li>
            <li>Recuerde: cualquier ejercicio es mejor que nada, incluso períodos de 10 a 15 minutos.</li>
          </ul>
        </section>

        {/* Fuente / referencia (sección separada) */}
        <section className="bg-[#E1E5EA] p-6 rounded-xl shadow-md hover:shadow-lg transition text-center mt-8">
          <p className="font-semibold text-gray-700 leading-relaxed">
            <span className="text-[#4A90E2] font-bold">Fuente:</span>  
            {" "}Guía de Alimentación del Adulto Mayor (2021), Instituto de Nutrición y Tecnología de los Alimentos (INTA), Universidad de Chile.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#E1E5EA] w-full text-center py-8 mt-20 rounded-t-xl shadow-inner px-4 sm:px-0">
        <p className="leading-relaxed">
          <span className="text-[#4A90E2] font-semibold">
            Asistente Geri © 2025 - Todos los Derechos Reservados
          </span>
        </p>
      </footer>
    </div>
  );
}

export default NutritionPage;