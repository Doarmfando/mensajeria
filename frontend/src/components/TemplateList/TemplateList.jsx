import './TemplateList.css';

const STATUS_LABELS = {
  APPROVED: 'Aprobado',
  PENDING: 'Pendiente',
  REJECTED: 'Rechazado',
};

function TemplateList({ templates, onDelete, loading }) {
  if (loading) {
    return (
      <div className="template-list template-list--empty">
        <p className="template-list__empty-text">Cargando templates...</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="template-list template-list--empty">
        <p className="template-list__empty-text">No hay templates creados</p>
      </div>
    );
  }

  return (
    <div className="template-list">
      <h3 className="template-list__title">Templates ({templates.length})</h3>
      <div className="template-list__items">
        {templates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-card__header">
              <span className="template-card__name">{template.name}</span>
              <span className={`template-card__status template-card__status--${template.status.toLowerCase()}`}>
                {STATUS_LABELS[template.status] || template.status}
              </span>
            </div>

            <div className="template-card__body">
              {template.components?.map((comp, i) => {
                if (comp.type === 'HEADER') {
                  return <p key={i} className="template-card__header-text">{comp.text}</p>;
                }
                if (comp.type === 'BODY') {
                  return <p key={i} className="template-card__message">{comp.text}</p>;
                }
                if (comp.type === 'FOOTER') {
                  return <p key={i} className="template-card__footer-text">{comp.text}</p>;
                }
                return null;
              })}
            </div>

            <div className="template-card__footer">
              <span className="template-card__info">
                {template.language} · {template.category}
              </span>
              <button
                className="template-card__delete"
                onClick={() => onDelete(template.name)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplateList;
