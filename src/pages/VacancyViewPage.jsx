import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const VacancyViewPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [vacancy, setVacancy] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const vacancyRef = doc(db, 'vacancies', id);
        const vacancySnap = await getDoc(vacancyRef);
        
        if (!vacancySnap.exists()) {
          throw new Error('Vacancy not found');
        }
        
        const vacancyData = {
          id: vacancySnap.id,
          ...vacancySnap.data(),
          createdAt: vacancySnap.data().createdAt || vacancySnap.data().Created_at
        };
        
        setVacancy(vacancyData);
        
        await updateDoc(vacancyRef, {
          views: (vacancyData.views || 0) + 1
        });
        
        if (vacancyData.hostId) {
          const companyRef = doc(db, 'users', vacancyData.hostId);
          const companySnap = await getDoc(companyRef);
          
          if (companySnap.exists()) {
            setCompany({
              id: companySnap.id,
              ...companySnap.data()
            });
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleApply = async () => {
    try {
      setApplied(true);
    } catch (err) {
      console.error('Application error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#84112D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-[#84112D] p-4">
          <p className="text-[#84112D]">{error}</p>
        </div>
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-[#84112D]">Vacancy not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Vacancy Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-[#84112D]/20">
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#84112D] mb-2">{vacancy.Title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                {company && (
                  <div className="flex items-center">
                    {company.photoURL ? (
                      <img 
                        src={company.photoURL} 
                        alt={company.companyName} 
                        className="w-10 h-10 rounded-full object-cover mr-2 border border-[#84112D]/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#84112D]/10 flex items-center justify-center mr-2 border border-[#84112D]/30">
                        <span className="text-[#84112D] text-sm">
                          {company.companyName?.charAt(0) || 'C'}
                        </span>
                      </div>
                    )}
                    <span className="text-[#84112D] font-medium">{company.companyName || 'Company'}</span>
                  </div>
                )}
                <span className="text-[#84112D]/80">
                  {new Date(vacancy.createdAt?.toDate || vacancy.createdAt).toLocaleDateString()}
                </span>
                <span className="text-[#84112D]/80">
                  {vacancy.views || 0} views
                </span>
              </div>
            </div>
            
            {currentUser?.role === 'candidate' && (
              <button
                onClick={handleApply}
                disabled={applied}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${applied 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-[#84112D] hover:bg-[#6a0e24] text-white shadow-md'}`}
              >
                {applied ? 'Applied' : 'Apply Now'}
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="px-3 py-1 bg-[#84112D]/10 text-[#84112D] rounded-full text-sm border border-[#84112D]/20">
              {vacancy.Position}
            </span>
            <span className="px-3 py-1 bg-[#84112D]/10 text-[#84112D] rounded-full text-sm border border-[#84112D]/20">
              {vacancy.Work_type}
            </span>
            <span className="px-3 py-1 bg-[#84112D]/10 text-[#84112D] rounded-full text-sm border border-[#84112D]/20">
              {vacancy.Work_format}
            </span>
            {vacancy.Payrate && (
              <span className="px-3 py-1 bg-[#84112D]/10 text-[#84112D] rounded-full text-sm border border-[#84112D]/20">
                {vacancy.Payrate.toLocaleString()}₴
              </span>
            )}
            {vacancy.English_lvl && (
              <span className="px-3 py-1 bg-[#84112D]/10 text-[#84112D] rounded-full text-sm border border-[#84112D]/20">
                English: {vacancy.English_lvl}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vacancy Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-[#84112D]/20">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-[#84112D] mb-4 border-b border-[#84112D]/20 pb-2">Job Description</h2>
              <div className="prose max-w-none text-gray-700">
                {vacancy.Description.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
          
          {/* Requirements */}
          {vacancy.Requirements && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-[#84112D]/20">
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-[#84112D] mb-4 border-b border-[#84112D]/20 pb-2">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {vacancy.Requirements.split('\n').map((item, i) => (
                    <li key={i} className="before:text-[#84112D]">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Responsibilities */}
          {vacancy.Responsibilities && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#84112D]/20">
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-[#84112D] mb-4 border-b border-[#84112D]/20 pb-2">Responsibilities</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {vacancy.Responsibilities.split('\n').map((item, i) => (
                    <li key={i} className="before:text-[#84112D]">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          {company && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 border border-[#84112D]/20">
              <h3 className="text-xl font-semibold text-[#84112D] mb-4 border-b border-[#84112D]/20 pb-2">About Company</h3>
              <div className="flex items-center mb-4">
                {company.photoURL ? (
                  <img 
                    src={company.photoURL} 
                    alt={company.companyName} 
                    className="w-16 h-16 rounded-full object-cover mr-4 border border-[#84112D]/30"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#84112D]/10 flex items-center justify-center mr-4 border border-[#84112D]/30">
                    <span className="text-[#84112D] text-xl">
                      {company.companyName?.charAt(0) || 'C'}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-[#84112D]">{company.companyName}</h4>
                  {company.companyWebsite && (
                    <a 
                      href={company.companyWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#84112D] hover:underline text-sm hover:text-[#6a0e24]"
                    >
                      {company.companyWebsite.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>
              
              {company.companyDescription && (
                <p className="text-gray-700 text-sm">
                  {company.companyDescription}
                </p>
              )}
            </div>
          )}
          
          {/* Job Overview */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 border border-[#84112D]/20">
            <h3 className="text-xl font-semibold text-[#84112D] mb-4 border-b border-[#84112D]/20 pb-2">Job Overview</h3>
            <div className="space-y-4">
              <div>
                <span className="block text-sm text-[#84112D]/80">Work Type</span>
                <span className="font-medium">{vacancy.Work_type}</span>
              </div>
              
              <div>
                <span className="block text-sm text-[#84112D]/80">Work Format</span>
                <span className="font-medium">{vacancy.Work_format}</span>
              </div>
              
              {vacancy.Qualification && (
                <div>
                  <span className="block text-sm text-[#84112D]/80">Experience Level</span>
                  <span className="font-medium">{vacancy.Qualification}</span>
                </div>
              )}
              
              {vacancy.Work_place && (
                <div>
                  <span className="block text-sm text-[#84112D]/80">Location</span>
                  <span className="font-medium">{vacancy.Work_place}</span>
                </div>
              )}
              
              {vacancy.Payrate && (
                <div>
                  <span className="block text-sm text-[#84112D]/80">Salary</span>
                  <span className="font-medium">
                    {vacancy.Payrate.toLocaleString()}₴
                  </span>
                </div>
              )}
              
              {vacancy.English_lvl && (
                <div>
                  <span className="block text-sm text-[#84112D]/80">English Level</span>
                  <span className="font-medium">{vacancy.English_lvl}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Apply Button */}
          {currentUser?.role === 'candidate' && (
            <button
              onClick={handleApply}
              disabled={applied}
              className={`w-full py-3 rounded-lg font-medium text-lg transition-colors ${applied 
                ? 'bg-green-100 text-green-800' 
                : 'bg-[#84112D] hover:bg-[#6a0e24] text-white shadow-md'}`}
            >
              {applied ? 'Application Submitted' : 'Apply for this Position'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VacancyViewPage;