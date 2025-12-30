import React, { useState, useMemo } from 'react';
import { X, Plus, Trash2, Edit2, Save, RotateCcw, Search } from 'lucide-react';

interface NameManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  names: string[];
  setNames: (names: string[]) => void;
  onResetDefaults: () => void;
}

export const NameManagerModal: React.FC<NameManagerModalProps> = ({
  isOpen,
  onClose,
  names,
  setNames,
  onResetDefaults
}) => {
  const [newName, setNewName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // Normalize string for search (removes accents and case)
  const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Filter names based on search term
  const filteredNames = useMemo(() => {
    if (!searchTerm) return names.map((name, index) => ({ name, originalIndex: index }));
    
    const searchLower = normalizeText(searchTerm);
    return names
      .map((name, index) => ({ name, originalIndex: index }))
      .filter(item => normalizeText(item.name).includes(searchLower));
  }, [names, searchTerm]);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      const updatedNames = [...names, newName.trim()].sort((a, b) => a.localeCompare(b));
      setNames(updatedNames);
      setNewName('');
      setSearchTerm(''); // Clear search to show the new added name context
    }
  };

  const handleDelete = (originalIndex: number) => {
    if (window.confirm('¿Eliminar este nombre de la lista?')) {
      const updatedNames = names.filter((_, i) => i !== originalIndex);
      setNames(updatedNames);
    }
  };

  const startEdit = (originalIndex: number, currentName: string) => {
    setEditingIndex(originalIndex);
    setEditValue(currentName);
  };

  const saveEdit = (originalIndex: number) => {
    if (editValue.trim()) {
      const updatedNames = [...names];
      updatedNames[originalIndex] = editValue.trim();
      updatedNames.sort((a, b) => a.localeCompare(b));
      setNames(updatedNames);
      setEditingIndex(null);
      setSearchTerm(''); // Clear search to maintain consistent view
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Administrar Nombres</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Add New Section */}
        <div className="p-4 bg-blue-50 border-b border-gray-200">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Añadir nuevo nombre..."
              className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Añadir a la lista"
            >
              <Plus size={20} />
            </button>
          </form>
        </div>

        {/* Search Bar */}
        <div className="px-4 pt-3 pb-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar nombre para editar..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {names.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm">No hay nombres registrados.</p>
          ) : filteredNames.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm">No se encontraron nombres.</p>
          ) : (
            <ul className="space-y-1">
              {filteredNames.map(({ name, originalIndex }) => (
                <li key={`${name}-${originalIndex}`} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md group border-b border-gray-100 last:border-0">
                  {editingIndex === originalIndex ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(originalIndex)} className="text-green-600 hover:text-green-800 p-1">
                        <Save size={18} />
                      </button>
                      <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 p-1">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-700 text-sm font-medium">{name}</span>
                      <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEdit(originalIndex, name)}
                          className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(originalIndex)}
                          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-between items-center">
          <button
            onClick={() => {
              if(window.confirm('¿Restablecer la lista original de nombres? Esto borrará sus cambios.')) {
                onResetDefaults();
                setSearchTerm('');
              }
            }}
            className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 px-2 py-1"
          >
            <RotateCcw size={12} /> Restablecer predeterminados
          </button>
          <span className="text-xs text-gray-400">Total: {names.length}</span>
        </div>
      </div>
    </div>
  );
};