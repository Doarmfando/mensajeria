const templateService = require("../services/templateService");

/**
 * GET /api/templates
 */
async function getAll(req, res) {
  try {
    const templates = await templateService.getTemplates();
    res.json({ success: true, data: templates });
  } catch (error) {
    console.error("Error obteniendo templates:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
}

/**
 * GET /api/templates/approved
 */
async function getApproved(req, res) {
  try {
    const templates = await templateService.getTemplates();
    const approved = templates.filter((t) => t.status === "APPROVED");
    console.log("Templates aprobados:", approved.map(t => ({ name: t.name, lang: t.language, components: t.components.map(c => c.type + (c.format ? ':' + c.format : '')) })));
    res.json({ success: true, data: approved });
  } catch (error) {
    console.error("Error obteniendo templates aprobados:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
}

/**
 * POST /api/templates
 * Crear template. Si tiene imagen, viene como multipart/form-data via multer
 */
async function create(req, res) {
  try {
    const { name, language, category, headerType, headerContent, bodyText, footerText } = req.body;

    if (!name || !bodyText || !category) {
      return res.status(400).json({ error: "Los campos 'name', 'bodyText' y 'category' son obligatorios" });
    }

    const templateName = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

    let result;

    if (headerType === "IMAGE" && req.file) {
      result = await templateService.createFullTemplate(
        templateName,
        language || "es",
        category,
        {
          headerType: "IMAGE",
          imageBuffer: req.file.buffer,
          imageMimeType: req.file.mimetype,
          bodyText,
          footerText,
        }
      );
    } else if (headerType === "TEXT" || footerText) {
      result = await templateService.createFullTemplate(
        templateName,
        language || "es",
        category,
        { headerType: headerType || null, headerContent: headerContent || null, bodyText, footerText }
      );
    } else {
      result = await templateService.createTemplate(templateName, language || "es", category, bodyText);
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creando template:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
}

/**
 * DELETE /api/templates/:name
 */
async function remove(req, res) {
  try {
    const { name } = req.params;
    if (!name) {
      return res.status(400).json({ error: "El nombre del template es obligatorio" });
    }
    const result = await templateService.deleteTemplate(name);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error eliminando template:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
}

module.exports = { getAll, getApproved, create, remove };
