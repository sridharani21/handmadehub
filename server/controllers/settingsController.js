const Settings = require('../models/Settings');

const getSettings = async (req, res) => {
  try {
    const delivery = await Settings.findOne({ key: 'deliveryCharge' });
    const freeAbove = await Settings.findOne({ key: 'freeDeliveryAbove' });

    res.json({
      deliveryCharge: delivery ? delivery.value : 50,
      freeDeliveryAbove: freeAbove ? freeAbove.value : 500,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { deliveryCharge, freeDeliveryAbove } = req.body;

    await Settings.findOneAndUpdate(
      { key: 'deliveryCharge' },
      { value: Number(deliveryCharge) },
      { upsert: true, new: true }
    );

    await Settings.findOneAndUpdate(
      { key: 'freeDeliveryAbove' },
      { value: Number(freeDeliveryAbove) },
      { upsert: true, new: true }
    );

    res.json({ message: 'Settings updated', deliveryCharge, freeDeliveryAbove });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSettings, updateSettings };