const { AI_MATERIAL_CATALOG, classifyWaste } = require('../services/aiClassifierService');

exports.getCatalog = (req, res) => {
  res.json(AI_MATERIAL_CATALOG);
};

exports.classify = (req, res) => {
  try {
    const { sampleKey, description, filename } = req.body;

    let targetFilename = filename || '';
    if (sampleKey) {
      targetFilename = sampleKey;
    }

    const classification = classifyWaste(targetFilename, description || '');
    res.json(classification);
  } catch (err) {
    console.error('AI classification error:', err);
    res.status(500).json({ error: 'AI Classification failed' });
  }
};
