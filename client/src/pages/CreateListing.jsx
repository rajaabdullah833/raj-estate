import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    listingType: '',
    listingSubType: '',
    name: '',
    description: '',
    address: '',
    size: '',
    propertyAge: '',
    propertyCondition: '',
    bedrooms: '',
    lounge: '',
    regularPrice: '',
    discountPrice: '',
    imageUrls: [],
    amenities: {
      pool: false,
      parking: false,
      garden: false,
      gym: false,
      balcony: false,
      gatedCommunity: false,
      securityServices: false,
      conciergeServices: false,
    },
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);

  const listingTypes = [
    { value: 'Residential', label: 'Residential Listings' },
    { value: 'Commercial', label: 'Commercial Listings' },
    { value: 'Land', label: 'Land Listings' },
    { value: 'Rental', label: 'Rental Listings' },
  ];

  const residentialSubtypes = [
    'Houses',
    'Apartments',
    'Condos',
    'Villas',
    'Farmhouses',
  ];

  const commercialSubtypes = [
    'Office Spaces',
    'Retail Stores',
    'Warehouses',
    'Industrial Spaces',
    'Co-working Spaces',
  ];

  const landSubtypes = [
    'Corner Plots',
    'Residential Plots',
    'Commercial Plots',
    'Parkface Plots',
    'Bullaward',
    'General',
  ];

  const rentalSubtypes = [
    'Short-term Rentals',
    'Long-term Rentals',
  ];

  const propertyAgeOptions = [
    'Less than 1 year',
    '1-5 years',
    '6-10 years',
    '11-20 years',
    'More than 20 years',
  ];

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData((prevData) => ({
            ...prevData,
            imageUrls: prevData.imageUrls.concat(urls),
          }));
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };


  const handleListingTypeChange = (e) => {
    setFormData({
      ...formData,
      listingType: e.target.value,
      listingSubType: ''
    })
    
 
  };

  const handleSubtypeChange = (e) => {
 

    setFormData({
      ...formData,
      listingSubType: e.target.value
    })

  };

 
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        amenities: {
          ...prevData.amenities,
          [id]: checked,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };


  const subTypeOptions = ( ) => {
    if(formData.listingType === 'Residential') return residentialSubtypes
    if(formData.listingType === 'Commercial') return commercialSubtypes
    if(formData.listingType === 'Land') return landSubtypes
    if(formData.listingType === 'Rental' )return rentalSubtypes
    return []
  }


  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <label htmlFor='listingType'>Select Listing Type:
          {formData.listingType}
          {formData.listingType ? "true":"false"}--
          -- {formData.listingSubType}
 

          </label>
          <select
            id='listingType'
            className='border p-3 rounded-lg'
            value={formData.listingType}
            onChange={handleListingTypeChange}
            required
          >
            <option value=''>Choose a type</option>
            {listingTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        
            
            

        {formData.listingType && (
          <div className='flex flex-col gap-4 flex-1'>
            <label htmlFor='subtype'>Select Subtype:</label>
            <select
              id='subtype'
              className='border p-3 rounded-lg'
              value={formData.listingSubType}
              onChange={handleSubtypeChange}
              required
            >
              <option value=''>Choose a subtype</option>
            {
              subTypeOptions().map((item, i)=>(
                <option key={i} value={item} >
              {item}
              </option>
              ))
            }
            </select>
          </div>
        )}

        {    formData.listingSubType
 && ( 
          <>
            <h2 className='text-lg font-semibold mt-4'>Details for {formData.listingSubType}</h2>
            <input
              type='text'
              placeholder='Property Name'
              className='border p-3 rounded-lg'
              id='name'
              maxLength='62'
              minLength='10'
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type='text'
              placeholder='Property Description'
              className='border p-3 rounded-lg'
              id='description'
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type='text'
              placeholder='Address'
              className='border p-3 rounded-lg'
              id='address'
              required
              onChange={handleChange}
              value={formData.address}
            />
            <input
              type='text'
              placeholder='Size/Area'
              className='border p-3 rounded-lg'
              id='size'
              required
              onChange={handleChange}
              value={formData.size}
            />
            <label htmlFor='regularPrice' className='mt-3'>Regular Price:</label>
            <input
              type='number'
              placeholder='Regular Price'
              className='border p-3 rounded-lg'
              id='regularPrice'
              min='1000'
              required
              onChange={handleChange}
              value={formData.regularPrice}
            />
            <label htmlFor='discountPrice' className='mt-3'>Discounted Price:</label>
            <input
              type='number'
              placeholder='Discounted Price'
              className='border p-3 rounded-lg'
              id='discountPrice'
              min='0'
              onChange={handleChange}
              value={formData.discountPrice}
            />
          </>
        )}

        {    formData.listingSubType
 && (
          <>
            <label htmlFor='propertyAge'>Property Age/Year Built:</label>
            <select
              id='propertyAge'
              className='border p-3 rounded-lg mb-4'
              onChange={handleChange}
              required
            >
              <option value=''>Select Property Age</option>
              {propertyAgeOptions.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>

            <label htmlFor='propertyCondition'>Property Condition:</label>
            <select
              id='propertyCondition'
              className='border p-3 rounded-lg mb-4'
              onChange={handleChange}
              required
            >
              <option value=''>Select Property Condition</option>
              <option value='New'>New</option>
              <option value='Good'>Good</option>
              <option value='Fair'>Fair</option>
              <option value='Needs Work'>Needs Work</option>
            </select>

            <div className='flex gap-4'>
              <input
                type='number'
                placeholder='Bedrooms'
                className='border p-3 rounded-lg mb-4 flex-1'
                id='bedrooms'
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <input
                type='number'
                placeholder='Lounge'
                className='border p-3 rounded-lg mb-4 flex-1'
                id='lounge'
                required
                onChange={handleChange}
                value={formData.lounge}
              />
            </div>

            <h2 className='text-lg font-semibold mt-4'>Amenities:</h2>
            <div className='flex gap-4'>
              {Object.keys(formData.amenities).map((amenity) => (
                <div key={amenity} className='flex items-center'>
                  <input
                    type='checkbox'
                    id={amenity}
                    checked={formData.amenities[amenity]}
                    onChange={handleChange}
                  />
                  <label htmlFor={amenity} className='ml-2'>
                    {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                  </label>
                </div>
              ))}
            </div>
            <div className='flex flex-1 gap-4 sm:flex-row'>
            <div className='flex flex-col sm:flex-col flex-1 gap-4'>
              <input
                onChange={(e) => setFiles(e.target.files)}
                className='p-3 border border-gray-300 rounded'
                type='file'
                id='images'
                accept='image/*'
                multiple
              />
              <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            <p className='text-red-700 text-sm'>
              {imageUploadError && imageUploadError}
            </p>

            
            {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
              key={url}
              className='flex justify-between p-3 border items-center'
              >
                <img
                src={url}
                alt='listing image'
                className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                  >
                    Delete
                </button>
              </div>
            ))}
            </div>            
            <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
          </>
        )}
      </form>
    </main>
  );
}
