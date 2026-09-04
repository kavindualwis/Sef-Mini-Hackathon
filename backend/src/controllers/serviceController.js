const Service = require('../models/Service');

// Category default thumbnail images
const CATEGORY_IMAGES = {
  Plumbing: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
  Electrical: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
  'Home Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
  Painting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80',
  'AC Repair': 'https://images.unsplash.com/photo-1631545806682-15f573f55099?w=600&auto=format&fit=crop&q=80',
  'Vehicle Service': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
  'Tech Support': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
  Carpentry: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
  Gardening: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80',
  Roofing: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=600&auto=format&fit=crop&q=80',
  'Pest Control': 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=600&auto=format&fit=crop&q=80',
  'Appliance Repair': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
  Other: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
};

// Create Service
const createService = async (req, res) => {
  try {
    const { userId, providerName, providerEmail, title, category, experience, price, description, location, coverImage } = req.body;

    if (!title || !category || !experience || !price || !description) {
      return res.status(400).json({ message: 'Please provide all required service details' });
    }

    const defaultImage = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Other;

    const service = new Service({
      userId: userId || '650000000000000000000000',
      providerName: providerName || 'Verified Provider',
      providerEmail: providerEmail || 'provider@fixmate.lk',
      title,
      category,
      experience,
      price,
      description,
      location: location || { address: 'Colombo, Sri Lanka', lat: 6.9271, lng: 79.8612, city: 'Colombo' },
      coverImage: coverImage || defaultImage,
    });

    await service.save();
    console.log(`[SERVICE CREATED] ${title} (${category}) by ${providerName}`);

    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Failed to create service', error: error.message });
  }
};

// Get All Services (with optional category filter & search)
const getAllServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category && category !== 'All' && category !== 'Trending') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { providerName: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};

// Get My Services
const getMyServices = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const services = await Service.find({ providerEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user services' });
  }
};

// Delete Service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete service' });
  }
};

// Update Service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, experience, price, description, location } = req.body;

    const defaultImage = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Other;

    const updated = await Service.findByIdAndUpdate(
      id,
      {
        title,
        category,
        experience,
        price,
        description,
        location,
        coverImage: defaultImage,
      },
      { new: true }
    );

    res.status(200).json({ message: 'Service updated successfully', service: updated });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Failed to update service' });
  }
};

// Get Service By ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch service details' });
  }
};

module.exports = {
  createService,
  getAllServices,
  getMyServices,
  getServiceById,
  updateService,
  deleteService,
};
