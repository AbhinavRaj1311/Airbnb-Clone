import Property from '../models/Property.js'
import { config } from '../config/index.js'
import { IN_MEMORY_PROPERTY } from '../config/inMemoryData.js'

/**
 * GET /api/properties
 * Returns all properties (abbreviated for listing cards)
 */
export const getAllProperties = async (req, res) => {
  try {
    if (config.useInMemory) {
      return res.json({ success: true, data: [IN_MEMORY_PROPERTY], source: 'in-memory' })
    }

    const properties = await Property.find({}, '-images -reviews -description').lean()
    res.json({ success: true, data: properties, source: 'mongodb' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

/**
 * GET /api/properties/:id
 * Returns a single property with all fields
 */
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params

    if (config.useInMemory) {
      if (id === IN_MEMORY_PROPERTY.id || id === 'featured') {
        return res.json({ success: true, data: IN_MEMORY_PROPERTY, source: 'in-memory' })
      }
      return res.status(404).json({ success: false, error: 'Property not found' })
    }

    const property = await Property.findOne({ id }).lean()
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' })
    }

    res.json({ success: true, data: property, source: 'mongodb' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

/**
 * GET /api/properties/featured
 * Returns the featured/showcase property
 */
export const getFeaturedProperty = async (req, res) => {
  try {
    if (config.useInMemory) {
      return res.json({ success: true, data: IN_MEMORY_PROPERTY, source: 'in-memory' })
    }

    const property = await Property.findOne({ isGuestFavorite: true }).lean()
    if (!property) {
      return res.status(404).json({ success: false, error: 'No featured property found' })
    }

    res.json({ success: true, data: property, source: 'mongodb' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
