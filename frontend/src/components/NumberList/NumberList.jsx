import './NumberList.css';

const STATUS_LABELS = {
  accepted: 'Enviado',
  sent: 'Enviado',
  delivered: 'Entregado',
  read: 'Leido',
  failed: 'Fallido',
};

const STATUS_CLASSES = {
  accepted: 'status--sent',
  sent: 'status--sent',
  delivered: 'status--delivered',
  read: 'status--read',
  failed: 'status--failed',
};

function NumberList({ contacts = [], onRemove, onClear, onSendToOne, selectedTemplate, sending }) {
  if (contacts.length === 0) {
    return (
      <div className="number-list number-list--empty">
        <p className="number-list__empty-text">No hay numeros agregados</p>
      </div>
    );
  }

  function handleSendOne(phone) {
    if (!selectedTemplate) return;
    onSendToOne(
      phone,
      selectedTemplate.id,
      selectedTemplate.name,
      selectedTemplate.language || 'es',
      selectedTemplate.components || []
    );
  }

  const pendingCount = contacts.filter((c) => !c.last_status).length;
  const sentCount = contacts.filter((c) => c.last_status).length;

  return (
    <div className="number-list">
      <div className="number-list__header">
        <span className="number-list__count">
          {contacts.length} numero(s)
          {sentCount > 0 && <span className="number-list__summary"> — {sentCount} enviados, {pendingCount} pendientes</span>}
        </span>
        <button className="number-list__clear" onClick={onClear}>
          Limpiar todo
        </button>
      </div>
      <ul className="number-list__items">
        {contacts.map((contact, index) => (
          <li key={index} className="number-list__item">
            <span className="number-list__number">
              {contact.phone_number.startsWith('51') ? contact.phone_number.slice(2) : contact.phone_number}
            </span>
            {contact.last_status ? (
              <span className={`number-list__status ${STATUS_CLASSES[contact.last_status] || ''}`}>
                {STATUS_LABELS[contact.last_status] || contact.last_status}
              </span>
            ) : (
              <button
                className="number-list__send-one"
                onClick={() => handleSendOne(contact.phone_number)}
                disabled={sending || !selectedTemplate}
                title={selectedTemplate ? 'Enviar mensaje' : 'Selecciona un template primero'}
              >
                Enviar
              </button>
            )}
            <button
              className="number-list__remove"
              onClick={() => onRemove(contact.phone_number)}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NumberList;
