import { SUPABASE_URL, SUPABASE_KEY } from './db-client';

// Helper for making Supabase REST API calls
const supabaseRestCall = async (endpoint: string, options: RequestInit = {}, session?: { access_token: string } | null) => {
  const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || response.statusText);
  }

  return await response.json();
};

// Upload file
export const uploadFile = async (bucketName: string, filePath: string, file: File, session?: { access_token: string } | null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucketName}/${filePath}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Download file
export const downloadFile = async (bucketName: string, filePath: string, session?: { access_token: string } | null) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucketName}/${filePath}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

// List files
export const listFiles = async (bucketName: string, prefix?: string, session?: { access_token: string } | null) => {
  try {
    let url = `${SUPABASE_URL}/storage/v1/object/list/${bucketName}`;
    if (prefix) url += `?prefix=${prefix}`;

    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

// Delete file
export const deleteFile = async (bucketName: string, filePath: string, session?: { access_token: string } | null) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucketName}/${filePath}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Create bucket
export const createBucket = async (bucketName: string, isPublic: boolean = false, session?: { access_token: string } | null) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`
      },
      body: JSON.stringify({
        name: bucketName,
        public: isPublic
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating bucket:', error);
    throw error;
  }
};

// Delete bucket
export const deleteBucket = async (bucketName: string, session?: { access_token: string } | null) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${bucketName}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return true;
  } catch (error) {
    console.error('Error deleting bucket:', error);
    throw error;
  }
};

// Get public URL
export const getPublicUrl = (bucketName: string, filePath: string) => {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${filePath}`;
};

// Move file
export const moveFile = async (bucketName: string, fromPath: string, toPath: string, session?: { access_token: string } | null) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${session?.access_token || SUPABASE_KEY}`
      },
      body: JSON.stringify({
        bucketId: bucketName,
        sourceKey: fromPath,
        destinationKey: toPath
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error moving file:', error);
    throw error;
  }
}; 