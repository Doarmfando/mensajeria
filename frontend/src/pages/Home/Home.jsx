import { useState, useEffect } from 'react';
import MessageForm from '../../components/MessageForm/MessageForm';
import NumberList from '../../components/NumberList/NumberList';
import ResultSummary from '../../components/ResultSummary/ResultSummary';
import { sendBulkTemplate, getApprovedTemplates, getContacts, saveContact, deleteContact } from '../../services/api';
import './Home.css';

function Home() {
  const [contacts, setContacts] = useState([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  function loadContacts() {
    getContacts()
      .then((res) => setContacts(res.data.data))
      .catch(() => {});
  }

  useEffect(() => {
    getApprovedTemplates()
      .then((res) => setTemplates(res.data.data))
      .catch(() => {});
    loadContacts();
  }, []);

  async function handleAddNumber(number) {
    // Agregar 51 si solo tiene 9 digitos
    if (/^\d{9}$/.test(number)) number = '51' + number;

    if (contacts.some((c) => c.phone_number === number)) {
      setError('Ese numero ya fue agregado');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setError('');
    try {
      await saveContact(number);
      loadContacts();
    } catch (err) {
      setError('Error al guardar numero');
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleRemoveNumber(phone) {
    try {
      await deleteContact(phone);
      loadContacts();
    } catch (err) {
      setError('Error al eliminar numero');
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleClearNumbers() {
    for (const c of contacts) {
      await deleteContact(c.phone_number);
    }
    setContacts([]);
  }

  async function handleSendTemplate(templateId, templateName, languageCode, templateComponents) {
    // Filtrar solo los que NO tienen estado (nunca se les envio)
    const pending = contacts.filter((c) => !c.last_status);

    if (pending.length === 0) {
      setError('Todos los numeros ya fueron enviados');
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
      const numbers = pending.map((c) => c.phone_number);
      const response = await sendBulkTemplate(numbers, templateName, languageCode, templateComponents);
      setResult(response.data);
      loadContacts();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar template');
    } finally {
      setSending(false);
    }
  }

  async function handleSendToOne(phone, templateId, templateName, languageCode, templateComponents) {
    if (!templateName) {
      setError('Selecciona un template antes de enviar');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSending(true);
    setError('');
    setResult(null);

    try {
      const response = await sendBulkTemplate([phone], templateName, languageCode, templateComponents);
      setResult(response.data);
      loadContacts();
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
              onSelectTemplate={setSelectedTemplate}
              pendingCount={contacts.filter((c) => !c.last_status).length}
            />
          </div>
          <div className="home__right">
            <NumberList
              contacts={contacts}
              onRemove={handleRemoveNumber}
              onClear={handleClearNumbers}
              onSendToOne={handleSendToOne}
              selectedTemplate={selectedTemplate}
              sending={sending}
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
