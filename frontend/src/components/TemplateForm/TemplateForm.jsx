import { useState, useRef } from 'react';
import './TemplateForm.css';

const CATEGORIES = [
  { value: 'MARKETING', label: 'Marketing - Promociones, ofertas' },
  { value: 'UTILITY', label: 'Utilidad - Avisos, recordatorios' },
];

const HEADER_TYPES = [
  { value: 'NONE', label: 'Sin encabezado' },
  { value: 'TEXT', label: 'Texto' },
  { value: 'IMAGE', label: 'Imagen' },
];

function TemplateForm({ onSubmit, loading }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('MARKETING');
  const [headerType, setHeaderType] = useState('NONE');
  const [headerContent, setHeaderContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bodyText, setBodyText] = useState('');
  const [footerText, setFooterText] = useState('');
  const fileInputRef = useRef(null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !bodyText.trim()) return;

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('category', category);
    formData.append('language', 'es');
    formData.append('bodyText', bodyText.trim());

    if (footerText.trim()) {
      formData.append('footerText', footerText.trim());
    }

    if (headerType === 'TEXT' && headerContent.trim()) {
      formData.append('headerType', 'TEXT');
      formData.append('headerContent', headerContent.trim());
    }

    if (headerType === 'IMAGE' && imageFile) {
      formData.append('headerType', 'IMAGE');
      formData.append('image', imageFile);
    }

    onSubmit(formData);

    setName('');
    setHeaderType('NONE');
    setHeaderContent('');
    setImageFile(null);
    setImagePreview(null);
    setBodyText('');
    setFooterText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <form className="template-form" onSubmit={handleSubmit}>
      <h3 className="template-form__title">Crear nuevo template</h3>

      <div className="template-form__field">
        <label className="template-form__label">Nombre del template</label>
        <input
          className="template-form__input"
          type="text"
          placeholder="Ej: promocion_verano"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className="template-form__hint">Solo letras minusculas, numeros y guion bajo</span>
      </div>

      <div className="template-form__field">
        <label className="template-form__label">Categoria</label>
        <select
          className="template-form__select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div className="template-form__field">
        <label className="template-form__label">Tipo de encabezado</label>
        <select
          className="template-form__select"
          value={headerType}
          onChange={(e) => { setHeaderType(e.target.value); setHeaderContent(''); handleRemoveImage(); }}
        >
          {HEADER_TYPES.map((ht) => (
            <option key={ht.value} value={ht.value}>{ht.label}</option>
          ))}
        </select>
      </div>

      {headerType === 'TEXT' && (
        <div className="template-form__field">
          <label className="template-form__label">Texto del encabezado</label>
          <input
            className="template-form__input"
            type="text"
            placeholder="Ej: Promocion especial"
            value={headerContent}
            onChange={(e) => setHeaderContent(e.target.value)}
          />
        </div>
      )}

      {headerType === 'IMAGE' && (
        <div className="template-form__field">
          <label className="template-form__label">Seleccionar imagen</label>
          <input
            className="template-form__file"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          <span className="template-form__hint">Solo JPG o PNG, maximo 5MB</span>
          {imagePreview && (
            <div className="template-form__image-preview">
              <img src={imagePreview} alt="Preview" className="template-form__image-thumb" />
              <button type="button" className="template-form__image-remove" onClick={handleRemoveImage}>
                Quitar imagen
              </button>
            </div>
          )}
        </div>
      )}

      <div className="template-form__field">
        <label className="template-form__label">Mensaje (cuerpo)</label>
        <textarea
          className="template-form__textarea"
          placeholder="Escribe el contenido del template..."
          rows={4}
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
        />
      </div>

      <div className="template-form__field">
        <label className="template-form__label">Pie de mensaje (opcional)</label>
        <input
          className="template-form__input"
          type="text"
          placeholder="Ej: No responder a este mensaje"
          value={footerText}
          onChange={(e) => setFooterText(e.target.value)}
        />
      </div>

      <button
        className="template-form__btn"
        type="submit"
        disabled={loading || !name.trim() || !bodyText.trim()}
      >
        {loading ? 'Creando...' : 'Crear template'}
      </button>
    </form>
  );
}

export default TemplateForm;
