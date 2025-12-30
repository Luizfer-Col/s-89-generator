import React, { forwardRef, useMemo, useState, useRef, useEffect } from 'react';
import { AssignmentData, RoomType } from '../types';
import { Check, ChevronDown, X } from 'lucide-react';

interface AssignmentSlipProps {
  data: AssignmentData;
  onChange: (field: keyof AssignmentData, value: string | RoomType) => void;
  availableNames?: string[];
}

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  inputClass: string;
}

const Combobox: React.FC<ComboboxProps> = ({ value, onChange, options, inputClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the dropdown if it was closed, or other side effects
    onChange('');
    setIsOpen(true); // Open the full list when cleared to allow easy selection
  };

  // Filter options based on input value
  const filteredOptions = useMemo(() => {
    if (!value || value.trim() === '') {
      return options;
    }
    const lowerValue = value.toLowerCase();
    return options.filter(option => 
      option.toLowerCase().includes(lowerValue)
    );
  }, [options, value]);

  const showClear = value && value.length > 0;

  return (
    <div ref={containerRef} className="absolute inset-x-0 bottom-0 top-0">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true); // Open dropdown when typing
        }}
        // Add right padding: pr-6 for chevron only, pr-12 if clear button is also visible
        className={`${inputClass} ${showClear ? 'pr-12' : 'pr-6'}`} 
        autoComplete="off"
        // Prevent auto-opening on click/focus to keep UI clean, unless user types or clicks chevron
        onFocus={() => {}} 
      />
      
      {/* Clear Button - Hidden in print - Visible only if there is value */}
      {showClear && (
        <button
          type="button"
          tabIndex={-1}
          onClick={handleClear}
          className="print-hidden absolute right-[26px] bottom-[2px] h-[22px] w-[22px] flex items-center justify-center text-gray-400 hover:text-red-500 focus:outline-none cursor-pointer z-20"
          title="Borrar"
        >
          <X size={16} />
        </button>
      )}

      {/* Toggle Button - Hidden in print */}
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setIsOpen(!isOpen)}
        className="print-hidden absolute right-0 bottom-[2px] h-[22px] w-[22px] flex items-center justify-center text-gray-400 hover:text-black focus:outline-none cursor-pointer z-10"
      >
        <ChevronDown size={16} />
      </button>

      {/* Dropdown List - Hidden in print */}
      {isOpen && (
        <ul className="print-hidden absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 shadow-xl max-h-48 overflow-y-auto z-50 text-[16px]">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 border-b border-gray-100 last:border-0 leading-tight"
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent blur
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </li>
            ))
          ) : (
             <li className="px-3 py-2 text-gray-400 italic text-sm">No se encontraron coincidencias</li>
          )}
        </ul>
      )}
    </div>
  );
};

