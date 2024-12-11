import { useState, useEffect } from 'react';
import { Service } from '../types';
import { Clock, Palette } from 'lucide-react';

interface ServiceFormProps {
  onSubmit: (service: Omit<Service, 'id'>) => void;
  onCancel?: () => void;
  initialData?: Service | null;
}

const PREDEFINED_COLORS = [
  // Pastels
  '#fecaca', // pastel red
  '#fed7aa', // pastel orange
  '#fef08a', // pastel yellow
  '#bbf7d0', // pastel green
  '#bfdbfe', // pastel blue
  '#ddd6fe', // pastel purple
  '#fbcfe8', // pastel pink
  '#e5e7eb', // pastel gray

  // Soft pastels
  '#ffcdd2', // soft pink
  '#f8bbd0', // soft rose
  '#e1bee7', // soft purple
  '#d1c4e9', // soft violet
  '#c5cae9', // soft indigo
  '#bbdefb', // soft blue
  '#b3e5fc', // soft light blue
  '#b2ebf2', // soft cyan

  // Vibrant colors
  '#ef4444', // red
  '#f97316', // orange
  '#facc15', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan

  // Grayscale
  '#000000', // black
  '#374151', // dark gray
  '#6b7280', // medium gray
  '#9ca3af', // gray
  '#d1d5db', // light gray
  '#f3f4f6', // very light gray
  '#ffffff', // white
];

export default function ServiceForm({ onSubmit, onCancel, initialData }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    duration: 30,
    color: PREDEFINED_COLORS[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        duration: initialData.duration,
        color: initialData.color,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', duration: 30, color: PREDEFINED_COLORS[0] });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Nazwa usługi
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input"
          placeholder="Wprowadź nazwę usługi"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Czas trwania (minuty)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              required
              min="5"
              step="5"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="input pl-9"
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Kolor
        </label>
        <div className="p-3 border rounded-lg">
          <div className="space-y-3">
            {/* Pastels */}
            <div>
              <div className="text-xs text-gray-500 mb-1.5">Pastele</div>
              <div className="grid grid-cols-8 gap-1.5">
                {PREDEFINED_COLORS.slice(0, 16).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-6 h-6 rounded-full transition-all ${
                      formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Vibrant colors */}
            <div>
              <div className="text-xs text-gray-500 mb-1.5">Intensywne kolory</div>
              <div className="grid grid-cols-8 gap-1.5">
                {PREDEFINED_COLORS.slice(16, 24).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-6 h-6 rounded-full transition-all ${
                      formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Grayscale */}
            <div>
              <div className="text-xs text-gray-500 mb-1.5">Odcienie szarości</div>
              <div className="grid grid-cols-8 gap-1.5">
                {PREDEFINED_COLORS.slice(24).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-6 h-6 rounded-full transition-all ${
                      formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Custom color picker */}
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-500 mb-1.5">Własny kolor</div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="sr-only"
                    id="colorPicker"
                  />
                  <label
                    htmlFor="colorPicker"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <Palette size={16} className="text-gray-500" />
                    <span className="text-gray-600">Wybierz kolor</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: formData.color }}
                  />
                  <div className="text-sm text-gray-500 uppercase">
                    {formData.color}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Anuluj
          </button>
        )}
        <button type="submit" className="btn-primary">
          {initialData ? 'Zapisz zmiany' : 'Dodaj usługę'}
        </button>
      </div>
    </form>
  );
}
