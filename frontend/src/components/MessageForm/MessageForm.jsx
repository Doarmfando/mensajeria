import { useState } from 'react';
import './MessageForm.css';

function MessageForm({ onAddNumber, onSendTemplate, sending, templates = [] }) {
  const [phone, setPhone] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  function handleAddNumber(e) {
    e.preventDefault();
    const cleaned = phone.trim().replace(/\s+/g, '');
    if (!cleaned) return;
    onAddNumber(cleaned);
    setPhone('');
  }

  function handleSendTemplate() {
    if (!selectedTemplate) return;
    const template = templates.find((t) => t.id === selectedTemplate);
    if (!template) return;
    onSendTemplate(template.id, template.name, template.language || 'es', template.components || []);
  }

  return (
    <div className="message-form">
      <div className="message-form__section">
        <label className="message-form__label">Agregar numero</label>
        <form className="message-form__row" onSubmit={handleAddNumber}>
          <input
            className="message-form__input"
            type="text"
            placeholder="Ej: 51999999999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="message-form__btn message-form__btn--add" type="submit">
            Agregar
          </button>
        </form>
        <span className="message-form__hint">
          Incluir codigo de pais sin + (Ej: 51 para Peru)
        </span>
      </div>

      <div className="message-form__section">
        <label className="message-form__label">Seleccionar template</label>
        <select
          className="message-form__select"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <option value="">-- Selecciona un template --</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.language} - {t.category})
            </option>
          ))}
        </select>

        {selectedTemplate && (
          <div className="message-form__preview">
            <span className="message-form__preview-label">Vista previa:</span>
            {templates.find((t) => t.id === selectedTemplate)?.components?.map((comp, i) => {
              if (comp.type === 'HEADER' && comp.format === 'IMAGE') {
                return <p key={i} className="message-form__preview-image">[Imagen]</p>;
              }
              if (comp.type === 'HEADER') return <p key={i}><strong>{comp.text}</strong></p>;
              if (comp.type === 'BODY') return <p key={i}>{comp.text}</p>;
              if (comp.type === 'FOOTER') return <p key={i} className="message-form__preview-footer">{comp.text}</p>;
              return null;
            })}
          </div>
        )}

        <button
          className="message-form__btn message-form__btn--send"
          onClick={handleSendTemplate}
          disabled={sending || !selectedTemplate}
        >
          {sending ? 'Enviando...' : 'Enviar a todos'}
        </button>
      </div>
    </div>
  );
}

export default MessageForm;
