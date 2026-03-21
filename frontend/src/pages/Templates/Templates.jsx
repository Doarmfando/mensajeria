import { useState, useEffect } from 'react';
import TemplateForm from '../../components/TemplateForm/TemplateForm';
import TemplateList from '../../components/TemplateList/TemplateList';
import { getTemplates, createTemplate, deleteTemplate } from '../../services/api';
import './Templates.css';

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchTemplates() {
    setLoadingList(true);
    try {
      const response = await getTemplates();
      setTemplates(response.data.data.filter(t => t.name !== 'hello_world'));
    } catch (err) {
      setError('Error al cargar templates');
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function handleCreate(data) {
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      await createTemplate(data);
      setSuccess('Template creado. Meta lo revisara y aprobara en minutos/horas.');
      fetchTemplates();
    } catch (err) {
      setError(err.response?.data?.error?.error?.message || 'Error al crear template');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(name) {
    setError('');
    setSuccess('');

    try {
      await deleteTemplate(name);
      setSuccess(`Template "${name}" eliminado`);
      fetchTemplates();
    } catch (err) {
      setError('Error al eliminar template');
    }
  }

  return (
    <main className="templates-page">
      <div className="templates-page__container">
        {error && <div className="templates-page__error">{error}</div>}
        {success && <div className="templates-page__success">{success}</div>}

        <div className="templates-page__grid">
          <div className="templates-page__left">
            <TemplateForm onSubmit={handleCreate} loading={creating} />
          </div>
          <div className="templates-page__right">
            <TemplateList
              templates={templates}
              onDelete={handleDelete}
              loading={loadingList}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Templates;
