import { useState, useEffect } from 'react';
import MessageForm from '../../components/MessageForm/MessageForm';
import NumberList from '../../components/NumberList/NumberList';
import ResultSummary from '../../components/ResultSummary/ResultSummary';
import { sendBulkTemplate, getApprovedTemplates } from '../../services/api';
import './Home.css';

function Home() {
  const [numbers, setNumbers] = useState([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    getApprovedTemplates()
      .then((res) => setTemplates(res.data.data))
      .catch(() => {});
  }, []);

  function handleAddNumber(number) {
    if (numbers.includes(number)) {
      setError('Ese numero ya fue agregado');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setNumbers([...numbers, number]);
    setError('');
  }

  function handleRemoveNumber(index) {
    setNumbers(numbers.filter((_, i) => i !== index));
  }

  function handleClearNumbers() {
    setNumbers([]);
  }

  async function handleSendTemplate(templateId, templateName, languageCode, templateComponents) {
    if (numbers.length === 0) {
      setError('Agrega al menos un numero antes de enviar');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!templateName) {
      setError('Selecciona un template antes de enviar');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSending(true);
    setError('');
    setResult(null);

    try {
      const response = await sendBulkTemplate(numbers, templateName, languageCode, templateComponents);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar template');
    } finally {
      setSending(false);
    }
  }

  function handleCloseResult() {
    setResult(null);
  }

  return (
    <main className="home">
      <div className="home__container">
        {error && <div className="home__error">{error}</div>}

        <div className="home__grid">
          <div className="home__left">
            <MessageForm
              onAddNumber={handleAddNumber}
              onSendTemplate={handleSendTemplate}
              sending={sending}
              templates={templates}
            />
          </div>
          <div className="home__right">
            <NumberList
              numbers={numbers}
              onRemove={handleRemoveNumber}
              onClear={handleClearNumbers}
            />
          </div>
        </div>

        {result && (
          <ResultSummary result={result} onClose={handleCloseResult} />
        )}
      </div>
    </main>
  );
}

export default Home;
