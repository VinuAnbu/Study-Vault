import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useParams } from 'react-router-dom';

const SubjectDetail = () => {
  const { id } = useParams();
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    axios.get(`/api/resources/subject/${id}`)
      .then(res => setResources(res.data))
      .catch(err => console.error(err));
  }, [id]);
  
  const filtered = resources.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Subject Resources</h1>
      <input 
        type="text" 
        placeholder="Search resources..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      />
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(resource => (
          <div key={resource._id} className="bg-white p-4 rounded shadow hover:shadow-lg relative">
            <h2 className="font-semibold">{resource.title}</h2>
            <p>{resource.comment}</p>
            <p className="text-sm text-gray-500">By {resource.author} on {new Date(resource.createdAt).toLocaleDateString()}</p>
            <div className="mt-2">
              <a href={resource.fileUrl} download className="text-blue-600 hover:underline">Download</a>
              {resource.quiz && (
                <button className="ml-4 text-blue-600 hover:underline" onClick={() => alert('Open quiz modal')}>Quiz Available</button>
              )}
            </div>
            <button className="absolute top-2 right-2" onClick={() => {
              axios.post(`/api/resources/${resource._id}/like`)
                .then(res => alert(`Liked! Total likes: ${res.data.likes}`))
                .catch(err => console.error(err));
            }}>
              👍 {resource.likes}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectDetail;
