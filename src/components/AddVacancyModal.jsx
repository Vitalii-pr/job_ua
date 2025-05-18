import React, { useState } from 'react';

const AddVacancyModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    Title: '',
    Position: '',
    Qualification: '',
    Work_format: '',
    Work_type: '',
    Work_place: '',
    English_lvl: '',
    Description: '',
    Payrate: 0,
    Skills: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Basic validation
      if (!formData.Title || !formData.Position || !formData.Qualification) {
        alert('Будь ласка, заповніть обов\'язкові поля');
        return;
      }

      // Prepare payload matching your VacancyBox structure
      const payload = {
        Title: formData.Title,
        Position: formData.Position,
        Qualification: formData.Qualification,
        Work_format: formData.Work_format,
        Work_type: formData.Work_type,
        Work_place: formData.Work_place,
        English_lvl: formData.English_lvl,
        Description: formData.Description,
        Payrate: Number(formData.Payrate) || 0,
        Skills: formData.Skills,
        Created_at: new Date().toISOString(),
        Wieved: 0, // Initialize view count
        isActive: true
      };

      await onSubmit(payload);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#84112D]">Додати нову вакансію</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Назва вакансії*</label>
                <input
                  type="text"
                  name="Title"
                  value={formData.Title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84112D] focus:border-transparent"
                />
              </div>
              
              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Посада*</label>
                <select
                  name="Position"
                  value={formData.Position}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84112D] focus:border-transparent"
                >
                  <option value="">Оберіть посаду</option>
                  <option value="UI UX Designer">UI/UX Designer</option>
                  <option value="Motion Designer">Motion Designer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                </select>
              </div>
              
              {/* Qualification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Рівень кваліфікації*</label>
                <select
                  name="Qualification"
                  value={formData.Qualification}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84112D] focus:border-transparent"
                >
                  <option value="">Оберіть рівень</option>
                  <option value="Junior">Junior</option>
                  <option value="Middle">Middle</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              
              {/* Work Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Формат роботи*</label>
                <select
                  name="Work_format"
                  value={formData.Work_format}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84112D] focus:border-transparent"
                >
                  <option value="">Оберіть формат</option>
                  <option value="Віддалена">Віддалена</option>
                  <option value="Віддалена/офіс">Віддалена/офіс</option>
                  <option value="Офіс">Офіс</option>
                </select>
              </div>
              
              {/* Work Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип зайнятості*</label>
                <select
                  name="Work_type"
                  value={formData.Work_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84112D] focus:border-transparent"
                >
                  <option value="">Оберіть тип</option>
                  <option value="Повна зайнятість">Повна зайнятість</option>
                  <option value="Неповна зайнятість">Неповна зайнятість</option>
                  <option value="Проектна робота">Проектна робота</option>
                  <option value="Стажування">Стажування</option>
                </select>
              </div>
              
              {/* Work Place */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Місце роботи*</label>
                <select
                  name="Work_place"
                  value={formData.Work_place}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84112D] focus:border-transparent"
                >
                  <option value="">Оберіть місце</option>
                  <option value="Світ">Світ</option>
                  <option value="Україна">Україна</option>
                  <option value="Львів">Львів</option>
                  <option value="Київ">Київ</option>
                </select>
              </div>
              
              {/* English Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Рівень англійської*</label>
                <select
                  name="English_lvl"
                  value={formData.English_lvl}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84112D] focus:border-transparent"
                >
                  <option value="">Оберіть рівень</option>
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Upper-Intermediate">Upper-Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              
              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Зарплата (₴)*</label>
                <input
                  type="number"
                  name="Payrate"
                  value={formData.Payrate}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84112D] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Опис вакансії*</label>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84112D] focus:border-transparent"
              />
            </div>
            
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Необхідні навички*</label>
              <input
                type="text"
                name="Skills"
                value={formData.Skills}
                onChange={handleChange}
                required
                placeholder="Наприклад: Figma 4, UI/UX 3, Prototyping 3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84112D] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Вкажіть навички та їх пріоритет (1-5), розділені комами</p>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-[#84112D] text-white rounded-md hover:bg-[#84112F] text-sm font-medium ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Публікація...' : 'Опублікувати вакансію'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVacancyModal;