import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Define allowed fields for security
const ALLOWED_FIELDS = [
  'primary_image',
  'title',
  'description',
  'images',
  'category',
  'thumbnail_index',
  'thumbnail_reason',
  'raw_content',
  'status',
  'notes'
] as const

type AllowedField = typeof ALLOWED_FIELDS[number]

interface UpdateFieldRequest {
  id: number
  field: string
  value: any
}

interface UpdateFieldResponse {
  success: boolean
  message?: string
  error?: string
  updatedItem?: any
  validationErrors?: string[]
}

export async function POST(request: NextRequest): Promise<NextResponse<UpdateFieldResponse>> {
  try {
    const supabase = getSupabase();
    console.log('=== UPDATE FIELD REQUEST ===')

    // Parse and validate request body
    let body: UpdateFieldRequest
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body'
      }, { status: 400 })
    }

    const { id, field, value } = body

    // Validate required fields
    if (!id || typeof id !== 'number') {
      return NextResponse.json({
        success: false,
        error: 'Invalid or missing item ID (must be a number)'
      }, { status: 400 })
    }

    if (!field || typeof field !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Invalid or missing field name (must be a string)'
      }, { status: 400 })
    }

    // Validate field is allowed
    if (!ALLOWED_FIELDS.includes(field as AllowedField)) {
      return NextResponse.json({
        success: false,
        error: `Field '${field}' is not allowed. Allowed fields: ${ALLOWED_FIELDS.join(', ')}`
      }, { status: 400 })
    }

    console.log(`Updating item ${id}, field '${field}'`)

    // Field-specific validation
    const validationErrors = validateFieldValue(field as AllowedField, value)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        validationErrors
      }, { status: 400 })
    }

    // Check if item exists
    const { data: existingItem, error: fetchError } = await supabase
      .from('staging_queue')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching item:', fetchError)
      return NextResponse.json({
        success: false,
        error: `Item with ID ${id} not found`
      }, { status: 404 })
    }

    if (!existingItem) {
      return NextResponse.json({
        success: false,
        error: `Item with ID ${id} not found`
      }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {
      [field]: value,
      updated_at: new Date().toISOString()
    }

    // Special handling for primary_image updates
    if (field === 'primary_image') {
      // If we're updating primary_image and have images array, find the index
      if (existingItem.images && Array.isArray(existingItem.images)) {
        const imageIndex = existingItem.images.indexOf(value)
        if (imageIndex >= 0) {
          // Only add these fields if they exist in the schema (conditional update)
          try {
            // Try to check if columns exist by attempting a test query
            const { data: testData, error: testError } = await supabase
              .from('staging_queue')
              .select('thumbnail_index, thumbnail_reason')
              .eq('id', id)
              .limit(1)
            
            if (!testError && testData) {
              // Columns exist, safe to update
              updateData.thumbnail_index = imageIndex
              updateData.thumbnail_reason = `Admin override: selected image ${imageIndex + 1}`
            }
          } catch (columnError) {
            console.log('Thumbnail columns not available, skipping thumbnail metadata update')
          }
        }
      }
    }

    // Perform the update
    const { data: updatedItem, error: updateError } = await supabase
      .from('staging_queue')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single()

    if (updateError) {
      console.error('Error updating item:', updateError)
      return NextResponse.json({
        success: false,
        error: `Failed to update item: ${updateError.message}`
      }, { status: 500 })
    }

    console.log(`Successfully updated item ${id}`)

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${field}`,
      updatedItem
    })

  } catch (error) {
    console.error('Unexpected error in update-field:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Field-specific validation function
function validateFieldValue(field: AllowedField, value: any): string[] {
  const errors: string[] = []

  switch (field) {
    case 'primary_image':
      if (typeof value !== 'string' || !value.trim()) {
        errors.push('Primary image must be a non-empty string')
      } else {
        // Basic URL validation
        try {
          new URL(value)
        } catch {
          errors.push('Primary image must be a valid URL')
        }
      }
      break

    case 'title':
      if (typeof value !== 'string' || !value.trim()) {
        errors.push('Title must be a non-empty string')
      } else if (value.length > 200) {
        errors.push('Title must be 200 characters or less')
      }
      break

    case 'description':
      if (value !== null && typeof value !== 'string') {
        errors.push('Description must be a string or null')
      } else if (typeof value === 'string' && value.length > 2000) {
        errors.push('Description must be 2000 characters or less')
      }
      break

    case 'images':
      if (!Array.isArray(value)) {
        errors.push('Images must be an array')
      } else {
        // Validate each image URL
        value.forEach((url, index) => {
          if (typeof url !== 'string' || !url.trim()) {
            errors.push(`Image ${index + 1} must be a non-empty string`)
          } else {
            try {
              new URL(url)
            } catch {
              errors.push(`Image ${index + 1} must be a valid URL`)
            }
          }
        })
      }
      break

    case 'category':
      const validCategories = ['activities', 'hotels', 'restaurants', 'shopping']
      if (typeof value !== 'string' || !validCategories.includes(value)) {
        errors.push(`Category must be one of: ${validCategories.join(', ')}`)
      }
      break

    case 'thumbnail_index':
      if (typeof value !== 'number' || value < 0 || !Number.isInteger(value)) {
        errors.push('Thumbnail index must be a non-negative integer')
      }
      break

    case 'thumbnail_reason':
      if (typeof value !== 'string' || !value.trim()) {
        errors.push('Thumbnail reason must be a non-empty string')
      }
      break

    case 'status':
      const validStatuses = ['pending', 'approved', 'rejected', 'published']
      if (typeof value !== 'string' || !validStatuses.includes(value)) {
        errors.push(`Status must be one of: ${validStatuses.join(', ')}`)
      }
      break

    case 'notes':
      if (value !== null && typeof value !== 'string') {
        errors.push('Notes must be a string or null')
      } else if (typeof value === 'string' && value.length > 1000) {
        errors.push('Notes must be 1000 characters or less')
      }
      break

    case 'raw_content':
      if (typeof value !== 'object' || value === null) {
        errors.push('Raw content must be an object')
      }
      break

    default:
      errors.push(`Unknown field: ${field}`)
  }

  return errors
}

// GET method for checking allowed fields (useful for frontend)
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    allowedFields: ALLOWED_FIELDS,
    fieldDescriptions: {
      primary_image: 'Main thumbnail image URL',
      title: 'Item title (max 200 chars)',
      description: 'Item description (max 2000 chars)',
      images: 'Array of image URLs',
      category: 'Item category (activities, hotels, restaurants, shopping)',
      thumbnail_index: 'Index of primary image in images array',
      thumbnail_reason: 'Reason for thumbnail selection',
      raw_content: 'Raw scraped content object',
      status: 'Item status (pending, approved, rejected, published)',
      notes: 'Admin notes (max 1000 chars)'
    }
  })
}