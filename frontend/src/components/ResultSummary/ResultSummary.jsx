import './ResultSummary.css';

function ResultSummary({ result, onClose }) {
  if (!result) return null;

  return (
    <div className="result-summary">
      <div className="result-summary__header">
        <h3 className="result-summary__title">Resultado del envio</h3>
        <button className="result-summary__close" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="result-summary__stats">
        <div className="result-summary__stat">
          <span className="result-summary__stat-value">{result.summary.total}</span>
          <span className="result-summary__stat-label">Total</span>
        </div>
        <div className="result-summary__stat result-summary__stat--success">
          <span className="result-summary__stat-value">{result.summary.sent}</span>
          <span className="result-summary__stat-label">Enviados</span>
        </div>
        <div className="result-summary__stat result-summary__stat--error">
          <span className="result-summary__stat-value">{result.summary.failed}</span>
          <span className="result-summary__stat-label">Fallidos</span>
        </div>
      </div>

      <ul className="result-summary__details">
        {result.details.map((item, index) => (
          <li
            key={index}
            className={`result-summary__detail ${
              item.status === 'sent'
                ? 'result-summary__detail--sent'
                : 'result-summary__detail--failed'
            }`}
          >
            <span className="result-summary__detail-number">{item.number}</span>
            <span className="result-summary__detail-status">
              {item.status === 'sent' ? 'Enviado' : 'Fallido'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResultSummary;
