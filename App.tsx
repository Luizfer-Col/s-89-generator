import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toBlob } from 'html-to-image';
import { Share2, Download, Loader2, Copy, Trash2, Users } from 'lucide-react';
import { AssignmentSlip } from './components/AssignmentSlip';
import { NameManagerModal } from './components/NameManagerModal';
import { AssignmentData, RoomType } from './types';

const INITIAL_DATA: AssignmentData = {
  name: '',
  assistant: '',
  date: '',
  assignmentNumber: '',
  room: null,
};

const PREDEFINED_NAMES = [
  "Abigail Ortiz",
  "Adiela Quintero",
  "Alexandra Linares",
  "Alicia Pasos",
  "Alina Escorcia",
  "Alvaro Zapata",
  "Alveiro Perez",
  "Ana Calle",
  "Andres Cañas",
  "Angela Patiño",
  "Angela Sepulveda",
  "Arcangel Pasos",
  "Aurora Querubin",
  "Bernardo Lopez",
  "Bernardo Marin",
  "Bertilda Atencio",
  "Carmen Leon",
  "Claudia Perez",
  "Claudio Coronado",
  "Cristina Colorado",
  "Cristina Mesa",
  "Daimer Cogollo",
  "Danisa Del Mar Coronado",
  "David Leon",
  "Diana Zapata",
  "Dianicell Pacheco",
  "Diego Londoño",
  "Diocelina Suarez",
  "Edwin Rodriguez",
  "Elkin Restrepo",
  "Emilse Lesme",
  "Emmanuel Arango",
  "Estefania Arango",
  "Flor Mesa",
  "Ingrid Rodriguez",
  "Irma Arango",
  "Jair Mesa",
  "Jean Pierre Cardona",
  "Jimena Pino",
  "Jiralit Andrea Cardona",
  "Josias Cardenas",
  "Juan Camilo Pino",
  "Juan Carlos Villa",
  "Juan Jose Gallego",
  "Julian Bustamante",
  "Liliana Mapari",
  "Liliana Rua",
  "Lina Cogollo",
  "Lucelly Correa",
  "Luis Colorado",
  "Luis Pacheco",
  "Luz Danelcy Trujillo",
  "Marcos Aleman",
  "Maria Jose Londoño",
  "Maria Ortiz",
  "Maricela Villa",
  "Marina Espinosa",
  "Nemesio Ortiz",
  "Paola Mejia",
  "Paula Bustamante",
  "Reina Mesa",
  "Robinson Plaza",
  "Roxana Aleman",
  "Samanta Gomez",
  "Samuel Gomez",
  "Santiago Rangel",
  "Senovia Villa",
  "Shaila Rangel",
  "Yahaira Lemos",
  "Yajaidis Martinez",
  "Yolima Cañas",
  "Yolimar Fuenmayor",
  "Yorlady Cardenas",
  "Yuban Arango",
  "Yuri Plaza"
];

