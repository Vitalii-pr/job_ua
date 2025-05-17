// components/RecommendationDialog.tsx
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react'
import { useState } from 'react'

export default function RecommendationDialog({ isOpen, onClose }) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log('Form submitted:', formData)
    
    // Show success message and close after 2 seconds
    setIsSubmitted(true)
    setTimeout(() => {
      onClose()
      setIsSubmitted(false)
      setFormData({ name: '', email: '', message: '' }) // Reset form
    }, 2000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl">
          {isSubmitted ? (
            <div className="text-center py-4">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mt-2 text-lg font-medium">Запит на рекомендацію успішно надіслано!</h3>
              <p className="mt-1 text-sm text-gray-500">Дякуємо за ваш запит.</p>
            </div>
          ) : (
            <>
              <DialogTitle className="text-lg font-bold">Нова рекомендація</DialogTitle>
              <Description className="text-sm text-gray-600">
                Введіть деталі, щоб надіслати запит
              </Description>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Ім'я</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Введіть ім'я"
                    className="w-full rounded border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Введіть email"
                    className="w-full rounded border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Повідомлення</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Повідомлення для рекомендації"
                    className="w-full rounded border px-3 py-2"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
                  >
                    Надіслати
                  </button>
                </div>
              </form>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  )
}