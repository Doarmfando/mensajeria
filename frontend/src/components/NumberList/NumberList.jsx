import './NumberList.css';

function NumberList({ numbers, onRemove, onClear }) {
  if (numbers.length === 0) {
    return (
      <div className="number-list number-list--empty">
        <p className="number-list__empty-text">No hay numeros agregados</p>
      </div>
    );
  }

  return (
    <div className="number-list">
      <div className="number-list__header">
        <span className="number-list__count">{numbers.length} numero(s)</span>
        <button className="number-list__clear" onClick={onClear}>
          Limpiar todo
        </button>
      </div>
      <ul className="number-list__items">
        {numbers.map((number, index) => (
          <li key={index} className="number-list__item">
            <span className="number-list__number">{number}</span>
            <button
              className="number-list__remove"
              onClick={() => onRemove(index)}
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