export default function App() {
  // Initialize form data from localStorage to persist work
  const [data, setData] = useState<AssignmentData>(() => {
    try {
      const savedData = localStorage.getItem('s89_form_data');
      return savedData ? JSON.parse(savedData) : INITIAL_DATA;
    } catch (e) {
      console.error("Error reading form data from localStorage", e);
      return INITIAL_DATA;
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isNameManagerOpen, setIsNameManagerOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const slipRef = useRef<HTMLDivElement>(null);

  // Initialize names from localStorage or use default list
  const [names, setNames] = useState<string[]>(() => {
    try {
      const savedNames = localStorage.getItem('s89_names_v1');
      return savedNames ? JSON.parse(savedNames) : PREDEFINED_NAMES;
    } catch (e) {
      console.error("Error reading names from localStorage", e);
      return PREDEFINED_NAMES;
    }
  });

  // Calculate scale on resize to fit mobile screens perfectly
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      // 420px is the hard width of the form. 
      // We add a little padding (20px total) to the calculation so it doesn't touch edges.
      const contentWidth = 420; 
      const padding = 20;
      
      if (windowWidth < (contentWidth + padding)) {
        const newScale = (windowWidth - padding) / contentWidth;
        setScale(newScale);
      } else {
        setScale(1);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save names to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('s89_names_v1', JSON.stringify(names));
    } catch (e) {
      console.error("Error saving names to localStorage", e);
    }
  }, [names]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('s89_form_data', JSON.stringify(data));
    } catch (e) {
      console.error("Error saving form data to localStorage", e);
    }
  }, [data]);

  const handleResetNames = () => {
    setNames(PREDEFINED_NAMES);
  };

  const handleDataChange = useCallback((field: keyof AssignmentData, value: string | RoomType) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todos los campos del formulario?')) {
      setData(INITIAL_DATA);
    }
  };

  const generateImageBlob = async () => {
    if (!slipRef.current) return null;

    // Use html-to-image with high pixel ratio for print quality
    return await toBlob(slipRef.current, {
      quality: 0.95,
      pixelRatio: 3, // Requirements: High quality
      backgroundColor: '#ffffff',
      // Fix for some font rendering issues in html-to-image
      style: {
        fontFamily: 'Arial, Helvetica, sans-serif'
      },
      // Filter out elements with the class 'print-hidden'
      filter: (node) => {
        if (node.classList && node.classList.contains('print-hidden')) {
          return false;
        }
        return true;
      }
    });
  };

  const handleDownload = async () => {
    if (!slipRef.current) return;
    setIsGenerating(true);

    try {
      const blob = await generateImageBlob();
      if (!blob) throw new Error('No se pudo generar la imagen');

      // Create a dynamic filename
      const filename = `asignacion-${data.name ? data.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 's-89'}.png`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('Hubo un error al generar la imagen para descargar.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!slipRef.current) return;
    setIsGenerating(true);

    try {
      const blob = await generateImageBlob();
      if (!blob) throw new Error('No se pudo generar la imagen');

      // Clipboard API writes require a Blob with correct type
      const clipboardItem = new ClipboardItem({
        [blob.type]: blob
      });

      await navigator.clipboard.write([clipboardItem]);
      alert('¡Imagen copiada al portapapeles!');
    } catch (error) {
      console.error('Error al copiar:', error);
      alert('No se pudo copiar la imagen automáticamente. Intente usar el botón de compartir.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!slipRef.current) return;
    setIsGenerating(true);

    try {
      const blob = await generateImageBlob();
      if (!blob) throw new Error('No se pudo generar la imagen');

      const filename = `asignacion-${data.name ? data.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 's-89'}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      // Check if Web Share API is supported and can share files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Asignación Vida y Ministerio',
          text: `Asignación para ${data.name || 'el estudiante'}.`,
        });
      } else {
        // Fallback: Download the image if share is not supported
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        alert('La función de compartir no es compatible con este navegador. La imagen se ha descargado.');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      alert('Hubo un error al generar o compartir la imagen.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Top Bar */}
      <div className="w-full bg-blue-700 text-white p-3 shadow-md mb-6 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-lg font-bold pl-1 leading-tight sm:text-xl">Generador S-89</h1>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsNameManagerOpen(true)}
            className="p-2 hover:bg-blue-600 rounded-full transition-colors flex items-center justify-center"
            title="Administrar Nombres"
          >
            <Users size={20} />
          </button>
          
          <button 
            onClick={handleReset}
            className="p-2 hover:bg-blue-600 rounded-full transition-colors flex items-center justify-center"
            title="Limpiar formulario"
          >
            <Trash2 size={20} />
          </button>

          <div className="h-6 w-px bg-blue-500 mx-1"></div>

          <button 
            onClick={handleCopy}
            disabled={isGenerating}
            className="p-2 hover:bg-blue-600 rounded-full transition-colors flex items-center justify-center"
            title="Copiar imagen"
          >
             {isGenerating ? <Loader2 size={20} className="animate-spin"/> : <Copy size={20} />}
          </button>

          <button 
            onClick={handleDownload}
            disabled={isGenerating}
            className="p-2 hover:bg-blue-600 rounded-full transition-colors flex items-center justify-center"
            title="Descargar imagen"
          >
             {isGenerating ? <Loader2 size={20} className="animate-spin"/> : <Download size={20} />}
          </button>

          <button 
            onClick={handleShare}
            disabled={isGenerating}
            className="ml-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-full transition-colors flex items-center gap-1.5 shadow-sm text-white font-medium"
            title="Compartir"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin"/> : <Share2 size={18} />}
            <span className="hidden sm:inline">Compartir</span>
          </button>
        </div>
      </div>

      <div className="w-full flex justify-center px-2 overflow-hidden pb-10">
        {/* The container that gets scaled. It wraps a FIXED width child. */}
        <div 
          className="origin-top transition-transform duration-200 ease-out will-change-transform inline-block"
          style={{ 
            transform: `scale(${scale})`,
            // Set margin bottom to compensate for scale shrinking the visual height but not layout height completely
            // 560 is the minimum height of the slip
            marginBottom: scale < 1 ? `-${(560 * (1 - scale))}px` : '0px'
          }}
        >
           {/* The Form Component */}
          <AssignmentSlip 
            ref={slipRef}
            data={data}
            onChange={handleDataChange}
            availableNames={names}
          />
        </div>
      </div>

      {/* Name Manager Modal */}
      <NameManagerModal 
        isOpen={isNameManagerOpen}
        onClose={() => setIsNameManagerOpen(false)}
        names={names}
        setNames={setNames}
        onResetDefaults={handleResetNames}
      />
    </div>
  );
}