export const AssignmentSlip = forwardRef<HTMLDivElement, AssignmentSlipProps>(
  ({ data, onChange, availableNames = [] }, ref) => {
    // Generate dates for the next 12 Mondays starting from the current week
    const availableDates = useMemo(() => {
      const dates: string[] = [];
      const today = new Date();
      const day = today.getDay(); // 0 (Sun) to 6 (Sat)
      
      // Calculate Monday of the current week
      // formula: current_date - (day === 0 ? 6 : day - 1)
      const diff = today.getDate() - (day === 0 ? 6 : day - 1);
      
      const currentMonday = new Date(today.setDate(diff));

      for (let i = 0; i < 12; i++) {
        const d = new Date(currentMonday);
        d.setDate(currentMonday.getDate() + (i * 7));
        // Format: "29 de diciembre de 2025"
        dates.push(d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }));
      }
      return dates;
    }, []);

    const assignmentNumbers = ['3', '4', '5', '6', '7', '8'];

    // Estilos ajustados
    const rowClass = "flex items-end w-full";
    // Increased from text-[19px] to text-[22px] for better visibility on mobile
    const labelClass = "font-bold text-[22px] mr-2 text-black shrink-0 pb-[3px] leading-none";
    const inputContainerClass = "flex-grow border-b-[2px] border-dotted border-black relative z-10"; // z-10 for stacking context
    // inputClass needs to be passed to Combobox
    const inputClass = "w-full bg-transparent border-none outline-none text-[19px] font-normal text-gray-900 absolute bottom-[2px] px-1 font-s89 leading-none";

    return (
      <div className="w-full flex justify-center pt-2 pb-6 px-2">
        <div
          ref={ref}
          // CRITICAL CHANGE: Fixed width w-[420px] and shrink-0 to prevent layout shift on mobile.
          // The scaling is handled by the parent in App.tsx
          className="font-s89 bg-white text-black w-[420px] shrink-0 min-h-[560px] border border-gray-300 shadow-lg p-6 flex flex-col box-border relative"
          style={{ backgroundColor: '#ffffff' }}
        >
          {/* Encabezado */}
          <header className="mb-5 text-center">
            <h1 className="text-[21px] leading-6 font-bold tracking-wide uppercase text-black">
              Asignación para la reunión
              <br />
              Vida y Ministerio Cristianos
            </h1>
          </header>

          {/* Campos del Formulario */}
          <div className="flex flex-col gap-4">
            
            {/* Nombre */}
            <div className={rowClass}>
              <label className={labelClass}>
                Nombre:
              </label>
              <div className={inputContainerClass} style={{ height: '22px', zIndex: 40 }}>
                 <Combobox 
                   value={data.name} 
                   onChange={(val) => onChange('name', val)}
                   options={availableNames}
                   inputClass={inputClass}
                 />
              </div>
            </div>

            {/* Ayudante */}
            <div className={rowClass}>
              <label className={labelClass}>
                Ayudante:
              </label>
              <div className={inputContainerClass} style={{ height: '22px', zIndex: 30 }}>
                <Combobox 
                   value={data.assistant} 
                   onChange={(val) => onChange('assistant', val)}
                   options={availableNames}
                   inputClass={inputClass}
                 />
              </div>
            </div>

            {/* Fecha */}
            <div className={rowClass}>
              <label className={labelClass}>
                Fecha:
              </label>
              <div className={inputContainerClass} style={{ height: '22px', zIndex: 20 }}>
                <Combobox 
                   value={data.date} 
                   onChange={(val) => onChange('date', val)}
                   options={availableDates}
                   inputClass={inputClass}
                 />
              </div>
            </div>

            {/* Intervención núm */}
            <div className={rowClass}>
              <label className={labelClass}>
                Intervención núm.:
              </label>
              <div className={inputContainerClass} style={{ height: '22px', zIndex: 10 }}>
                <Combobox 
                   value={data.assignmentNumber} 
                   onChange={(val) => onChange('assignmentNumber', val)}
                   options={assignmentNumbers}
                   inputClass={inputClass}
                 />
              </div>
            </div>

            {/* Sección de Salas */}
            <div className="mt-6 pl-0.5">
              {/* Increased from text-[19px] to text-[20px] */}
              <p className="font-bold text-[20px] mb-2 text-black leading-none">Se presentará en:</p>
              
              <div className="flex flex-col gap-2 pl-6">
                {/* Sala Principal */}
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => onChange('room', RoomType.MAIN)}
                >
                  <div className={`w-[15px] h-[15px] border-[1.5px] border-black flex items-center justify-center rounded-none bg-white shrink-0`}>
                    {data.room === RoomType.MAIN && <Check size={12} strokeWidth={3} className="text-black" />}
                  </div>
                  <span className="text-[19px] text-black pt-0.5 leading-none tracking-tight">Sala principal</span>
                </div>

                {/* Aux 1 */}
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => onChange('room', RoomType.AUX_1)}
                >
                  <div className={`w-[15px] h-[15px] border-[1.5px] border-black flex items-center justify-center rounded-none bg-white shrink-0`}>
                    {data.room === RoomType.AUX_1 && <Check size={12} strokeWidth={3} className="text-black" />}
                  </div>
                  <span className="text-[19px] text-black pt-0.5 leading-none tracking-tight">Sala auxiliar núm. 1</span>
                </div>

                 {/* Aux 2 */}
                 <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => onChange('room', RoomType.AUX_2)}
                >
                  <div className={`w-[15px] h-[15px] border-[1.5px] border-black flex items-center justify-center rounded-none bg-white shrink-0`}>
                    {data.room === RoomType.AUX_2 && <Check size={12} strokeWidth={3} className="text-black" />}
                  </div>
                  <span className="text-[19px] text-black pt-0.5 leading-none tracking-tight">Sala auxiliar núm. 2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Espaciador flexible */}
          <div className="flex-grow min-h-[10px]"></div>

          {/* Pie de página */}
          <div className="mt-5 pt-1">
            <p className="text-[16px] leading-[1.3] text-black text-justify">
              <span className="font-bold">Nota al estudiante: </span>
              En la <span className="italic">Guía de actividades</span> encontrará la información que necesita para su intervención. Repase también las indicaciones que se describen en las <span className="italic">Instrucciones para la reunión Vida y Ministerio Cristianos</span> (S-38).
            </p>
            <p className="mt-4 text-[13px] text-black font-medium">S-89-S 11/23</p>
          </div>
        </div>
      </div>
    );
  }
);

AssignmentSlip.displayName = 'AssignmentSlip';